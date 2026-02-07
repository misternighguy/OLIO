"use client";

import { useEffect, useCallback, useState } from "react";

const STEPS = [
  {
    title: "Pick a tile and drill",
    body: "Each tile shows its drill cost. Click to drill—you pay the cost and reveal an outcome. Use Mine All to drill every tile at once.",
  },
  {
    title: "Outcomes",
    body: "Dry Hole (70%): You lose the cost. Oil Field (24%): 1.5× return. Refinery (6%): 4× return. Motherlode (0.16%): Jackpot—up to 50× your cost from the Motherlode pool.",
  },
  {
    title: "Economics: 10/30/60 split",
    body: "Every drill contributes to three reserves: 10% goes to the Motherlode pool (jackpot), 30% to the OIL Reserve (buybacks), and 60% to the Payout Reserve (game payouts).",
  },
  {
    title: "Motherlode jackpot",
    body: "The Motherlode pool grows from every drill. When you hit a Motherlode, you win a payout drawn from this pool. The more everyone drills, the bigger the jackpot.",
  },
  {
    title: "Volatility and chance",
    body: "Higher volatility spreads tile costs further from the average. Equivalent Chance keeps odds the same; Varied Chance adjusts odds by tile cost.",
  },
];

interface HowItWorksModalProps {
  open: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ open, onClose }: HowItWorksModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
    },
    [open, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-elevated)] shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2
            id="how-it-works-title"
            className="text-lg font-semibold text-[var(--text-primary)]"
          >
            How it Works
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--text-muted)] transition-colors duration-200 hover:bg-white/10 hover:text-[var(--text-primary)]"
            aria-label="Close"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
        <HowItWorksContent onClose={onClose} />
      </div>
    </div>
  );
}

function HowItWorksContent({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const current = STEPS[step];

  const goNext = () => setStep((s) => Math.min(total - 1, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
        <h3 className="text-base font-medium text-[var(--accent)]">
          Step {step + 1} of {total}: {current.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          {current.body}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-all duration-300 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Back
        </button>
        <span className="text-xs text-[var(--text-muted)]">
          {step + 1} / {total}
        </span>
        {step < total - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-[var(--accent-muted)]"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-[var(--accent-muted)]"
          >
            Done
          </button>
        )}
      </div>
    </>
  );
}
