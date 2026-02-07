"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGameState } from "@/lib/game-state";
import {
  generateTileCosts,
  getOutcome,
  getPayout,
  type OutcomeType,
} from "@/lib/outcome-logic";
import { DrillTile } from "./DrillTile";

export function DrillingGrid() {
  const {
    gridSize,
    averageDrillCost,
    volatility,
    currency,
    balance,
    updateSession,
    setOnMineAll,
    setOnResetAll,
    resetSession,
    triggerMotherlode,
  } = useGameState();

  const [tileCosts, setTileCosts] = useState<number[]>([]);
  const [outcomes, setOutcomes] = useState<(OutcomeType | null)[]>([]);
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
    setTileCosts(generateTileCosts(gridSize, averageDrillCost, volatility));
    setOutcomes(Array(n).fill(null));
  }, [gridSize, averageDrillCost, volatility, n]);

  useEffect(() => {
    regenerateCosts();
  }, [regenerateCosts]);

  const drillTile = useCallback(
    (index: number) => {
      if (outcomes[index] != null) return;
      const cost = tileCosts[index];
      const availableBalance = balance - pendingCostRef.current;
      if (availableBalance < cost) {
        setInsufficientBalanceTile(index);
        setTimeout(() => setInsufficientBalanceTile(null), 500);
        return;
      }

      const outcome = getOutcome();
      const payout = getPayout(cost, outcome);
      const pnl = payout - cost;

      // Reserve cost so rapid clicks can't overdraft
      pendingCostRef.current += cost;
      pendingPnlRef.current.set(index, pnl);

      setOutcomes((prev) => {
        const next = [...prev];
        next[index] = outcome;
        return next;
      });
      if (outcome === "motherlode") triggerMotherlode(payout);
    },
    [outcomes, tileCosts, balance, triggerMotherlode]
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

    // Stagger each tile — outcome determined live when its timer fires
    const STAGGER_MS = 100;
    affordableIndices.forEach((tileIndex, order) => {
      const timer = setTimeout(() => {
        const cost = tileCosts[tileIndex];
        const outcome = getOutcome();
        const payout = getPayout(cost, outcome);
        const pnl = payout - cost;

        pendingPnlRef.current.set(tileIndex, pnl);

        setOutcomes((prev) => {
          const next = [...prev];
          next[tileIndex] = outcome;
          return next;
        });
        if (outcome === "motherlode") triggerMotherlode(payout);
      }, order * STAGGER_MS);
      mineAllTimersRef.current.push(timer);
    });
  }, [n, outcomes, tileCosts, balance, triggerMotherlode]);

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

  if (tileCosts.length !== n) {
    return (
      <div className="w-full min-w-0 max-w-2xl">
        <div
          className="grid gap-1.5 sm:gap-2 md:gap-3"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: n }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-full border border-white/10 bg-white/5"
            />
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          Preparing field…
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-2xl">
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
            affordable={balance - pendingCostRef.current >= cost}
            insufficientBalanceShake={insufficientBalanceTile === i}
            onDrill={() => drillTile(i)}
            onReveal={() => handleTileReveal(i)}
            disabled={outcomes[i] != null}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
        Click tiles to drill • Grid size: {gridSize}×{gridSize}
      </p>
    </div>
  );
}
