"use client";

import { useGameState } from "@/lib/game-state";

export function SessionStats() {
  const { tilesFlipped, sessionPnl, currency } = useGameState();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Session
      </div>
      <div className="rounded-lg bg-white/5 p-4">
        <p className="text-sm text-[var(--text-muted)]">
          Tiles flipped:{" "}
          <span className="text-[var(--text-primary)]">{tilesFlipped}</span>
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          P/L:{" "}
          <span
            className={
              sessionPnl >= 0 ? "text-emerald-400" : "text-red-400"
            }
          >
            {sessionPnl >= 0 ? "+" : ""}
            {sessionPnl.toFixed(2)} {currency}
          </span>
        </p>
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        Motherlode & Chat — Phase 4
      </p>
    </div>
  );
}
