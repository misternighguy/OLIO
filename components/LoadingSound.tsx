"use client";

import { useEffect } from "react";
import { useGameState } from "@/lib/game-state";
import { playLoadingSound } from "@/lib/audio";

let hasPlayedEver = false;

/**
 * Plays loading.mp3 once per session when the user first lands and audio is enabled.
 * Browsers may block autoplay until user interaction.
 */
export function LoadingSound() {
  const { audioEnabled } = useGameState();

  useEffect(() => {
    if (hasPlayedEver || !audioEnabled) return;
    hasPlayedEver = true;
    playLoadingSound(true);
  }, [audioEnabled]);

  return null;
}
