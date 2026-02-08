"use client";

import { useEffect } from "react";

interface MotherlodeOverlayProps {
  amount: number;
  currency: string;
  onDismiss: () => void;
}

const formatAmount = (n: number, currency: string) =>
  n >= 1 ? `${n.toFixed(1)} ${currency}` : `${n.toFixed(2)} ${currency}`;

export function MotherlodeOverlay({
  amount,
  currency,
  onDismiss,
}: MotherlodeOverlayProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-labelledby="motherlode-heading"
      className="animate-motherlode-backdrop fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/90"
      onClick={onDismiss}
    >
      {/* Outer glow ring */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="h-[min(90dvh,420px)] w-[min(90vw,380px)] rounded-3xl bg-[var(--accent)]/10 blur-3xl" />
      </div>
      <div
        className="animate-motherlode-glow animate-motherlode-in relative mx-4 max-h-[90dvh] max-w-md overflow-y-auto rounded-[24px] border-2 border-[var(--accent)]/50 bg-gradient-to-b from-[var(--bg-elevated)] via-[#1a1a22] to-[var(--bg-elevated)] px-6 py-10 shadow-[0_0_80px_rgba(212,168,83,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] md:px-12 md:py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          id="motherlode-heading"
          className="animate-motherlode-title bg-gradient-to-r from-[var(--accent)] via-amber-300 to-[var(--accent)] bg-clip-text text-center text-4xl font-black uppercase tracking-[0.2em] text-transparent drop-shadow-[0_0_30px_rgba(212,168,83,0.5)] md:text-5xl"
        >
          Motherlode!
        </p>
        <p className="animate-motherlode-amount mt-6 text-center font-mono text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(212,168,83,0.3)] md:text-4xl">
          {formatAmount(amount, currency)}
        </p>
        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          Click anywhere or wait to continue
        </p>
      </div>
    </div>
  );
}
