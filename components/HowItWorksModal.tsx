"use client";

import { useEffect, useCallback, useState } from "react";

const STEPS = [
  {
    title: "Pick a tile and drill",
    body: "Each tile shows its drill cost. Click to drill—you pay the cost and reveal an outcome. Use Mine All to drill every tile at once.",
    image: "/assets/oil-background.png",
  },
  {
    title: "Outcomes",
    body: "Dry Hole: You lose the cost. Oil Field: 1.75–4× return. Refinery: 5–15× return. Motherlode: Jackpot from the Motherlode pool.",
    image: "/assets/no-oil.png",
  },
  {
    title: "Economics: 10/30/60 split",
    body: "Every drill contributes to three reserves: 10% goes to the Motherlode pool (jackpot), 30% to the OIL Reserve (buybacks), and 60% to the Payout Reserve (game payouts).",
    image: "/assets/oil-background.png",
  },
  {
    title: "Motherlode jackpot",
    body: "The Motherlode pool grows from every drill. When you hit a Motherlode, you win a payout drawn from this pool. The more everyone drills, the bigger the jackpot.",
    image: "/assets/motherlode.png",
  },
  {
    title: "Risk levels",
    body: "Strategic (low), Targeted (medium), or Random (high)—each changes payout multipliers and odds. Higher risk means bigger potential wins but fewer hits.",
    image: "/assets/oil-background.png",
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
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="how-it-works-title"
        className="relative mx-4 flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(80,70,90,0.85) 40%, rgba(40,35,55,0.9) 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - top right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-black/70 transition-all duration-300 hover:bg-black/10 hover:text-black"
          aria-label="Close"
        >
          <span className="text-2xl leading-none">×</span>
        </button>
        <HowItWorksContent onClose={onClose} />
      </div>
    </div>
  );
}

function HowItWorksContent({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const current = STEPS[step];

  const goNext = useCallback(
    () => setStep((s) => Math.min(total - 1, s + 1)),
    [total]
  );
  const goBack = useCallback(
    () => setStep((s) => Math.max(0, s - 1)),
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        goBack();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [goNext, goBack, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Image area with gradient overlay and text */}
      <div className="relative h-56 min-h-[224px] shrink-0 sm:h-64">
        <img
          src={current.image}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden
        />
        {/* Gradient: image fades to light at bottom so black text is readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 25%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.98) 100%)",
          }}
        />
        {/* Text overlaid on image - gradient lightens bottom for black text */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-6 pt-4">
          <h3 className="text-lg font-semibold text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] sm:text-xl">
            {current.title}
          </h3>
          <p className="mt-2 max-h-24 overflow-y-auto text-sm leading-relaxed text-black/90 drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)] sm:text-base">
            {current.body}
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex shrink-0 items-center justify-center gap-2 px-6 py-4">
        {STEPS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className="transition-all duration-300"
            aria-label={`Go to step ${i + 1}`}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === step
                  ? "h-2 w-8 bg-black/80"
                  : "h-2 w-2 bg-black/40 hover:bg-black/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-black/10 px-6 py-4">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="rounded-xl px-5 py-2.5 text-sm font-medium text-black/80 transition-all duration-300 hover:bg-black/10 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Back
        </button>
        {step < total - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-xl bg-black/80 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-black"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-black/80 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-black"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}
