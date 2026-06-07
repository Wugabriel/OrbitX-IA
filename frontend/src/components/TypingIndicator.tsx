export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs flex-shrink-0 mt-1">
        ⬡
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-[220px]">
        <div className="flex items-center gap-1 mb-1">
          <span className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: "pulse-dot 1.4s ease-in-out infinite" }} />
          <span className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: "pulse-dot 1.4s ease-in-out 0.2s infinite" }} />
          <span className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: "pulse-dot 1.4s ease-in-out 0.4s infinite" }} />
        </div>
        <p className="text-xs dark:text-gray-400 text-gray-500">Orbit AI está analisando...</p>
      </div>
    </div>
  );
}
