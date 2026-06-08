# OrbitX AI — Plataforma Inteligente para Datacenters Sustentáveis

> **FIAP Global Solution 2026/1 — Disciplina: IOT, IOB & Generative IA**
> OrbitX AI é uma plataforma de monitoramento inteligente para datacenters desenvolvida em **React 18 + Flask (Python)**. Utiliza **IA Generativa (LLaMA 3.3 70B via Groq)** e dados de **clima espacial da NASA DONKI** para entregar diagnósticos, alertas e recomendações em tempo real.

---

## Vídeo de Demonstração

> [![Assista ao vídeo de demonstração](https://img.youtube.com/vi/kfpY8qv7_oo/maxresdefault.jpg)](https://youtu.be/kfpY8qv7_oo)


---

## Integrantes

| Nome | RM |
|---|---|
| Fabio Henrique de Souza Eduardo | RM-560416 |
| Lucas Aurelio de Brito Chicote | RM-559366 |
| Gabriel Wu Castro | RM-560210 |
| Renato Kenji Sugaki | RM-559810 |

---

## Links

| Recurso | Link |
|---|---|
| **Repositório GitHub** | https://github.com/Wugabriel/OrbitX-IA |
| **Groq Console** | https://console.groq.com |
| **NASA API** | https://api.nasa.gov |

---

## Sobre o Projeto

O **OrbitX AI** é uma plataforma futurista de monitoramento inteligente desenvolvida para auxiliar datacenters na redução do consumo energético, prevenção de superaquecimento e diminuição da emissão de carbono.

A solução combina **Inteligência Artificial Generativa**, **dados climáticos espaciais da NASA** e **dashboards em tempo real** para oferecer análises automatizadas e recomendações práticas de otimização da infraestrutura digital.

---

## Funcionalidades

| Módulo | Descrição |
|---|---|
| **Monitoramento de Datacenters** | Temperatura, consumo energético (kWh), emissão de CO₂ (kg) e PUE de 12 datacenters brasileiros em tempo real |
| **Assistente Orbit AI** | Chat com LLaMA 3.3 70B via Groq, contextualizado com os dados reais do datacenter e histórico das últimas 10 mensagens |
| **Clima Espacial NASA DONKI** | Monitoramento de erupções solares (FLR) e ejeções de massa coronal (CME) com cálculo de risco geomagnético |
| **Mapa de Impacto** | Mapa interativo Leaflet com localização dos 12 datacenters e zonas polares coloridas pelo risco NASA |
| **Dashboard Futurista** | Modo escuro/claro, glassmorphism, gradientes espaciais, indicador "Ao Vivo" e atualização automática a cada 30s |
| **Sugestões Rápidas** | Atalhos de perguntas comuns para análise de temperatura, consumo, servidores críticos e relatório ESG |

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS v3 · Glassmorphism · Dark/Light mode |
| Backend | Python 3.10+ · Flask · Flask-CORS · python-dotenv |
| IA Generativa | Groq API — modelo `llama-3.3-70b-versatile` |
| Clima Espacial | NASA DONKI API — Solar Flares (FLR) + CME |
| Mapa | Leaflet + react-leaflet v4 · CartoDB Dark Matter tiles |

---

## Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                  React 18 + TypeScript + Vite               │
│                                                              │
│  ┌──────────────────┐        ┌───────────────────────────┐  │
│  │  MetricsDashboard │        │          Chat             │  │
│  │  • KPIs em tempo │        │  • Orbit AI (LLaMA 3.3)   │  │
│  │    real          │        │  • Histórico de mensagens  │  │
│  │  • 12 Servidores │        │  • Sugestões rápidas       │  │
│  │  • Status visual │        └───────────────────────────┘  │
│  ├──────────────────┤                                        │
│  │  SpaceWeather    │        ┌───────────────────────────┐  │
│  │  • NASA DONKI    │        │       DatacenterMap       │  │
│  │  • Risco solar   │        │  • Leaflet + CartoDB      │  │
│  │  • Flares + CMEs │        │  • 12 localidades BR      │  │
│  └──────────────────┘        └───────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP — proxy Vite → Flask (/api/*)
┌────────────────────────▼────────────────────────────────────┐
│                        BACKEND                               │
│                     Python · Flask                           │
│                                                              │
│  GET  /api/metrics       → Métricas dos 12 servidores       │
│  POST /api/chat          → Chat com Groq API (LLaMA 3.3)    │
│  GET  /api/space-weather → NASA DONKI (FLR + CME)           │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
           ▼                                  ▼
  ┌─────────────────┐              ┌─────────────────────┐
  │   Groq API      │              │   NASA DONKI API    │
  │ LLaMA 3.3 70B   │              │ api.nasa.gov/DONKI  │
  │ (IA Generativa) │              │ Solar Flares + CME  │
  └─────────────────┘              └─────────────────────┘
```

---

## Estrutura do Repositório

```
OrbitX-IA/
├── backend/
│   ├── app.py                  # API Flask — métricas, chat e clima espacial
│   ├── requirements.txt        # Dependências Python
│   └── .env.example            # Modelo de variáveis de ambiente
├── frontend/
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── App.tsx                       # Layout raiz + tema dark/light
│   │   ├── components/
│   │   │   ├── MetricsDashboard.tsx      # KPIs + lista de servidores
│   │   │   ├── Chat.tsx                  # Chat com Orbit AI
│   │   │   ├── SpaceWeather.tsx          # Card + modal NASA DONKI
│   │   │   ├── DatacenterMap.tsx         # Mapa Leaflet interativo
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── QuickSuggestions.tsx
│   │   ├── services/api.ts
│   │   ├── data/mockMetrics.ts
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docs/
├── .gitignore
└── README.md
```

---

## Como Reproduzir do Zero

### Pré-requisitos

- Python 3.10 ou superior
- Node.js 18 ou superior
- Chave de API da **Groq** — gratuita em [console.groq.com](https://console.groq.com)
- Chave de API da **NASA** — gratuita em [api.nasa.gov](https://api.nasa.gov)

### 1. Clonar o repositório

```bash
git clone https://github.com/Wugabriel/OrbitX-IA.git
cd OrbitX-IA
```

### 2. Configurar o Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv .venv

# Ativar (Windows)
.venv\Scripts\activate
# Ativar (Linux/macOS)
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

Crie o arquivo `backend/.env`:

```env
GROQ_API_KEY=sua_chave_groq_aqui
NASA_API_KEY=sua_chave_nasa_aqui
```

```bash
# Iniciar o backend
python app.py
```

Backend disponível em: `http://localhost:5000`

### 3. Configurar o Frontend

```bash
# Em outro terminal, na raiz do projeto:
cd frontend

npm install
npm run dev
```

Frontend disponível em: `http://localhost:3000`

> O Vite faz proxy automático de `/api/*` → `http://localhost:5000`. Nenhuma configuração adicional necessária.

---

## Rotas da API

**URL base:** `http://localhost:5000`

### GET `/api/metrics` — Métricas dos Datacenters

**Response:**
```json
{
  "temperature": 48.3,
  "energyUsage": 1284.5,
  "carbonEmission": 89.7,
  "pue": 1.52,
  "alerts": 3,
  "servers": [
    { "id": "Scala Tamboré",  "temp": 68.2, "status": "critico" },
    { "id": "Equinix SP4",    "temp": 44.1, "status": "normal"  },
    { "id": "ODATA SP02",     "temp": 71.0, "status": "critico" }
  ]
}
```

---

### POST `/api/chat` — Chat com Orbit AI

**Request:**
```json
{
  "message": "Quais servidores estão em estado crítico?",
  "history": []
}
```

**Response:**
```json
{
  "response": "Com base nos dados atuais, os servidores Scala Tamboré (68°C) e ODATA SP02 (71°C) estão em estado crítico. Recomendo verificar o sistema de refrigeração e reduzir a carga de processamento imediatamente."
}
```

---

### GET `/api/space-weather` — Clima Espacial NASA DONKI

**Response:**
```json
{
  "risk": "alto",
  "flares": [
    {
      "class": "M2.5",
      "begin": "2026-06-01T14:00Z",
      "peak": "2026-06-01T14:30Z",
      "region": 3712
    }
  ],
  "cmes": [
    {
      "time": "2026-06-02T08:00Z",
      "note": "CME detectado com velocidade estimada de 800 km/s."
    }
  ],
  "period": "2026-05-30 → 2026-06-06",
  "totalFlares": 3,
  "totalCmes": 1
}
```

**Níveis de risco:**

| Risco | Condição |
|---|---|
| `critico` | Erupção solar classe X detectada |
| `alto` | Erupção solar classe M detectada |
| `moderado` | Erupção classe C ou 3+ CMEs |
| `baixo` | Nenhum evento significativo |

---

## Datacenters Monitorados

| Datacenter | Cidade | UF |
|---|---|---|
| Scala Tamboré | Barueri | SP |
| Equinix SP4 | São Paulo | SP |
| ODATA SP02 | São Paulo | SP |
| CTMM Itaú | São Paulo | SP |
| Equinix RJ1 | Rio de Janeiro | RJ |
| Ascenty SP1 | Campinas | SP |
| BR Digital DF1 | Brasília | DF |
| Copel DC Curitiba | Curitiba | PR |
| ODATA POA | Porto Alegre | RS |
| Tivit BH | Belo Horizonte | MG |
| Embratel RJ | Rio de Janeiro | RJ |
| NTT Campinas | Campinas | SP |
