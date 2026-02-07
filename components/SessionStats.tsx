"use client";

import { useState } from "react";
import { useGameState } from "@/lib/game-state";
import { HowItWorksModal } from "@/components/HowItWorksModal";

const formatLarge = (n: number) =>
  n >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toFixed(2);

export function SessionStats() {
  const {
    tilesFlipped,
    sessionPnl,
    currency,
    motherlodePool,
    oilReserve,
    payoutReserve,
  } = useGameState();
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Motherlode pool */}
      <div>
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Motherlode Pool
        </div>
        <div className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
          <p className="font-mono text-lg font-semibold text-[var(--accent)]">
            {formatLarge(motherlodePool)} {currency}
          </p>
        </div>
      </div>

      {/* Reserves */}
      <div>
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Reserves
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-lg bg-white/5 px-4 py-3">
            <p className="text-xs text-[var(--text-muted)]">OIL Reserve</p>
            <p className="font-mono text-sm text-[var(--text-primary)]">
              {formatLarge(oilReserve)} {currency}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-4 py-3">
            <p className="text-xs text-[var(--text-muted)]">Payout Reserve</p>
            <p className="font-mono text-sm text-[var(--text-primary)]">
              {formatLarge(payoutReserve)} {currency}
            </p>
          </div>
        </div>
      </div>

      {/* Session */}
      <div>
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
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
      </div>

      {/* How it Works button */}
      <button
        type="button"
        onClick={() => setHowItWorksOpen(true)}
        className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-all duration-300 hover:bg-white/10 hover:opacity-90 active:scale-[0.98]"
      >
        How it Works
      </button>

      <HowItWorksModal open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
    </div>
  );
}
