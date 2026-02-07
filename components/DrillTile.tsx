"use client";

import type { OutcomeType } from "@/lib/outcome-logic";

interface DrillTileProps {
  cost: number;
  currency: string;
  outcome?: OutcomeType | null;
  onDrill: () => void;
  disabled: boolean;
}

const outcomeLabels: Record<OutcomeType, string> = {
  dry: "Dry Hole",
  oil: "Oil Field",
  refinery: "Refinery",
  motherlode: "Motherlode",
};

const outcomeColors: Record<OutcomeType, string> = {
  dry: "bg-zinc-700/80 text-zinc-400",
  oil: "bg-amber-900/60 text-amber-400",
  refinery: "bg-amber-800/70 text-amber-300",
  motherlode: "bg-[var(--accent)]/30 text-[var(--accent)]",
};

export function DrillTile({
  cost,
  currency,
  outcome,
  onDrill,
  disabled,
}: DrillTileProps) {
  const flipped = outcome != null;

  return (
    <button
      type="button"
      onClick={onDrill}
      disabled={disabled}
      className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all ${
        flipped
          ? `${outcomeColors[outcome]} cursor-default border-white/10`
          : "border-white/10 bg-[var(--bg-elevated)] hover:border-[var(--accent)]/50 hover:bg-white/5 active:scale-[0.98]"
      }`}
    >
      {flipped ? (
        <span className="text-center text-xs font-medium sm:text-sm">
          {outcomeLabels[outcome]}
        </span>
      ) : (
        <span className="font-mono text-sm font-medium text-[var(--text-primary)] sm:text-base">
          {cost >= 1 ? cost.toFixed(1) : cost.toFixed(2)} {currency}
        </span>
      )}
    </button>
  );
}
