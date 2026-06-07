import os
import random
import requests
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"

BASE_SERVERS = [
    {"id": "Scala Tamboré",    "base_temp": 68},
    {"id": "Equinix SP4",      "base_temp": 45},
    {"id": "ODATA SP02",       "base_temp": 71},
    {"id": "CTMM Itaú",        "base_temp": 38},
    {"id": "Equinix RJ1",      "base_temp": 52},
    {"id": "Ascenty SP1",      "base_temp": 41},
    {"id": "BR Digital DF1",   "base_temp": 62},
    {"id": "Copel DC Curitiba","base_temp": 35},
    {"id": "ODATA POA",        "base_temp": 43},
    {"id": "Tivit BH",         "base_temp": 58},
    {"id": "Embratel RJ",      "base_temp": 48},
    {"id": "NTT Campinas",     "base_temp": 44},
]

def _status(temp):
    if temp >= 65:
        return "critico"
    if temp >= 55:
        return "atenção"
    return "normal"

def generate_metrics():
    servers = []
    for s in BASE_SERVERS:
        temp = round(s["base_temp"] + random.uniform(-5, 5), 1)
        servers.append({"id": s["id"], "temp": temp, "status": _status(temp)})

    alerts = sum(1 for s in servers if s["status"] != "normal")
    avg_temp = round(sum(s["temp"] for s in servers) / len(servers), 1)
    energy = round(1250 + random.uniform(-80, 80), 1)
    carbon = round(energy * 0.0698, 1)
    pue = round(1.4 + random.uniform(-0.1, 0.2), 2)

    return {
        "temperature": avg_temp,
        "energyUsage": energy,
        "carbonEmission": carbon,
        "pue": pue,
        "alerts": alerts,
        "servers": servers,
    }


@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    return jsonify(generate_metrics())


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "Mensagem vazia"}), 400

    m = generate_metrics()
    servers_str = ", ".join(
        f"{s['id']} ({s['temp']}°C — {s['status']})" for s in m["servers"]
    )

    system_prompt = f"""Você é a Orbit AI, assistente especializada em monitoramento e otimização de data centers.
Sua função é analisar KPIs de energia, temperatura, carbono e eficiência, e fornecer recomendações práticas.
Responda sempre em português, de forma concisa e técnica.
Dados atuais do datacenter:

Temperatura média: {m['temperature']}°C
Consumo energético: {m['energyUsage']} kWh
Emissão de CO₂: {m['carbonEmission']} kg
PUE: {m['pue']}
Servidores em alerta: {m['alerts']}
Servidores: {servers_str}"""

    messages = [{"role": "system", "content": system_prompt}]

    for msg in history[-10:]:
        role = "user" if msg.get("sender") == "user" else "assistant"
        messages.append({"role": role, "content": msg.get("text", "")})

    messages.append({"role": "user", "content": user_message})

    try:
        groq_key = os.getenv("GROQ_API_KEY", "")
        resp = requests.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {groq_key}",
                "Content-Type": "application/json",
            },
            json={"model": MODEL, "messages": messages},
            timeout=60,
        )
        resp.raise_for_status()
        result = resp.json()
        reply = result["choices"][0]["message"]["content"]
        return jsonify({"response": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/space-weather", methods=["GET"])
def space_weather():
    nasa_key = os.getenv("NASA_API_KEY", "")
    today = datetime.now()
    start = (today - timedelta(days=7)).strftime("%Y-%m-%d")
    end = today.strftime("%Y-%m-%d")

    try:
        flr = requests.get(
            "https://api.nasa.gov/DONKI/FLR",
            params={"startDate": start, "endDate": end, "api_key": nasa_key},
            timeout=10,
        )
        flares = flr.json() if flr.ok else []
    except Exception:
        flares = []

    try:
        cme = requests.get(
            "https://api.nasa.gov/DONKI/CME",
            params={"startDate": start, "endDate": end, "api_key": nasa_key},
            timeout=10,
        )
        cmes = cme.json() if cme.ok else []
    except Exception:
        cmes = []

    risk = "baixo"
    for f in flares:
        cls = f.get("classType", "")
        if cls.startswith("X"):
            risk = "critico"
            break
        elif cls.startswith("M") and risk != "critico":
            risk = "alto"
        elif cls.startswith("C") and risk not in ("critico", "alto"):
            risk = "moderado"
    if len(cmes) >= 3 and risk == "baixo":
        risk = "moderado"

    fmt_flares = [
        {
            "class": f.get("classType", "N/A"),
            "begin": f.get("beginTime", ""),
            "peak": f.get("peakTime", ""),
            "region": f.get("activeRegionNum", "N/A"),
        }
        for f in flares[-5:]
    ]
    fmt_cmes = [
        {
            "time": c.get("startTime", ""),
            "note": (c.get("note") or "")[:120],
        }
        for c in cmes[-5:]
    ]

    return jsonify({
        "risk": risk,
        "flares": fmt_flares,
        "cmes": fmt_cmes,
        "period": f"{start} → {end}",
        "totalFlares": len(flares),
        "totalCmes": len(cmes),
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
