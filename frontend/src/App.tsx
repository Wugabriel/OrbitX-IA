import { useState, useEffect } from "react";
import MetricsDashboard from "./components/MetricsDashboard";
import Chat from "./components/Chat";

function useTheme() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("orbitx-theme") !== "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("orbitx-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}

export default function App() {
  const { isDark, toggle } = useTheme();

  return (
    <div
      className="min-h-screen w-full dark:text-white text-gray-900"
      style={{
        background: isDark
          ? "radial-gradient(ellipse at 50% 0%, #0a0a2e 0%, #050816 60%)"
          : "radial-gradient(ellipse at 50% 0%, #dbeafe 0%, #eff6ff 60%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b dark:border-white/5 border-blue-200/60">
        <div className="flex items-center gap-1.5">
          OrbitX <span className="text-blue-400">AI</span>
          <span className="text-lg font-bold tracking-tight dark:text-white text-gray-900">
            
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
            className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none"
            style={{ background: isDark ? "#1d4ed8" : "#d1d5db" }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
              style={{ left: isDark ? "calc(100% - 1.375rem)" : "0.125rem" }}
            />
          </button>
          <div className="flex items-center gap-2 glass rounded-full px-3 py-1">
            <span
              className="w-2 h-2 rounded-full bg-green-400"
              style={{ animation: "live-pulse 1.5s ease-in-out infinite" }}
            />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">
              Ao Vivo
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className="flex flex-col lg:flex-row gap-4 p-4 lg:p-6"
        style={{ height: "calc(100vh - 65px)" }}
      >
        <div className="w-full lg:w-[40%] flex flex-col">
          <MetricsDashboard />
        </div>
        <div className="w-full lg:w-[60%] flex flex-col min-h-[500px] lg:min-h-0">
          <Chat />
        </div>
      </main>
    </div>
  );
}
