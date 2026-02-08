"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from current value to target over duration (ease-out).
 */
export function useAnimatedNumber(
  target: number | null,
  durationMs = 1500
): number | null {
  const [display, setDisplay] = useState<number | null>(target);
  const displayRef = useRef(target);

  useEffect(() => {
    if (target == null) {
      setDisplay(null);
      displayRef.current = null;
      return;
    }
    const start = displayRef.current ?? target;
    displayRef.current = start;
    const diff = target - start;
    if (diff === 0 && start === target) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + diff * eased;
      setDisplay(value);
      displayRef.current = value;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        displayRef.current = target;
      }
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, durationMs]);

  return display ?? target;
}
