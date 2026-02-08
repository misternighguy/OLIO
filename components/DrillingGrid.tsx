"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGameState, riskLevelToVolatility } from "@/lib/game-state";
import { generateTileCosts, type OutcomeType } from "@/lib/outcome-logic";
import { useSolPrice } from "@/lib/use-sol-price";
import { DrillTile } from "./DrillTile";

export function DrillingGrid() {
  const {
    gridSize,
    averageDrillCost,
    riskLevel,
    currency,
    balance,
    audioEnabled,
    tilesFlipped,
    sessionPnl,
    updateSession,
    setOnMineAll,
    setOnResetAll,
    resetSession,
    triggerMotherlode,
    motherlodePool,
  } = useGameState();

  const { price: solPrice } = useSolPrice();

  const [tileCosts, setTileCosts] = useState<number[]>([]);
  const [outcomes, setOutcomes] = useState<(OutcomeType | null)[]>([]);
  const [payouts, setPayouts] = useState<(number | null)[]>([]);
  const [insufficientBalanceTile, setInsufficientBalanceTile] = useState<
    number | null
  >(null);
  // Track costs reserved by tiles still animating (prevents double-spending)
  const pendingCostRef = useRef(0);
  // Store pending pnl per tile index so we can apply on reveal
  const pendingPnlRef = useRef<Map<number, number>>(new Map());
  // Track staggered timeouts from Mine All so we can cancel on reset
  const mineAllTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const n = gridSize * gridSize;

  const regenerateCosts = useCallback(() => {
    setInsufficientBalanceTile(null);
    pendingCostRef.current = 0;
    pendingPnlRef.current.clear();
    mineAllTimersRef.current.forEach(clearTimeout);
    mineAllTimersRef.current = [];
    const volatility = riskLevelToVolatility(riskLevel);
    setTileCosts(generateTileCosts(gridSize, averageDrillCost, volatility));
    setOutcomes(Array(n).fill(null));
    setPayouts(Array(n).fill(null));
  }, [gridSize, averageDrillCost, riskLevel, n]);

  useEffect(() => {
    regenerateCosts();
  }, [regenerateCosts]);

  const drillTile = useCallback(
    async (index: number) => {
      if (outcomes[index] != null) return;
      const cost = tileCosts[index];
      const availableBalance = balance - pendingCostRef.current;
      if (availableBalance < cost) {
        setInsufficientBalanceTile(index);
        setTimeout(() => setInsufficientBalanceTile(null), 500);
        return;
      }

      // Reserve cost so rapid clicks can't overdraft
      pendingCostRef.current += cost;

      // Convert to USD for motherlode calculation
      const usdRate = currency === "SOL" ? (solPrice ?? 0) : 1;
      const betUSD = cost * usdRate;
      const motherlodePoolUSD = motherlodePool * usdRate;

      try {
        const response = await fetch("/api/drill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cost,
            riskLevel,
            motherlodePool,
            betUSD,
            motherlodePoolUSD,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const { outcome, payout } = data;
        const pnl = payout - cost;

        pendingPnlRef.current.set(index, pnl);

        setOutcomes((prev) => {
          const next = [...prev];
          next[index] = outcome;
          return next;
        });
        setPayouts((prev) => {
          const next = [...prev];
          next[index] = payout;
          return next;
        });
        if (outcome === "motherlode") triggerMotherlode(payout);
      } catch (error) {
        console.error("[DrillingGrid] Drill API error:", error);
        // Release reserved cost on error
        pendingCostRef.current = Math.max(0, pendingCostRef.current - cost);
        // Show error state (for now just log; could show a notification)
      }
    },
    [outcomes, tileCosts, balance, motherlodePool, riskLevel, currency, solPrice, triggerMotherlode]
  );

  const handleTileReveal = useCallback(
    (index: number) => {
      const pnl = pendingPnlRef.current.get(index);
      if (pnl == null) return;
      const cost = tileCosts[index];
      pendingCostRef.current = Math.max(0, pendingCostRef.current - cost);
      pendingPnlRef.current.delete(index);
      updateSession(pnl, 1);
    },
    [tileCosts, updateSession]
  );

  const mineAll = useCallback(() => {
    // Clear any in-flight stagger timers from a previous Mine All
    mineAllTimersRef.current.forEach(clearTimeout);
    mineAllTimersRef.current = [];

    // Gather unflipped tile indices
    const unflipped: number[] = [];
    for (let i = 0; i < n; i++) {
      if (outcomes[i] == null) unflipped.push(i);
    }

    // Figure out how many tiles we can afford (reserve costs up front to prevent overdraft)
    let runningCost = pendingCostRef.current;
    const affordableIndices: number[] = [];
    for (const i of unflipped) {
      const cost = tileCosts[i];
      if (balance - runningCost < cost) break;
      runningCost += cost;
      affordableIndices.push(i);
    }
    // Reserve all costs now so single-clicks during cascade can't overdraft
    pendingCostRef.current = runningCost;

    // Convert to USD for motherlode calculation
    const usdRate = currency === "SOL" ? (solPrice ?? 0) : 1;
    const motherlodePoolUSD = motherlodePool * usdRate;

    // Stagger each tile — outcome determined live when its timer fires
    const STAGGER_MS = 100;
    affordableIndices.forEach((tileIndex, order) => {
      const timer = setTimeout(async () => {
        const cost = tileCosts[tileIndex];
        const betUSD = cost * usdRate;

        try {
          const response = await fetch("/api/drill", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cost,
              riskLevel,
              motherlodePool,
              betUSD,
              motherlodePoolUSD,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          const { outcome, payout } = data;
          const pnl = payout - cost;

          pendingPnlRef.current.set(tileIndex, pnl);

          setOutcomes((prev) => {
            const next = [...prev];
            next[tileIndex] = outcome;
            return next;
          });
          setPayouts((prev) => {
            const next = [...prev];
            next[tileIndex] = payout;
            return next;
          });
          if (outcome === "motherlode") triggerMotherlode(payout);
        } catch (error) {
          console.error("[DrillingGrid] Mine All drill error:", error);
        }
      }, order * STAGGER_MS);
      mineAllTimersRef.current.push(timer);
    });
  }, [n, outcomes, tileCosts, balance, motherlodePool, riskLevel, currency, solPrice, triggerMotherlode]);

  const handleResetAll = useCallback(() => {
    regenerateCosts();
    resetSession();
  }, [regenerateCosts, resetSession]);

  useEffect(() => {
    setOnMineAll(() => mineAll);
    return () => setOnMineAll(null);
  }, [mineAll, setOnMineAll]);

  useEffect(() => {
    setOnResetAll(() => handleResetAll);
    return () => setOnResetAll(null);
  }, [handleResetAll, setOnResetAll]);

  const unminedTotal = tileCosts.reduce((a, b) => a + b, 0);
  const minedTotal = tileCosts.reduce(
    (sum, cost, i) => sum + (outcomes[i] != null ? cost : 0),
    0
  );

  const StatsBar = () => (
    <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
      <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5">
        <span className="text-xs font-medium text-black">Unmined</span>
        <span className="font-mono text-xs font-semibold text-black/80">
          {unminedTotal.toFixed(2)} {currency}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5">
        <span className="text-xs font-medium text-black">Mined</span>
        <span className="font-mono text-xs font-semibold text-black/80">
          {minedTotal.toFixed(2)} {currency}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5">
        <span className="text-xs font-medium text-black">Attempts</span>
        <span className="font-mono text-xs font-semibold text-black/80">
          {tilesFlipped}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5">
        <span className="text-xs font-medium text-black">Profit</span>
        <span
          className={`font-mono text-xs font-semibold ${
            sessionPnl >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {sessionPnl >= 0 ? "+" : ""}
          {sessionPnl.toFixed(2)} {currency}
        </span>
      </div>
    </div>
  );

  if (tileCosts.length !== n) {
    return (
      <div className="mx-auto w-[90%] min-w-0 max-w-2xl">
        <div
          className="grid gap-1.5 sm:gap-2 md:gap-3"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: n }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-full border-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url(/tilebg.png)" }}
            />
          ))}
        </div>
        <StatsBar />
        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          Preparing field…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[90%] min-w-0 max-w-2xl">
      <div
        className="grid gap-1.5 sm:gap-2 md:gap-3"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {tileCosts.map((cost, i) => (
          <DrillTile
            key={i}
            cost={cost}
            currency={currency}
            outcome={outcomes[i]}
            payout={payouts[i] ?? undefined}
            motherlodePool={motherlodePool}
            audioEnabled={audioEnabled}
            affordable={balance - pendingCostRef.current >= cost}
            insufficientBalanceShake={insufficientBalanceTile === i}
            onDrill={() => drillTile(i)}
            onReveal={() => handleTileReveal(i)}
            disabled={outcomes[i] != null}
          />
        ))}
      </div>
      <StatsBar />
    </div>
  );
}
