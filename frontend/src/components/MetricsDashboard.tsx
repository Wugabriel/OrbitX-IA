import { useState, useEffect, useCallback } from "react";
import type { Metrics, Server } from "../data/mockMetrics";
import { initialMetrics } from "../data/mockMetrics";
import { fetchMetrics } from "../services/api";
import SpaceWeather from "./SpaceWeather";
import DatacenterMap from "./DatacenterMap";

function statusColor(status: Server["status"]) {
  return (
    {
      normal:    "bg-green-500 text-green-900",
      "atenção": "bg-yellow-500 text-yellow-900",
      critico:   "bg-red-500 text-red-900",
    }[status] ?? "bg-gray-500 text-gray-900"
  );
}

function statusBarColor(status: Server["status"]) {
  return (
    { normal: "bg-green-500", "atenção": "bg-yellow-500", critico: "bg-red-500" }[
      status
    ] ?? "bg-gray-500"
  );
}

function tempPercent(temp: number) {
  return Math.min(100, Math.round((temp / 90) * 100));
}

interface KpiCardProps {
  icon: string;
  label: string;
  value: string;
  valueClass?: string;
}

function KpiCard({
  icon,
  label,
  value,
  valueClass = "dark:text-white text-gray-900",
}: KpiCardProps) {
  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-1">
      <span className="text-2xl">{icon}</span>
      <p className={`text-2xl font-bold leading-tight ${valueClass}`}>{value}</p>
      <p className="text-xs dark:text-gray-400 text-gray-500">{label}</p>
    </div>
  );
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refresh = useCallback(async () => {
    try {
      const data = await fetchMetrics();
      setMetrics(data);
      setLastUpdate(new Date());
    } catch {
      // keep previous data on error
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="glass rounded-2xl p-5 flex flex-col gap-4 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-600 uppercase tracking-widest">
            KPIs do Datacenter
          </h2>
          <span className="text-xs text-blue-400 font-mono">
            {metrics.alerts} alerta{metrics.alerts !== 1 ? "s" : ""}
          </span>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            icon="🌡️"
            label="Temperatura Média"
            value={`${metrics.temperature}°C`}
            valueClass={
              metrics.temperature > 60
                ? "text-red-400"
                : "dark:text-white text-gray-900"
            }
          />
          <KpiCard
            icon="⚡"
            label="Consumo Energético"
            value={`${metrics.energyUsage} kWh`}
            valueClass="text-blue-400"
          />
          <KpiCard
            icon="🌱"
            label="Emissão CO₂"
            value={`${metrics.carbonEmission} kg`}
            valueClass="text-green-400"
          />
          <KpiCard
            icon="📊"
            label="PUE"
            value={metrics.pue.toFixed(2)}
            valueClass={
              metrics.pue > 1.5
                ? "text-yellow-400"
                : "dark:text-white text-gray-900"
            }
          />
        </div>

        {/* Servers */}
        <div className="flex flex-col flex-1 min-h-0">
          <h3 className="text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-widest mb-3 flex-shrink-0">
            Data Centers
          </h3>
          <div className="flex flex-col gap-2 overflow-y-auto scrollbar-thin pr-1">
            {metrics.servers.map((srv) => (
              <div key={srv.id} className="flex items-center gap-3">
                <span className="text-xs font-mono dark:text-gray-300 text-gray-700 w-14 flex-shrink-0">
                  {srv.id}
                </span>
                <div className="flex-1 dark:bg-white/5 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusBarColor(
                      srv.status
                    )}`}
                    style={{ width: `${tempPercent(srv.temp)}%` }}
                  />
                </div>
                <span className="text-xs dark:text-gray-400 text-gray-500 w-10 text-right flex-shrink-0">
                  {srv.temp}°C
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColor(
                    srv.status
                  )}`}
                >
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SpaceWeather />
      <DatacenterMap />

      {/* Footer */}
      <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-xs dark:text-gray-500 text-gray-400">
          Última atualização:{" "}
          <span className="dark:text-gray-300 text-gray-700 font-mono">
            {lastUpdate.toLocaleTimeString("pt-BR")}
          </span>
        </span>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Atualizar
        </button>
      </div>
    </div>
  );
}
