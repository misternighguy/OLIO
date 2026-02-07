"use client";

import { useCallback, useEffect, useState } from "react";
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

  const n = gridSize * gridSize;

  const regenerateCosts = useCallback(() => {
    setInsufficientBalanceTile(null);
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
      if (balance < cost) {
        setInsufficientBalanceTile(index);
        setTimeout(() => setInsufficientBalanceTile(null), 500);
        return;
      }

      const outcome = getOutcome();
      const payout = getPayout(cost, outcome);
      const pnl = payout - cost;

      setOutcomes((prev) => {
        const next = [...prev];
        next[index] = outcome;
        return next;
      });
      updateSession(pnl, 1);
      if (outcome === "motherlode") triggerMotherlode(payout);
    },
    [outcomes, tileCosts, balance, updateSession, triggerMotherlode]
  );

  const mineAll = useCallback(() => {
    const unflipped: number[] = [];
    for (let i = 0; i < n; i++) {
      if (outcomes[i] == null) unflipped.push(i);
    }

    let totalPnl = 0;
    const newOutcomes = [...outcomes];

    for (const i of unflipped) {
      const cost = tileCosts[i];
      if (balance + totalPnl < cost) break;

      const outcome = getOutcome();
      const payout = getPayout(cost, outcome);
      totalPnl += payout - cost;
      newOutcomes[i] = outcome;
      if (outcome === "motherlode") triggerMotherlode(payout);
    }

    setOutcomes(newOutcomes);
    updateSession(totalPnl, unflipped.length);
  }, [n, outcomes, tileCosts, balance, updateSession, triggerMotherlode]);

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
              className="aspect-square animate-pulse rounded-xl border border-white/10 bg-white/5"
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
            affordable={balance >= cost}
            insufficientBalanceShake={insufficientBalanceTile === i}
            onDrill={() => drillTile(i)}
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
