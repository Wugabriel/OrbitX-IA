import type { ChatMessage } from "../services/api";

interface Props {
  message: ChatMessage;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex flex-col items-end max-w-[75%]">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-lg shadow-blue-900/30">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </div>
          <span className="text-xs dark:text-gray-500 text-gray-400 mt-1 mr-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs flex-shrink-0 mt-1">
        ⬡
      </div>
      <div className="flex flex-col max-w-[80%]">
        <div
          className={`px-4 py-3 rounded-2xl rounded-tl-sm shadow-lg ${
            message.isError
              ? "dark:bg-red-950/60 bg-red-50 border dark:border-red-500/40 border-red-300 dark:text-red-300 text-red-700"
              : "glass dark:text-blue-100 text-gray-800"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
        <span className="text-xs dark:text-gray-500 text-gray-400 mt-1 ml-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
