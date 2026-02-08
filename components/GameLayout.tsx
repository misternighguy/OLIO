"use client";

import { GameProvider, useGameState } from "@/lib/game-state";
import { MotherlodeOverlay } from "@/components/MotherlodeOverlay";
import { LoadingSound } from "@/components/LoadingSound";
import { AudioShortcut } from "@/components/AudioShortcut";
import type { ReactNode } from "react";

function MotherlodeGate() {
  const {
    showMotherlode,
    motherlodeAmount,
    currency,
    dismissMotherlode,
  } = useGameState();
  if (!showMotherlode) return null;
  return (
    <MotherlodeOverlay
      amount={motherlodeAmount}
      currency={currency}
      onDismiss={dismissMotherlode}
    />
  );
}

export function GameLayout({ children }: { children: ReactNode }) {
  return (
    <GameProvider>
      <LoadingSound />
      <AudioShortcut />
      <MotherlodeGate />
      <div className="grid flex-1 min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(240px,280px)_1fr_minmax(240px,280px)] lg:items-stretch">
        {children}
      </div>
    </GameProvider>
  );
}

export function LeftPanel({ children }: { children: ReactNode }) {
  return (
    <aside className="min-w-0 self-stretch overflow-y-auto border-r border-white/10 bg-white/10 backdrop-blur-[1px] p-4 lg:p-6">
      {children}
    </aside>
  );
}

export function CenterPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-auto p-4 lg:p-6">
      {children}
    </div>
  );
}

export function RightPanel({ children }: { children: ReactNode }) {
  return (
    <aside className="flex min-w-0 flex-col self-stretch overflow-y-auto border-l border-white/10 bg-white/10 backdrop-blur-[1px] p-4 lg:p-6">
      {children}
    </aside>
  );
}
