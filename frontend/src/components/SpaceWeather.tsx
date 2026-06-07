import { useState, useEffect } from "react";

interface SpaceWeatherData {
  risk: "baixo" | "moderado" | "alto" | "critico";
  flares: { class: string; begin: string; peak: string; region: string | number }[];
  cmes: { time: string; note: string }[];
  period: string;
  totalFlares: number;
  totalCmes: number;
}

const RISK = {
  baixo:    { label: "Baixo",    color: "text-green-400",  border: "border-green-500/30",  bg: "bg-green-500/10",  dot: "bg-green-400"  },
  moderado: { label: "Moderado", color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10", dot: "bg-yellow-400" },
  alto:     { label: "Alto",     color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10", dot: "bg-orange-400" },
  critico:  { label: "Crítico",  color: "text-red-400",    border: "border-red-500/30",    bg: "bg-red-500/10",    dot: "bg-red-400"   },
};

const RISK_DESC: Record<string, string> = {
  baixo:    "Atividade solar dentro do normal. Baixo risco para infraestrutura.",
  moderado: "Atividade solar moderada. Recomendado monitorar sistemas de comunicação.",
  alto:     "Atividade solar elevada. Possível interferência em satélites e links de dados.",
  critico:  "Flare classe X detectado! Risco crítico de interferência em infraestrutura crítica.",
};

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function flareColor(cls: string) {
  if (cls.startsWith("X")) return "text-red-400";
  if (cls.startsWith("M")) return "text-orange-400";
  return "text-yellow-400";
}

export default function SpaceWeather() {
  const [data, setData] = useState<SpaceWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/space-weather")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const risk = data?.risk ?? "baixo";
  const cfg = RISK[risk];

  return (
    <>
      {/* Card compacto */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">☀️</span>
            <div>
              <p className="text-xs font-semibold dark:text-gray-300 text-gray-600 uppercase tracking-widest">
                Clima Espacial
              </p>
              <p className="text-xs dark:text-gray-500 text-gray-400">NASA DONKI</p>
            </div>
          </div>
          {loading && <span className="text-xs dark:text-gray-500 text-gray-400 animate-pulse">Carregando…</span>}
          {error && <span className="text-xs text-red-400">Erro na API</span>}
          {data && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </div>
          )}
        </div>

        {data && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-3 text-xs dark:text-gray-400 text-gray-500">
              <span><span className="dark:text-white text-gray-900 font-mono">{data.totalFlares}</span> flares</span>
              <span><span className="dark:text-white text-gray-900 font-mono">{data.totalCmes}</span> CMEs</span>
              <span className="dark:text-gray-600 text-gray-400">(7 dias)</span>
            </div>
            <button onClick={() => setOpen(true)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Ver detalhes →
            </button>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      {open && data && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">☀️</span>
                <div>
                  <h2 className="text-base font-bold dark:text-white text-gray-900">Monitor de Clima Espacial</h2>
                  <p className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">NASA DONKI API · {data.period}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="dark:text-gray-400 dark:hover:text-white text-gray-500 hover:text-gray-900 transition-colors text-xl leading-none ml-4"
              >
                ✕
              </button>
            </div>

            {/* Nível de risco */}
            <div className={`flex items-start gap-3 p-4 rounded-xl border mb-5 ${cfg.bg} ${cfg.border}`}>
              <span className={`text-2xl font-black leading-none mt-0.5 ${cfg.color}`}>!</span>
              <div>
                <p className={`text-sm font-bold ${cfg.color}`}>Risco {cfg.label}</p>
                <p className="text-xs dark:text-gray-300 text-gray-600 mt-0.5">{RISK_DESC[risk]}</p>
              </div>
            </div>

            {/* Flares */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-widest mb-2">
                Flares Solares — {data.totalFlares} registros no período
              </h3>
              {data.flares.length === 0 ? (
                <p className="text-xs dark:text-gray-600 text-gray-400 italic">Nenhum flare registrado nos últimos 7 dias.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {data.flares.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 dark:bg-white/5 bg-gray-100 rounded-lg px-3 py-2.5">
                      <span className={`text-sm font-bold font-mono w-10 flex-shrink-0 ${flareColor(f.class)}`}>
                        {f.class || "—"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs dark:text-gray-300 text-gray-600">Início: {fmtDate(f.begin)}</p>
                        <p className="text-xs dark:text-gray-500 text-gray-400">Pico: {fmtDate(f.peak)}</p>
                      </div>
                      <span className="text-xs dark:text-gray-500 text-gray-400 flex-shrink-0">Região {f.region}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CMEs */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-widest mb-2">
                Ejeções de Massa Coronal (CME) — {data.totalCmes} registros no período
              </h3>
              {data.cmes.length === 0 ? (
                <p className="text-xs dark:text-gray-600 text-gray-400 italic">Nenhum CME registrado nos últimos 7 dias.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {data.cmes.map((c, i) => (
                    <div key={i} className="dark:bg-white/5 bg-gray-100 rounded-lg px-3 py-2.5">
                      <p className="text-xs text-blue-400 font-mono">{fmtDate(c.time)}</p>
                      {c.note && <p className="text-xs dark:text-gray-300 text-gray-600 mt-1 leading-relaxed">{c.note}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Correlação */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold dark:text-blue-300 text-blue-600 mb-1">Correlação com Infraestrutura de Datacenter</p>
              <p className="text-xs dark:text-gray-300 text-gray-600 leading-relaxed">
                Tempestades geomagnéticas e ejeções de massa coronal podem causar interferência eletromagnética em infraestruturas críticas, afetando satélites de comunicação, links de dados e equipamentos sensíveis que suportam operações de datacenters da economia espacial.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
