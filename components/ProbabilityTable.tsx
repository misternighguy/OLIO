"use client";

import { useState, useRef, useEffect } from "react";
import { useGameState } from "@/lib/game-state";
import type { RiskLevel } from "@/lib/game-state";

interface RiskData {
  dry: string;
  oil: string;
  oilPayout: string;
  refinery: string;
  refineryPayout: string;
  ev: string;
}

const RISK_DATA: Record<RiskLevel, RiskData> = {
  strategic: {
    dry: "60.71%",
    oil: "34.29%",
    oilPayout: "1.75x",
    refinery: "5.00%",
    refineryPayout: "5x",
    ev: "-15%",
  },
  targeted: {
    dry: "72.00%",
    oil: "26.00%",
    oilPayout: "2.5x",
    refinery: "2.00%",
    refineryPayout: "10x",
    ev: "-15%",
  },
  random: {
    dry: "82.88%",
    oil: "15.62%",
    oilPayout: "4x",
    refinery: "1.50%",
    refineryPayout: "15x",
    ev: "-15%",
  },
};

export function ProbabilityTable() {
  const { riskLevel } = useGameState();
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (!bodyRef.current) return;
    if (open) {
      setHeight(bodyRef.current.scrollHeight);
      const t = setTimeout(() => setHeight(undefined), 300);
      return () => clearTimeout(t);
    } else {
      setHeight(bodyRef.current.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  const data = RISK_DATA[riskLevel];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] transition-colors duration-200 hover:border-white/20">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 active:scale-[0.99]"
      >
        <span className="text-xs font-medium uppercase tracking-wider text-white">
          Odds
        </span>
        <svg
          className={`h-3.5 w-3.5 text-[var(--text-muted)] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        ref={bodyRef}
        className="overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
      >
        <div className="px-4 pb-4 pt-1">
          <div className="rounded-lg border border-white/10 bg-zinc-700 p-3">
            <div className="mb-2 text-xs font-semibold text-[var(--accent)]">
              {riskLevel === "strategic" && "Strategic (Low Risk)"}
              {riskLevel === "targeted" && "Targeted (Medium Risk)"}
              {riskLevel === "random" && "Random (High Risk)"}
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-1.5 text-left font-medium text-[var(--text-muted)]">
                    Outcome
                  </th>
                  <th className="pb-1.5 text-right font-medium text-[var(--text-muted)]">
                    Chance
                  </th>
                  <th className="pb-1.5 text-right font-medium text-[var(--text-muted)]">
                    Payout
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 text-[var(--text-primary)]">Dry Hole</td>
                  <td className="py-1 text-right text-[var(--text-primary)]">
                    {data.dry}
                  </td>
                  <td className="py-1 text-right text-zinc-400">0x</td>
                </tr>
                <tr>
                  <td className="py-1 text-amber-400">Oil Field</td>
                  <td className="py-1 text-right text-[var(--text-primary)]">
                    {data.oil}
                  </td>
                  <td className="py-1 text-right text-amber-400">
                    {data.oilPayout}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-amber-300">Refinery</td>
                  <td className="py-1 text-right text-[var(--text-primary)]">
                    {data.refinery}
                  </td>
                  <td className="py-1 text-right text-amber-300">
                    {data.refineryPayout}
                  </td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="pt-1.5 text-[var(--accent)]">Motherlode</td>
                  <td
                    colSpan={2}
                    className="pt-1.5 text-right text-[var(--text-muted)]"
                  >
                    (bet/3) / pool
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-[10px] font-medium text-[var(--text-muted)]">
                Expected Value
              </span>
              <span className="text-xs font-semibold text-red-400">
                {data.ev}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
