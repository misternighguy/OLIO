"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STEPS = [
  {
    title: 'What is "The Refinery?"',
    body: "$OIL is a store of value token on Solana, supported by mining/drilling gamification and infrastructure. The Refinery allows anyone to participate in the upside and flywheel driver of this store of value.",
    gradient:
      "linear-gradient(160deg, #1a1a24 0%, #252530 40%, #1f1f28 100%)",
  },
  {
    title: "Drilling Mechanics",
    body: 'Users can participate in mining at the cost and risk level they determine. "Drill Cost" is the cost associated with each individual drill process (each circular tile). The "Risk" determines the risk/reward payout for mining. Higher risk = higher ROI on positive mining.',
    gradient:
      "linear-gradient(160deg, #1e1e28 0%, #2a2a35 50%, #22222c 100%)",
  },
  {
    title: "The Crude Reserve",
    body: 'Every individual mining process has a chance to win the "Crude Reserve," an enormous jackpot-styled pool of collected mining proceeds. The larger the USD1/SOL/USDC dedicated to any tile, the higher chance of winning the Crude Reserve.',
    gradient:
      "linear-gradient(160deg, #1a1a24 0%, #2a2520 30%, rgba(212,168,83,0.15) 60%, #1e1e28 100%)",
  },
  {
    title: "Connect Wallet & Drill",
    body: "Connect your Solana wallet, deposit USD1/USDC/SOL, and begin drilling. Receive your payout instantly. Drill baby, drill.",
    gradient:
      "linear-gradient(160deg, #1f1f28 0%, #282830 50%, #1a1a24 100%)",
  },
];

interface HowItWorksPanelProps {
  onClose: () => void;
  isOpen?: boolean;
}

export function HowItWorksPanel({ onClose, isOpen = true }: HowItWorksPanelProps) {
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const current = STEPS[step];
  const panelRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(
    () => setStep((s) => Math.min(total - 1, s + 1)),
    [total]
  );
  const goBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        e.stopPropagation();
        goNext();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        e.stopPropagation();
        goBack();
      }
    },
    [isOpen, onClose, goNext, goBack]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="how-it-works-title"
      aria-modal="true"
      className="flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[var(--bg-elevated)] shadow-lg outline-none"
    >
      {/* Compact header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-2">
        <h2
          id="how-it-works-title"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
        >
          How it Works
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors duration-200 hover:bg-white/10 hover:text-[var(--text-primary)]"
          aria-label="Close"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>

      {/* Content area - flex-1 to use available height */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Gradient accent strip (replaces image) */}
        <div
          className="h-14 shrink-0 rounded-b-lg border-b border-white/5"
          style={{ background: current.gradient }}
        >
          <div className="flex h-full items-center px-3">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {current.title}
            </span>
          </div>
        </div>

        {/* Body text - scrollable, no cut-off, good contrast */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          <p className="text-[13px] leading-relaxed text-[var(--text-primary)]/90">
            {current.body}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex shrink-0 items-center justify-center gap-1.5 px-4 py-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className="transition-all duration-200"
              aria-label={`Go to step ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  i === step
                    ? "h-1.5 w-4 bg-[var(--accent)]"
                    : "h-1.5 w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/10 px-4 py-2">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition-colors duration-200 hover:bg-white/10 hover:text-[var(--text-primary)] disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Back
          </button>
          {step < total - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:bg-white/20"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-[var(--accent)]/80 px-3 py-2 text-xs font-semibold text-black transition-colors duration-200 hover:bg-[var(--accent)]"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
