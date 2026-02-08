"use client";

import { useGameState } from "@/lib/game-state";
import { useSolPrice } from "@/lib/use-sol-price";

const formatCost = (n: number) => (n >= 1 ? n.toFixed(1) : n.toFixed(2));

const formatUsd = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function MobileBalanceStrip() {
  const { balance, currency, setBalance } = useGameState();
  const { price: solPrice } = useSolPrice();

  const usdValue =
    currency === "SOL" && solPrice != null ? balance * solPrice : null;

  return (
    <div className="order-0 min-w-0 px-4 pb-2 lg:order-none lg:hidden">
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
  );
}
