"use client";

import { useEffect, useRef, useState } from "react";
import type { OutcomeType } from "@/lib/outcome-logic";
import { playOutcomeSound } from "@/lib/audio";

const DRILL_DURATIONS_MS = [250, 500, 750, 1000, 1250, 1500, 2000] as const;

function pickDrillDuration(): number {
  return DRILL_DURATIONS_MS[
    Math.floor(Math.random() * DRILL_DURATIONS_MS.length)
  ];
}

/**
 * Build shake keyframes programmatically.
 * - Shorter durations → fewer oscillations
 * - Longer durations → more oscillations
 * - Starts wide, progressively dampens to nearly still
 * - Mostly horizontal, slight vertical
 */
function buildDrillKeyframes(durationMs: number): Keyframe[] {
  const oscillations = Math.max(2, Math.round(durationMs / 120));
  const maxX = 6; // px – peak horizontal
  const maxY = 1.2; // px – peak vertical (much less)

  const frames: Keyframe[] = [{ transform: "translate(0px, 0px)", offset: 0 }];

  for (let i = 0; i < oscillations; i++) {
    const progress = i / oscillations; // 0 → ~1
    const dampen = 1 - progress * 0.8; // 1.0 → 0.2
    const dir = i % 2 === 0 ? -1 : 1;
    const x = dir * maxX * dampen;
    const y = dir * maxY * dampen * (i % 3 === 0 ? -1 : 1);
    frames.push({
      transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`,
      offset: (i + 1) / (oscillations + 1),
    });
  }

  frames.push({ transform: "translate(0px, 0px)", offset: 1 });
  return frames;
}

interface DrillTileProps {
  cost: number;
  currency: string;
  outcome?: OutcomeType | null;
  payout?: number;
  motherlodePool?: number;
  audioEnabled?: boolean;
  onDrill: () => void;
  onReveal?: () => void;
  disabled: boolean;
  affordable?: boolean;
  insufficientBalanceShake?: boolean;
}

const OUTCOME_BG_IMAGE: Record<OutcomeType, string> = {
  dry: "/assets/no-oil.png",
  oil: "/assets/oil-background.png",
  refinery: "/assets/refinery-background.png",
  motherlode: "/assets/motherlode.png",
};

const outcomeConfig: Record<
  OutcomeType,
  { label: string; textClass: string }
> = {
  dry: {
    label: "Dry Hole",
    textClass: "text-zinc-300",
  },
  oil: {
    label: "Oil Field",
    textClass: "text-amber-400",
  },
  refinery: {
    label: "Refinery",
    textClass: "text-amber-300",
  },
  motherlode: {
    label: "Motherlode",
    textClass: "text-[var(--accent)]",
  },
};

export function DrillTile({
  cost,
  currency,
  outcome,
  payout,
  motherlodePool = 0,
  audioEnabled = true,
  onDrill,
  onReveal,
  disabled,
  affordable = true,
  insufficientBalanceShake = false,
}: DrillTileProps) {
  const flipped = outcome != null;
  const [revealed, setRevealed] = useState(false);
  const outcomeKeyRef = useRef<OutcomeType | null>(null);
  const drillDurationRef = useRef(250);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  useEffect(() => {
    if (outcome == null) {
      outcomeKeyRef.current = null;
      revealedRef.current = false;
      setRevealed(false);
      return;
    }

    if (outcomeKeyRef.current !== outcome) {
      outcomeKeyRef.current = outcome;
      revealedRef.current = false;
      setRevealed(false);
      drillDurationRef.current = pickDrillDuration();
    }

    const ms = drillDurationRef.current;

    // Programmatic shake via Web Animations API
    let anim: Animation | undefined;
    if (wrapperRef.current) {
      anim = wrapperRef.current.animate(buildDrillKeyframes(ms), {
        duration: ms,
        easing: "ease-out",
      });
    }

    const t = setTimeout(() => {
      // Play sound at end of animation, when outcome is revealed
      playOutcomeSound(outcome, audioEnabled, 0);
      setRevealed(true);
      if (!revealedRef.current) {
        revealedRef.current = true;
        onRevealRef.current?.();
      }
    }, ms);
    return () => {
      clearTimeout(t);
      anim?.cancel();
    };
  }, [outcome, audioEnabled]);

  const isDrilling = flipped && !revealed;
  const config = flipped ? outcomeConfig[outcome!] : null;
  const unaffordable = !affordable && !flipped;

  const payoutDisplay =
    flipped && outcome != null && outcome !== "dry" && payout != null
      ? (() => {
          const fmt = (n: number) =>
            n >= 1000 ? n.toLocaleString("en-US", { maximumFractionDigits: 0 })
            : n >= 100 ? n.toFixed(0)
            : n.toFixed(2);
          return { text: `+${fmt(payout)}`, amount: payout };
        })()
      : null;

  return (
    <div
      ref={wrapperRef}
      className={`aspect-square ${insufficientBalanceShake ? "animate-shake" : ""}`}
      style={{ gridColumn: "span 1", perspective: "800px" }}
    >
      <button
        type="button"
        onClick={onDrill}
        disabled={disabled}
        className={`relative h-full w-full rounded-full border-0 bg-cover bg-center bg-no-repeat transition-all duration-300 ease-out ${
          flipped && revealed
            ? "overflow-hidden animate-tile-flip-in"
            : unaffordable
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:brightness-110 hover:shadow-md active:scale-[0.98]"
        }`}
        style={
          !flipped || isDrilling
            ? { backgroundImage: "url(/tilebg.png)" }
            : undefined
        }
      >
        {/* Cost face — visible during idle & drilling */}
        {(!flipped || isDrilling) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-sm font-semibold leading-tight text-black sm:text-base">
              {cost >= 1 ? cost.toFixed(1) : cost.toFixed(2)}
            </span>
            <span className="font-mono text-[10px] uppercase leading-tight text-black sm:text-xs">
              {currency}
            </span>
          </div>
        )}

        {/* Outcome face — appears after drilling, whole button flips */}
        {flipped && revealed && config && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${OUTCOME_BG_IMAGE[outcome!]})` }}
          >
            <div className="pointer-events-none absolute inset-0 bg-black/30" aria-hidden />
            <div className={`relative z-10 flex flex-col items-center justify-center ${config.textClass}`}>
              <span className="text-center text-[10px] font-bold leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-xs">
                {config.label}
              </span>
              {payoutDisplay && (
                <span className="mt-0.5 font-mono text-xs font-bold leading-tight text-emerald-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] sm:text-sm">
                  {payoutDisplay.text.split(" ")[0]}
                </span>
              )}
              {payoutDisplay && (
                <span className="font-mono text-[9px] font-bold uppercase leading-tight text-emerald-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] sm:text-[10px]">
                  {currency}
                </span>
              )}
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
