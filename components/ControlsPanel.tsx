"use client";

import { useGameState } from "@/lib/game-state";
import type { Currency, ChanceMode, GridSize } from "@/lib/game-state";

const CURRENCIES: Currency[] = ["SOL", "USDC", "USD1"];
const GRID_SIZES: GridSize[] = [3, 4, 5];

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
  } = useGameState();

  const step = currency === "SOL" ? 1 : 0.01;
  const formatCost = (n: number) =>
    n >= 1 ? n.toFixed(1) : n.toFixed(2);

  return (
    <div className="flex flex-col gap-6">
      {/* Balance */}
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Balance
        </label>
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
          <span className="font-mono text-lg text-[var(--text-primary)]">
            {formatCost(balance)} {currency}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBalance(balance + 5)}
              className="rounded px-2 py-1 text-xs font-medium text-[var(--accent)] transition-colors hover:bg-white/5"
            >
              +Deposit
            </button>
            <button
              type="button"
              onClick={() => setBalance(Math.max(0, balance - 1))}
              className="rounded px-2 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-white/5"
            >
              −Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Currency
        </label>
        <div className="flex gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                currency === c
                  ? "bg-[var(--accent)] text-black"
                  : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Average Drill Cost */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Average Drill Cost ({currency})
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setAverageDrillCost(Math.max(0.01, averageDrillCost - step))
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[var(--text-primary)] transition-colors hover:bg-white/10"
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
            className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-center font-mono text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() =>
              setAverageDrillCost(Math.min(1000, averageDrillCost + step))
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[var(--text-primary)] transition-colors hover:bg-white/10"
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
          className="mt-2 w-full accent-[var(--accent)]"
        />
      </div>

      {/* Volatility */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Volatility / Risk
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volatility}
          onChange={(e) => setVolatility(parseFloat(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
        <span className="mt-1 block text-right text-xs text-[var(--text-muted)]">
          {Math.round(volatility * 100)}%
        </span>
      </div>

      {/* Chance Mode */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Chance Mode
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setChanceMode("equivalent")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm transition-all ${
              chanceMode === "equivalent"
                ? "bg-[var(--accent)] text-black"
                : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
            }`}
          >
            Equivalent
          </button>
          <button
            type="button"
            onClick={() => setChanceMode("varied")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm transition-all ${
              chanceMode === "varied"
                ? "bg-[var(--accent)] text-black"
                : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
            }`}
          >
            Varied
          </button>
        </div>
      </div>

      {/* Grid Size */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Grid Size
        </label>
        <div className="flex gap-2">
          {GRID_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setGridSize(s)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                gridSize === s
                  ? "bg-[var(--accent)] text-black"
                  : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
              }`}
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </div>

      {/* Mine All */}
      <button
        type="button"
        onClick={() => onMineAll?.()}
        className="mt-auto rounded-lg bg-[var(--accent)] px-4 py-3 text-base font-semibold text-black transition-all hover:bg-[var(--accent-muted)] active:scale-[0.98]"
      >
        Mine All Tiles
      </button>
    </div>
  );
}
