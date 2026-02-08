"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useGameState } from "@/lib/game-state";
import type { Currency, GridSize, RiskLevel } from "@/lib/game-state";
import { useSolPrice } from "@/lib/use-sol-price";

const CURRENCIES: Currency[] = ["SOL", "USDC", "USD1"];
const GRID_SIZES: GridSize[] = [3, 4, 5];
const RISK_LEVELS: { value: RiskLevel; label: string }[] = [
  { value: "strategic", label: "Strategic (low)" },
  { value: "targeted", label: "Targeted (med)" },
  { value: "random", label: "Random (high)" },
];

const HOVER_DELAY_MS = 220;
const EXPAND_DURATION_MS = 350;

function useSupportsHover() {
  const [supportsHover, setSupportsHover] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setSupportsHover(mq.matches);
    const handler = () => setSupportsHover(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return supportsHover;
}

/* ── Collapsible section (hover on desktop, click on mobile) ── */
function Section({
  label,
  value,
  defaultOpen = false,
  children,
  bgImage,
}: {
  label: string;
  value: string;
  defaultOpen?: boolean;
  children: ReactNode;
  bgImage: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supportsHover = useSupportsHover();

  useEffect(() => {
    if (!bodyRef.current) return;
    if (open) {
      setHeight(bodyRef.current.scrollHeight);
      const t = setTimeout(() => setHeight(undefined), EXPAND_DURATION_MS);
      return () => clearTimeout(t);
    } else {
      setHeight(bodyRef.current.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  const handleMouseEnter = () => {
    if (!supportsHover) return;
    hoverTimerRef.current = setTimeout(() => setOpen(true), HOVER_DELAY_MS);
  };

  const handleMouseLeave = () => {
    if (!supportsHover) return;
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setOpen(false);
  };

  const handleClick = () => {
    if (supportsHover) return;
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  return (
    <div
      className="group rounded-xl border border-white/10 bg-cover bg-center bg-no-repeat transition-colors duration-200 hover:border-white/20"
      style={{ backgroundImage: `url(${bgImage})` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-all duration-200"
        aria-expanded={open}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (!supportsHover && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        role="button"
        tabIndex={supportsHover ? undefined : 0}
      >
        <span className="text-xs font-medium uppercase tracking-wider text-white">
          {label}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent)]">
            {value}
          </span>
          <svg
            className={`h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:text-[var(--accent)] ${
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
      </div>
      <div
        ref={bodyRef}
        className="overflow-hidden ease-out"
        style={{
          height: height !== undefined ? `${height}px` : "auto",
          transition: `height ${EXPAND_DURATION_MS}ms`,
        }}
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
    riskLevel,
    setRiskLevel,
    gridSize,
    setGridSize,
    balance,
    setBalance,
    onMineAll,
    onResetAll,
    triggerMotherlode,
  } = useGameState();

  const { price: solPrice } = useSolPrice();

  const step = currency === "SOL" ? 1 : 0.01;
  const formatCost = (n: number) => (n >= 1 ? n.toFixed(1) : n.toFixed(2));
  const formatUsd = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const usdValue =
    currency === "SOL" && solPrice != null ? balance * solPrice : null;

  return (
    <div className="flex flex-col gap-3">
      {/* Mine All — first on mobile (<1024px) */}
      <button
        type="button"
        onClick={() => onMineAll?.()}
        className="order-1 mt-0 rounded-lg bg-white px-4 py-3 text-base font-semibold text-black transition-all duration-300 hover:bg-gray-200 active:scale-[0.98] lg:order-6 lg:mt-2"
      >
        Mine All Tiles
      </button>
      {/* Reset All — second on mobile */}
      <button
        type="button"
        onClick={() => onResetAll?.()}
        className="order-2 rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--text-primary)] transition-all duration-300 hover:bg-zinc-700 hover:opacity-90 active:scale-[0.98] lg:order-7"
      >
        Reset All
      </button>
      {/* Motherlode Test — dev button to preview overlay */}
      <button
        type="button"
        onClick={() => triggerMotherlode(12.5)}
        className="order-2 rounded-lg border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--accent)] transition-all duration-300 hover:bg-[var(--accent)]/20 hover:opacity-90 active:scale-[0.98] lg:order-8"
      >
        Motherlode Test
      </button>
      {/* Balance — shown in left panel on desktop only; on mobile, shown above grid via MobileBalanceStrip */}
      <div className="order-3 hidden min-w-0 lg:order-1 lg:block">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-white">
          Balance
        </label>
        <div
          className="flex min-w-0 flex-col gap-2 rounded-lg bg-cover bg-center bg-no-repeat px-4 py-3"
          style={{ backgroundImage: "url(/buttonbg1.png)" }}
        >
          <span className="shrink-0 whitespace-nowrap font-mono text-lg text-[var(--text-primary)]">
            {formatCost(balance)} {currency}
            {usdValue != null && (
              <span className="ml-2 text-sm text-[var(--text-muted)]">
                (${formatUsd(usdValue)})
              </span>
            )}
          </span>
          <div className="flex min-w-0 gap-2">
            <button
              type="button"
              onClick={() => setBalance(balance + 5)}
              className="min-w-0 flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--accent)] transition-all duration-300 hover:bg-white hover:text-black hover:opacity-90 active:scale-95"
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setBalance(Math.max(0, balance - 1))}
              className="min-w-0 flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-all duration-300 hover:bg-white hover:text-black hover:opacity-90 active:scale-95"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="order-4 lg:order-2">
        <Section label="Currency" value={currency} bgImage="/buttonbg2.png">
        <div className="flex gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:opacity-90 active:scale-[0.98] ${
                currency === c
                  ? "bg-[var(--accent)] text-black"
                  : "bg-zinc-700 text-[var(--text-muted)] hover:bg-zinc-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>
      </div>

      {/* Average Drill Cost */}
      <div className="order-5 lg:order-3">
        <Section
        label="Drill Cost"
        value={`${formatCost(averageDrillCost)} ${currency}`}
        bgImage="/buttonbg3.png"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setAverageDrillCost(Math.max(0.01, averageDrillCost - step))
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[var(--text-primary)] transition-all duration-300 hover:bg-zinc-600 hover:opacity-90 active:scale-95"
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
            className="h-9 flex-1 rounded-lg border border-white/10 bg-zinc-700 px-3 text-center font-mono text-[var(--text-primary)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none hover:border-white/20"
          />
          <button
            type="button"
            onClick={() =>
              setAverageDrillCost(Math.min(1000, averageDrillCost + step))
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[var(--text-primary)] transition-all duration-300 hover:bg-zinc-600 hover:opacity-90 active:scale-95"
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
      </div>

      {/* Risk Level */}
      <div className="order-6 lg:order-4">
        <Section
        label="Risk"
        value={RISK_LEVELS.find((r) => r.value === riskLevel)?.label || "Targeted (med)"}
        bgImage="/buttonbg4.png"
      >
        <div className="flex flex-col gap-2">
          {RISK_LEVELS.map((risk) => (
            <button
              key={risk.value}
              type="button"
              onClick={() => setRiskLevel(risk.value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:opacity-90 active:scale-[0.98] ${
                riskLevel === risk.value
                  ? "bg-[var(--accent)] text-black"
                  : "bg-zinc-700 text-[var(--text-muted)] hover:bg-zinc-600"
              }`}
            >
              {risk.label}
            </button>
          ))}
        </div>
      </Section>
      </div>

      {/* Grid Size */}
      <div className="order-7 lg:order-5">
        <Section label="Grid Size" value={`${gridSize}×${gridSize}`} bgImage="/buttonbg5.png">
        <div className="flex gap-2">
          {GRID_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setGridSize(s)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:opacity-90 active:scale-[0.98] ${
                gridSize === s
                  ? "bg-[var(--accent)] text-black"
                  : "bg-zinc-700 text-[var(--text-muted)] hover:bg-zinc-600"
              }`}
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </Section>
      </div>
    </div>
  );
}
