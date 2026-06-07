import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "../services/api";
import { sendChatMessage } from "../services/api";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import QuickSuggestions from "./QuickSuggestions";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Olá! Sou a Orbit AI 🚀 Monitorando seu datacenter em tempo real. Como posso ajudar?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      sender: "user",
      text: msg,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(msg, messages);
      setMessages((prev) => [
        ...prev,
        { id: generateId(), sender: "ai", text: response, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          sender: "ai",
          text: "❌ Erro ao conectar com a Orbit AI. Tente novamente.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  const userMessageCount = messages.filter((m) => m.sender === "user").length;

  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b dark:border-white/5 border-gray-200">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
          ⬡
        </div>
        <div className="flex-1">
          <p className="font-bold dark:text-white text-gray-900 text-sm">Orbit AI</p>
          <p className="text-xs dark:text-gray-400 text-gray-500">Assistente de Datacenter</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-green-400"
            style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
          />
          <span className="text-xs text-green-400 font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {userMessageCount === 0 && (
        <QuickSuggestions onSelect={(s) => handleSend(s)} />
      )}

      {/* Input bar */}
      <div className="px-4 py-3 border-t dark:border-white/5 border-gray-200">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pergunte sobre o datacenter..."
            disabled={isLoading}
            className="flex-1 dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm dark:text-gray-100 text-gray-900 dark:placeholder-gray-500 placeholder-gray-400 outline-none transition-colors duration-200 disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-blue-900/40"
          >
            <svg
              className="w-4 h-4 translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
