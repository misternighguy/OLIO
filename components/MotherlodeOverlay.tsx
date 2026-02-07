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
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-labelledby="motherlode-heading"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <div
        className="relative mx-4 max-h-[90dvh] max-w-md animate-motherlode-in overflow-y-auto rounded-2xl border border-[var(--accent)]/40 bg-[var(--bg-elevated)]/95 px-4 py-8 shadow-[0_0_60px_rgba(212,168,83,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] md:px-10 md:py-14"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          id="motherlode-heading"
          className="text-center text-3xl font-bold uppercase tracking-wider text-[var(--accent)] md:text-4xl"
        >
          Motherlode!
        </p>
        <p className="mt-4 text-center font-mono text-2xl text-[var(--text-primary)] md:text-3xl">
          {formatAmount(amount, currency)}
        </p>
        <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
          Click anywhere or wait to continue
        </p>
      </div>
    </div>
  );
}
