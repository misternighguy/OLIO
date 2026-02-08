"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type Currency = "SOL" | "USDC" | "USD1";
export type GridSize = 3 | 4 | 5;
export type RiskLevel = "strategic" | "targeted" | "random";

export interface GameState {
  currency: Currency;
  averageDrillCost: number;
  riskLevel: RiskLevel;
  gridSize: GridSize;
  balance: number;
  sessionPnl: number;
  tilesFlipped: number;
  showMotherlode: boolean;
  motherlodeAmount: number;
  audioEnabled: boolean;
  /** Mocked: Motherlode pool size (10% of volume) */
  motherlodePool: number;
  /** Mocked: OIL Reserve (30% of volume) */
  oilReserve: number;
  /** Mocked: Payout Reserve (60% of volume) */
  payoutReserve: number;
}

/** Map risk level to tile-cost volatility for generateTileCosts */
export function riskLevelToVolatility(level: RiskLevel): number {
  switch (level) {
    case "strategic":
      return 0.2;
    case "targeted":
      return 0.5;
    case "random":
      return 1.0;
  }
}

interface GameContextValue extends GameState {
  setCurrency: (c: Currency) => void;
  setAverageDrillCost: (n: number) => void;
  setRiskLevel: (level: RiskLevel) => void;
  setGridSize: (s: GridSize) => void;
  setBalance: (n: number) => void;
  setAudioEnabled: (enabled: boolean) => void;
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

const AUDIO_KEY = "olio-audio-enabled";

function getInitialAudio(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(AUDIO_KEY);
    return stored !== "false";
  } catch {
    return true;
  }
}

const getDefaultState = (): GameState => ({
  currency: "SOL",
  averageDrillCost: 0.25,
  riskLevel: "targeted",
  gridSize: 4,
  balance: 10,
  sessionPnl: 0,
  tilesFlipped: 0,
  showMotherlode: false,
  motherlodeAmount: 0,
  audioEnabled: true,
  motherlodePool: 12450,
  oilReserve: 89200,
  payoutReserve: 178400,
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => ({
    ...getDefaultState(),
    audioEnabled: getInitialAudio(),
  }));
  const [onMineAll, setOnMineAll] = useState<(() => void) | null>(null);
  const [onResetAll, setOnResetAll] = useState<(() => void) | null>(null);

  // Sync audio preference from localStorage on mount (handles hydration)
  useEffect(() => {
    setState((s) => ({ ...s, audioEnabled: getInitialAudio() }));
  }, []);

  // Listen for audio toggle changes from Header (which is outside GameProvider)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === AUDIO_KEY && e.newValue !== null) {
        setState((s) => ({ ...s, audioEnabled: e.newValue !== "false" }));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

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

  const setAudioEnabled = useCallback((enabled: boolean) => {
    setState((s) => ({ ...s, audioEnabled: enabled }));
    try {
      localStorage.setItem(AUDIO_KEY, String(enabled));
    } catch {}
  }, []);

  const value: GameContextValue = {
    ...state,
    setCurrency: (c) => setState((s) => ({ ...s, currency: c })),
    setAverageDrillCost: (n) =>
      setState((s) => ({ ...s, averageDrillCost: Math.max(0.01, Math.min(1000, n)) })),
    setRiskLevel: (level) => setState((s) => ({ ...s, riskLevel: level })),
    setGridSize: (s) => setState((prev) => ({ ...prev, gridSize: s })),
    setBalance: (n) => setState((s) => ({ ...s, balance: Math.max(0, n) })),
    setAudioEnabled,
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
