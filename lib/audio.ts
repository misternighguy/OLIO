/**
 * Audio utilities for outcome sounds and loading.
 * Browsers may block autoplay until user interaction.
 */

export type OutcomeType = "dry" | "oil" | "refinery" | "motherlode";

const SOUND_PATHS: Record<OutcomeType, string> = {
  dry: "/gotdryhole.mp3",
  oil: "/gotoil.mp3",
  refinery: "/gotrefinery.mp3",
  motherlode: "/gotmotherlode.mp3",
};

const AUDIO_DELAY_MS = 100; // Play sound ~0.1s after tile starts turning

const cache = new Map<string, HTMLAudioElement>();

const MASTER_VOLUME = 0.5; // 50% volume to keep it subtle

function getAudio(src: string): HTMLAudioElement {
  let el = cache.get(src);
  if (!el) {
    el = new Audio(src);
    el.volume = MASTER_VOLUME;
    cache.set(src, el);
  }
  return el;
}

export function playOutcomeSound(
  outcome: OutcomeType,
  enabled: boolean,
  delayMs = AUDIO_DELAY_MS
): void {
  if (!enabled) return;
  const src = SOUND_PATHS[outcome];
  if (!src) return;
  const el = getAudio(src);
  el.currentTime = 0;
  if (delayMs <= 0) {
    el.play().catch(() => {});
  } else {
    setTimeout(() => {
      el.play().catch(() => {});
    }, delayMs);
  }
}

export function playLoadingSound(enabled: boolean): void {
  if (!enabled) return;
  const el = getAudio("/loading.mp3");
  el.currentTime = 0;
  el.play().catch(() => {});
}
