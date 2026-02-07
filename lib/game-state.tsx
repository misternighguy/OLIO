"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Currency = "SOL" | "USDC" | "USD1";
export type ChanceMode = "equivalent" | "varied";
export type GridSize = 3 | 4 | 5;

export interface GameState {
  currency: Currency;
  averageDrillCost: number;
  volatility: number;
  chanceMode: ChanceMode;
  gridSize: GridSize;
  balance: number;
  sessionPnl: number;
  tilesFlipped: number;
  showMotherlode: boolean;
  motherlodeAmount: number;
  /** Mocked: Motherlode pool size (10% of volume) */
  motherlodePool: number;
  /** Mocked: OIL Reserve (30% of volume) */
  oilReserve: number;
  /** Mocked: Payout Reserve (60% of volume) */
  payoutReserve: number;
}

interface GameContextValue extends GameState {
  setCurrency: (c: Currency) => void;
  setAverageDrillCost: (n: number) => void;
  setVolatility: (n: number) => void;
  setChanceMode: (m: ChanceMode) => void;
  setGridSize: (s: GridSize) => void;
  setBalance: (n: number) => void;
  updateSession: (pnlDelta: number, tilesDelta: number) => void;
  resetSession: () => void;
  onMineAll: (() => void) | null;
  setOnMineAll: (fn: (() => void) | null) => void;
  onResetAll: (() => void) | null;
  setOnResetAll: (fn: (() => void) | null) => void;
  triggerMotherlode: (amount: number) => void;
  dismissMotherlode: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const initialState: GameState = {
  currency: "SOL",
  averageDrillCost: 0.25,
  volatility: 0.5,
  chanceMode: "equivalent",
  gridSize: 5,
  balance: 10,
  sessionPnl: 0,
  tilesFlipped: 0,
  showMotherlode: false,
  motherlodeAmount: 0,
  motherlodePool: 12450,
  oilReserve: 89200,
  payoutReserve: 178400,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const [onMineAll, setOnMineAll] = useState<(() => void) | null>(null);
  const [onResetAll, setOnResetAll] = useState<(() => void) | null>(null);

  const updateSession = useCallback((pnlDelta: number, tilesDelta: number) => {
    setState((s) => ({
      ...s,
      sessionPnl: s.sessionPnl + pnlDelta,
      tilesFlipped: s.tilesFlipped + tilesDelta,
      balance: Math.max(0, s.balance + pnlDelta),
    }));
  }, []);

  const resetSession = useCallback(() => {
    setState((s) => ({
      ...s,
      sessionPnl: 0,
      tilesFlipped: 0,
    }));
  }, []);

  const triggerMotherlode = useCallback((amount: number) => {
    setState((s) => ({
      ...s,
      showMotherlode: true,
      motherlodeAmount: amount,
    }));
  }, []);

  const dismissMotherlode = useCallback(() => {
    setState((s) => ({ ...s, showMotherlode: false }));
  }, []);

  const value: GameContextValue = {
    ...state,
    setCurrency: (c) => setState((s) => ({ ...s, currency: c })),
    setAverageDrillCost: (n) =>
      setState((s) => ({ ...s, averageDrillCost: Math.max(0.01, Math.min(1000, n)) })),
    setVolatility: (n) =>
      setState((s) => ({ ...s, volatility: Math.max(0, Math.min(1, n)) })),
    setChanceMode: (m) => setState((s) => ({ ...s, chanceMode: m })),
    setGridSize: (s) => setState((prev) => ({ ...prev, gridSize: s })),
    setBalance: (n) => setState((s) => ({ ...s, balance: Math.max(0, n) })),
    updateSession,
    resetSession,
    onMineAll,
    setOnMineAll,
    onResetAll,
    setOnResetAll,
    triggerMotherlode,
    dismissMotherlode,
  };

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameState must be used within GameProvider");
  return ctx;
}
