import type { Metrics } from "../data/mockMetrics";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export async function fetchMetrics(): Promise<Metrics> {
  const res = await fetch("/api/metrics");
  if (!res.ok) throw new Error("Falha ao buscar métricas");
  return res.json();
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error || "Erro desconhecido");
  }

  return data.response;
}
