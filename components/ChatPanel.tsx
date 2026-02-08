"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  ts: number;
}

function randomPlayerId() {
  return `Player #${Math.floor(100 + Math.random() * 900)}`;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting"
  );
  const [playerId] = useState(() => randomPlayerId());
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { autoConnect: true });
    socketRef.current = socket;

    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () =>
      setStatus((s) => (s === "connected" ? "connecting" : s))
    );
    socket.on("connect_error", () => setStatus("error"));

    socket.on("chat:message", (msg: Omit<ChatMessage, "id">) => {
      setMessages((prev) => [
        ...prev,
        { ...msg, id: `${msg.ts}-${Math.random()}` },
      ]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || status !== "connected") return;

    const msg: Omit<ChatMessage, "id"> = {
      sender: playerId,
      text,
      ts: Date.now(),
    };
    socketRef.current?.emit("chat:send", msg);
    setInput("");
  }, [input, status, playerId]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white">
          Chat
        </span>
        <span
          className={`text-xs ${
            status === "connected"
              ? "text-emerald-400"
              : status === "error"
                ? "text-red-400"
                : "text-[var(--text-muted)]"
          }`}
        >
          {status === "connecting" && "Connecting…"}
          {status === "connected" && "● Live"}
          {status === "error" && "Disconnected"}
        </span>
      </div>
      <div
        ref={listRef}
        className="flex max-h-[200px] min-h-[120px] flex-col gap-2 overflow-y-auto rounded-lg border border-white/10 bg-zinc-800 p-3"
      >
        {messages.length === 0 && status === "connected" && (
          <p className="text-xs text-[var(--text-muted)]">
            No messages yet. Say something!
          </p>
        )}
        {messages.length === 0 && status === "connecting" && (
          <p className="text-xs text-[var(--text-muted)]">Connecting…</p>
        )}
        {messages.length === 0 && status === "error" && (
          <p className="text-xs text-red-400/80">
            Could not connect. Is the chat server running?
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="text-xs">
            <span className="font-medium text-[var(--accent)]">{m.sender}</span>
            <span className="text-[var(--text-muted)]">: </span>
            <span className="text-[var(--text-primary)]">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          disabled={status !== "connected"}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={send}
          disabled={status !== "connected" || !input.trim()}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
