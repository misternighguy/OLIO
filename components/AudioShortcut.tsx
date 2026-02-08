"use client";

import { useEffect, useCallback } from "react";
import { useGameState } from "@/lib/game-state";

/**
 * Listens for M key to toggle mute/unmute.
 */
export function AudioShortcut() {
  const { audioEnabled, setAudioEnabled } = useGameState();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") {
        if (e.repeat) return; // Ignore key repeat (holding key)
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        setAudioEnabled(!audioEnabled);
      }
    },
    [audioEnabled, setAudioEnabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return null;
}
