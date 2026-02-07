"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useGameState } from "@/lib/game-state";
import type { Currency, ChanceMode, GridSize } from "@/lib/game-state";

const CURRENCIES: Currency[] = ["SOL", "USDC", "USD1"];
const GRID_SIZES: GridSize[] = [3, 4, 5];

/* ── Collapsible section ── */
function Section({
  label,
  value,
  defaultOpen = false,
  children,
}: {
  label: string;
  value: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );

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

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] transition-colors duration-200 hover:border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 active:scale-[0.99]"
      >
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {value}
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
        </span>
      </button>
      <div
        ref={bodyRef}
        className="overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
      >
        <div className="px-4 pb-4 pt-1">{children}</div>
      </div>
    </div>
  );
}

export function ControlsPanel() {
  const {
    currency,
    setCurrency,
    averageDrillCost,
    setAverageDrillCost,
    volatility,
    setVolatility,
    chanceMode,
    setChanceMode,
    gridSize,
    setGridSize,
    balance,
    setBalance,
    onMineAll,
    onResetAll,
  } = useGameState();

  const step = currency === "SOL" ? 1 : 0.01;
  const formatCost = (n: number) => (n >= 1 ? n.toFixed(1) : n.toFixed(2));

  return (
    <div className="flex flex-col gap-3">
      {/* Balance — always visible */}
      <div className="min-w-0">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Balance
        </label>
        <div className="flex min-w-0 flex-col gap-2 rounded-lg bg-white/5 px-4 py-3">
          <span className="shrink-0 whitespace-nowrap font-mono text-lg text-[var(--text-primary)]">
            {formatCost(balance)} {currency}
          </span>
          <div className="flex min-w-0 gap-2">
            <button
              type="button"
              onClick={() => setBalance(balance + 5)}
              className="min-w-0 flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--accent)] transition-all duration-300 hover:bg-white/10 hover:opacity-90 active:scale-95"
            >
              +Deposit
            </button>
            <button
              type="button"
              onClick={() => setBalance(Math.max(0, balance - 1))}
              className="min-w-0 flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-all duration-300 hover:bg-white/10 hover:opacity-90 active:scale-95"
            >
              −Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Currency */}
      <Section label="Currency" value={currency} defaultOpen>
        <div className="flex gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:opacity-90 active:scale-[0.98] ${
                currency === c
                  ? "bg-[var(--accent)] text-black"
                  : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      {/* Average Drill Cost */}
      <Section
        label="Drill Cost"
        value={`${formatCost(averageDrillCost)} ${currency}`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setAverageDrillCost(Math.max(0.01, averageDrillCost - step))
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[var(--text-primary)] transition-all duration-300 hover:bg-white/10 hover:opacity-90 active:scale-95"
          >
            −
          </button>
          <input
            type="number"
            min={0.01}
            max={1000}
            step={step}
            value={averageDrillCost}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!Number.isNaN(v)) setAverageDrillCost(v);
            }}
            className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-center font-mono text-[var(--text-primary)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none hover:border-white/20"
          />
          <button
            type="button"
            onClick={() =>
              setAverageDrillCost(Math.min(1000, averageDrillCost + step))
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[var(--text-primary)] transition-all duration-300 hover:bg-white/10 hover:opacity-90 active:scale-95"
          >
            +
          </button>
        </div>
        <input
          type="range"
          min={0.01}
          max={10}
          step={0.01}
          value={Math.min(10, averageDrillCost)}
          onChange={(e) =>
            setAverageDrillCost(parseFloat(e.target.value) || 0.01)
          }
          className="mt-2 w-full accent-[var(--accent)] transition-opacity duration-200 hover:opacity-90"
        />
      </Section>

      {/* Volatility */}
      <Section
        label="Volatility / Risk"
        value={`${Math.round(volatility * 100)}%`}
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volatility}
          onChange={(e) => setVolatility(parseFloat(e.target.value))}
          className="w-full accent-[var(--accent)] transition-opacity duration-200 hover:opacity-90"
        />
        <span className="mt-1 block text-right text-xs text-[var(--text-muted)]">
          {Math.round(volatility * 100)}%
        </span>
      </Section>

      {/* Chance Mode */}
      <Section
        label="Chance Mode"
        value={chanceMode === "equivalent" ? "Equivalent" : "Varied"}
      >
        <div className="flex gap-2">
          {(["equivalent", "varied"] as ChanceMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setChanceMode(mode)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98] ${
                chanceMode === mode
                  ? "bg-[var(--accent)] text-black"
                  : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </Section>

      {/* Grid Size */}
      <Section label="Grid Size" value={`${gridSize}×${gridSize}`}>
        <div className="flex gap-2">
          {GRID_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setGridSize(s)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:opacity-90 active:scale-[0.98] ${
                gridSize === s
                  ? "bg-[var(--accent)] text-black"
                  : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
              }`}
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </Section>

      {/* Mine All */}
      <button
        type="button"
        onClick={() => onMineAll?.()}
        className="mt-2 rounded-lg bg-[var(--accent)] px-4 py-3 text-base font-semibold text-black transition-all duration-300 hover:bg-[var(--accent-muted)] hover:opacity-90 active:scale-[0.98]"
      >
        Mine All Tiles
      </button>
      {/* Reset All */}
      <button
        type="button"
        onClick={() => onResetAll?.()}
        className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-base font-medium text-[var(--text-primary)] transition-all duration-300 hover:bg-white/10 hover:opacity-90 active:scale-[0.98]"
      >
        Reset All
      </button>
    </div>
  );
}
