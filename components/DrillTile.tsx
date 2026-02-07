"use client";

import type { OutcomeType } from "@/lib/outcome-logic";

interface DrillTileProps {
  cost: number;
  currency: string;
  outcome?: OutcomeType | null;
  onDrill: () => void;
  disabled: boolean;
  affordable?: boolean;
  insufficientBalanceShake?: boolean;
}

const outcomeConfig: Record<
  OutcomeType,
  { label: string; icon: string; className: string }
> = {
  dry: {
    label: "Dry Hole",
    icon: "✗",
    className:
      "bg-zinc-800/90 text-zinc-400 border-zinc-600/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.3),0_0_8px_rgba(100,100,100,0.1)]",
  },
  oil: {
    label: "Oil Field",
    icon: "◆",
    className:
      "bg-amber-950/80 text-amber-400 border-amber-700/40 shadow-[0_0_20px_rgba(251,191,36,0.2),inset_0_0_10px_rgba(251,191,36,0.05)]",
  },
  refinery: {
    label: "Refinery",
    icon: "◇",
    className:
      "bg-amber-900/70 text-amber-300 border-amber-600/50 shadow-[0_0_28px_rgba(251,191,36,0.35),0_0_12px_rgba(180,83,9,0.2)]",
  },
  motherlode: {
    label: "Motherlode",
    icon: "★",
    className:
      "bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/50 shadow-[0_0_32px_rgba(212,168,83,0.5),0_0_16px_rgba(212,168,83,0.25),inset_0_0_20px_rgba(212,168,83,0.1)]",
  },
};

export function DrillTile({
  cost,
  currency,
  outcome,
  onDrill,
  disabled,
  affordable = true,
  insufficientBalanceShake = false,
}: DrillTileProps) {
  const flipped = outcome != null;
  const config = flipped ? outcomeConfig[outcome] : null;
  const unaffordable = !affordable && !flipped;

  return (
    <div
      className={`aspect-square [perspective:400px] ${insufficientBalanceShake ? "animate-shake" : ""}`}
      style={{ gridColumn: "span 1" }}
    >
      <button
        type="button"
        onClick={onDrill}
        disabled={disabled}
        className={`relative h-full w-full overflow-hidden rounded-xl border transition-transform duration-300 ease-out [transform-style:preserve-3d] ${
          flipped
            ? config!.className
            : unaffordable
              ? "cursor-not-allowed border-white/5 bg-white/[0.03] opacity-60"
              : "cursor-pointer border-white/10 bg-[var(--bg-elevated)] hover:border-[var(--accent)]/50 hover:bg-white/5 hover:shadow-md active:scale-[0.98]"
        }`}
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front: cost */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden] ${
            flipped ? "invisible" : ""
          }`}
        >
          <span className="font-mono text-sm font-medium text-[var(--text-primary)] sm:text-base">
            {cost >= 1 ? cost.toFixed(1) : cost.toFixed(2)} {currency}
          </span>
        </div>

        {/* Back: outcome (pre-rotated 180 so it shows when parent rotates) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-1 [backface-visibility:hidden] ${
            flipped ? "" : "invisible"
          }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          {config && (
            <>
              <span className="text-lg sm:text-xl">{config.icon}</span>
              <span className="text-center text-xs font-medium sm:text-sm">
                {config.label}
              </span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
