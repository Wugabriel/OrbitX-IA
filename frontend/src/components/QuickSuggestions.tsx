interface Props {
  onSelect: (text: string) => void;
}

const suggestions = [
  "🌡️ Analisar temperatura",
  "⚡ Como reduzir consumo?",
  "📊 Status dos servidores",
  "🌱 Relatório ESG",
];

export default function QuickSuggestions({ onSelect }: Props) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs dark:text-gray-500 text-gray-400 mb-2">Sugestões rápidas</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="text-xs px-3 py-1.5 rounded-full border dark:border-blue-500/50 border-blue-400/60 dark:text-blue-300 text-blue-600 hover:bg-blue-500/10 dark:hover:border-blue-400 hover:border-blue-500 transition-all duration-200 cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
