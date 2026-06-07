import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Server } from "../data/mockMetrics";

const DATACENTERS = [
  { id: "Scala Tamboré",     lat: -23.470, lng: -46.860 },
  { id: "Equinix SP4",       lat: -23.548, lng: -46.632 },
  { id: "ODATA SP02",        lat: -23.620, lng: -46.710 },
  { id: "CTMM Itaú",        lat: -23.515, lng: -46.580 },
  { id: "Equinix RJ1",       lat: -22.897, lng: -43.210 },
  { id: "Ascenty SP1",       lat: -22.879, lng: -47.220 },
  { id: "BR Digital DF1",    lat: -15.794, lng: -47.882 },
  { id: "Copel DC Curitiba", lat: -25.428, lng: -49.273 },
  { id: "ODATA POA",         lat: -30.034, lng: -51.217 },
  { id: "Tivit BH",          lat: -19.917, lng: -43.934 },
  { id: "Embratel RJ",       lat: -22.912, lng: -43.170 },
  { id: "NTT Campinas",      lat: -22.905, lng: -47.063 },
];

const STATUS_COLOR: Record<Server["status"], string> = {
  normal:    "#22c55e",
  "atenção": "#eab308",
  critico:   "#ef4444",
};

const RISK_COLOR: Record<string, string> = {
  baixo:    "#22c55e",
  moderado: "#eab308",
  alto:     "#f97316",
  critico:  "#ef4444",
};

const RISK_OPACITY: Record<string, number> = {
  baixo:    0.08,
  moderado: 0.14,
  alto:     0.22,
  critico:  0.32,
};

const RISK_LABEL: Record<string, string> = {
  baixo:    "Baixo",
  moderado: "Moderado",
  alto:     "Alto",
  critico:  "Crítico",
};

export default function DatacenterMap() {
  const [open, setOpen] = useState(false);
  const [servers, setServers] = useState<Server[]>([]);
  const [risk, setRisk] = useState("baixo");
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingData(true);
    Promise.all([
      fetch("/api/metrics").then((r) => r.json()),
      fetch("/api/space-weather").then((r) => r.json()),
    ])
      .then(([metrics, weather]) => {
        setServers(metrics.servers ?? []);
        setRisk(weather.risk ?? "baixo");
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [open]);

  const riskColor   = RISK_COLOR[risk]   ?? "#22c55e";
  const riskOpacity = RISK_OPACITY[risk] ?? 0.08;

  return (
    <>
      {/* Card compacto */}
      <div
        className="glass rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🗺️</span>
          <div>
            <p className="text-xs font-semibold dark:text-gray-300 text-gray-600 uppercase tracking-widest">
              Mapa de Impacto
            </p>
            <p className="text-xs dark:text-gray-500 text-gray-400">Datacenters + clima espacial</p>
          </div>
        </div>
        <span className="text-xs text-blue-400">Abrir →</span>
      </div>

      {/* Modal com mapa */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="glass rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col" style={{ maxHeight: "90vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
              <div>
                <h2 className="text-sm font-bold dark:text-white text-gray-900">
                  Mapa de Impacto Geomagnético
                </h2>
                <p className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">
                  Localização dos datacenters monitorados e zonas de risco solar
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!loadingData && (
                  <div
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      color: riskColor,
                      background: riskColor + "22",
                      border: `1px solid ${riskColor}44`,
                    }}
                  >
                    Risco Geomagnético: {RISK_LABEL[risk]}
                  </div>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="dark:text-gray-400 dark:hover:text-white text-gray-500 hover:text-gray-900 transition-colors text-xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Mapa */}
            <div style={{ height: "480px", flexShrink: 0 }}>
              <MapContainer
                key={String(open)}
                center={[10, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%", background: "#060614" }}
                zoomControl
                attributionControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                {/* Zonas polares */}
                <Circle
                  center={[85, 0]}
                  radius={4_000_000}
                  pathOptions={{ fillColor: riskColor, fillOpacity: riskOpacity, color: riskColor, weight: 1, opacity: 0.5 }}
                />
                <Circle
                  center={[-85, 0]}
                  radius={4_000_000}
                  pathOptions={{ fillColor: riskColor, fillOpacity: riskOpacity, color: riskColor, weight: 1, opacity: 0.5 }}
                />

                {/* Marcadores dos datacenters */}
                {DATACENTERS.map((dc) => {
                  const srv = servers.find((s) => s.id === dc.id);
                  const color = srv ? STATUS_COLOR[srv.status] : "#6b7280";
                  return (
                    <CircleMarker
                      key={dc.id}
                      center={[dc.lat, dc.lng]}
                      radius={10}
                      pathOptions={{ fillColor: color, color: "#fff", fillOpacity: 0.9, weight: 2 }}
                    >
                      <Popup>
                        <div style={{ fontFamily: "Inter, sans-serif", minWidth: 140 }}>
                          <p style={{ fontWeight: 700, marginBottom: 6, fontSize: 13 }}>{dc.id}</p>
                          {srv ? (
                            <>
                              <p style={{ fontSize: 12, margin: "2px 0", color: "#555" }}>
                                Temperatura: <strong style={{ color: "#111" }}>{srv.temp}°C</strong>
                              </p>
                              <p style={{ fontSize: 12, margin: "2px 0", color: "#555" }}>
                                Status:{" "}
                                <strong style={{ color }}>
                                  {srv.status.charAt(0).toUpperCase() + srv.status.slice(1)}
                                </strong>
                              </p>
                            </>
                          ) : (
                            <p style={{ fontSize: 12, color: "#888" }}>Sem dados</p>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Legenda */}
            <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-2 flex-shrink-0 border-t dark:border-white/5 border-gray-200">
              <div className="flex items-center gap-4 text-xs dark:text-gray-400 text-gray-500">
                <span className="dark:text-gray-500 text-gray-400 font-medium mr-1">Servidores:</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block bg-green-500" /> Normal</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block bg-yellow-500" /> Atenção</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block bg-red-500" /> Crítico</span>
              </div>
              <p className="text-xs dark:text-gray-500 text-gray-400">
                Zonas polares = intensidade do risco geomagnético NASA DONKI
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
