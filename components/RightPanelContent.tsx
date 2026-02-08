"use client";

import { useState, useEffect, useCallback } from "react";
import { useGameState } from "@/lib/game-state";
import { useSolPrice } from "@/lib/use-sol-price";
import { useOilTopHolder } from "@/lib/use-oil-top-holder";
import { useAnimatedNumber } from "@/lib/use-animated-number";
import { HowItWorksPanel } from "@/components/HowItWorksPanel";
import { ChatPanel } from "@/components/ChatPanel";

const formatLarge = (n: number) =>
  n >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toFixed(2);

export function RightPanelContent() {
  const { currency, motherlodePool } = useGameState();
  const { price: solPrice } = useSolPrice(20_000);
  const { solValue: oilReserveSol, usdValue: oilReserveUsd, loading: oilReserveLoading, error: oilReserveError } = useOilTopHolder(120_000);

  const usdValue =
    currency === "SOL" && solPrice != null
      ? motherlodePool * solPrice
      : currency === "USDC" || currency === "USD1"
        ? motherlodePool
        : null;
  const animatedUsd = useAnimatedNumber(usdValue, 1500);
  const animatedOilReserveUsd = useAnimatedNumber(oilReserveUsd, 1500);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const formatUsd = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const openHowItWorks = useCallback(() => setHowItWorksOpen(true), []);
  const closeHowItWorks = useCallback(() => setHowItWorksOpen(false), []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && howItWorksOpen) {
        e.preventDefault();
        closeHowItWorks();
      }
    },
    [howItWorksOpen, closeHowItWorks]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col gap-6 overflow-hidden">
      {/* Stats section - slides down and fades when opening */}
      <div
        className={`flex shrink-0 flex-col gap-4 transition-all duration-500 ease-in-out ${
          howItWorksOpen
            ? "pointer-events-none translate-y-6 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        {/* Motherlode pool */}
        <div className="min-w-0">
          <div className="relative flex w-full min-w-0 flex-col justify-center rounded-lg border border-[var(--accent)]/30 bg-black px-3 py-2 sm:px-4 sm:py-3">
            <p className="truncate text-[8px] font-medium uppercase tracking-wider text-white/90 sm:text-[10px]">
              Crude Reserve Jackpot
            </p>
            {usdValue != null && animatedUsd != null && (
              <p className="mt-0.5 truncate font-mono text-base font-semibold text-white sm:mt-1 sm:text-lg">
                ${formatUsd(animatedUsd)}
              </p>
            )}
            <p className="mt-0.5 truncate font-mono text-sm font-medium text-white/80 sm:text-base">
              {formatLarge(motherlodePool)} {currency}
            </p>
          </div>
        </div>

        {/* Reserves */}
        <div>
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-white">
            Reserves
          </div>
          <div className="flex flex-col gap-2">
            <div className="relative flex w-full min-w-0 flex-col justify-center rounded-lg border border-[var(--accent)]/30 bg-black px-3 py-2 sm:px-4 sm:py-3">
              <p className="truncate text-[7px] font-medium uppercase tracking-wider text-white/90 sm:text-[9px]">
                Locked $OIL Reserve
              </p>
              {oilReserveLoading ? (
                <p className="mt-0.5 font-mono text-xs text-[var(--text-muted)] sm:text-sm">Loading…</p>
              ) : oilReserveError ? (
                <p className="mt-0.5 font-mono text-[10px] text-red-400 sm:text-xs">{oilReserveError}</p>
              ) : oilReserveSol != null ? (
                <>
                  {animatedOilReserveUsd != null && (
                    <p className="mt-0.5 truncate font-mono text-sm font-semibold text-white sm:mt-1 sm:text-base">
                      ${formatUsd(animatedOilReserveUsd)}
                    </p>
                  )}
                  <p className="mt-0.5 truncate font-mono text-xs font-medium text-white/80 sm:text-sm">
                    {formatLarge(oilReserveSol)} SOL
                  </p>
                </>
              ) : (
                <p className="mt-0.5 font-mono text-xs text-[var(--text-muted)]">—</p>
              )}
            </div>
          </div>
        </div>

        {/* How it Works button - moves to top when opening */}
        <button
          type="button"
          onClick={openHowItWorks}
          className={`rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-all duration-500 ease-in-out hover:bg-zinc-700 hover:opacity-90 active:scale-[0.98] ${
            howItWorksOpen ? "pointer-events-none" : ""
          }`}
        >
          How it Works
        </button>
      </div>

      {/* How it Works panel - expands from top when opening */}
      <div
        className={`absolute inset-0 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          howItWorksOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <HowItWorksPanel onClose={closeHowItWorks} isOpen={howItWorksOpen} />
      </div>

      {/* Chat - hidden when How it Works is open */}
      <div
        className={`flex shrink-0 flex-col gap-2 transition-all duration-500 ease-in-out ${
          howItWorksOpen
            ? "max-h-0 min-h-0 overflow-hidden opacity-0"
            : "opacity-100"
        }`}
      >
        <ChatPanel />
      </div>
    </div>
  );
}
