"use client";

import { GameProvider } from "@/lib/game-state";
import type { ReactNode } from "react";

export function GameLayout({ children }: { children: ReactNode }) {
  return (
    <GameProvider>
      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[280px_1fr_280px]">
        {children}
      </div>
    </GameProvider>
  );
}

export function LeftPanel({ children }: { children: ReactNode }) {
  return (
    <aside className="border-r border-white/5 bg-[var(--bg-elevated)]/50 p-4 lg:p-6">
      {children}
    </aside>
  );
}

export function CenterPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-4 lg:p-6">
      {children}
    </div>
  );
}

export function RightPanel({ children }: { children: ReactNode }) {
  return (
    <aside className="border-l border-white/5 bg-[var(--bg-elevated)]/50 p-4 lg:p-6">
      {children}
    </aside>
  );
}
