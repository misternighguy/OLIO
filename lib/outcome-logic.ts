/**
 * Tile cost generation and outcome logic for OIL Drilling.
 * From spec: min=max(0.01,0.04A) at v=1, max=min(1000,4A) at v=1.
 * Outcomes: Dry Hole 69.84%, Oil Field 24%, Refinery 6%, Motherlode 0.16%.
 */

export type OutcomeType = "dry" | "oil" | "refinery" | "motherlode";

const OUTCOME_WEIGHTS: { outcome: OutcomeType; weight: number }[] = [
  { outcome: "dry", weight: 69.84 },
  { outcome: "oil", weight: 24 },
  { outcome: "refinery", weight: 6 },
  { outcome: "motherlode", weight: 0.16 },
];

export function getOutcome(): OutcomeType {
  const r = Math.random() * 100;
  let cumulative = 0;
  for (const { outcome, weight } of OUTCOME_WEIGHTS) {
    cumulative += weight;
    if (r < cumulative) return outcome;
  }
  return "dry";
}

export function getPayout(cost: number, outcome: OutcomeType): number {
  switch (outcome) {
    case "dry":
      return 0;
    case "oil":
      return cost * 1.5;
    case "refinery":
      return cost * 4;
    case "motherlode":
      return cost * 50; // mock jackpot multiplier
    default:
      return 0;
  }
}

/**
 * Generate tile costs for grid. Preserves average while allowing volatility.
 * At v=1: min=max(0.01, 0.04*A), max=min(1000, 4*A).
 * Interpolates for v in [0,1]. Normalizes so sum = N*A.
 */
export function generateTileCosts(
  gridSize: number,
  averageCost: number,
  volatility: number
): number[] {
  const n = gridSize * gridSize;
  const A = averageCost;
  const v = Math.max(0, Math.min(1, volatility));

  const minAtV1 = Math.max(0.01, 0.04 * A);
  const maxAtV1 = Math.min(1000, 4 * A);
  const effectiveMin = A + v * (minAtV1 - A);
  const effectiveMax = A + v * (maxAtV1 - A);
  const lo = Math.max(0.01, Math.min(A, effectiveMin));
  const hi = Math.min(1000, Math.max(A, effectiveMax));

  const raw: number[] = [];
  for (let i = 0; i < n; i++) {
    raw.push(lo + Math.random() * (hi - lo));
  }

  const sum = raw.reduce((a, b) => a + b, 0);
  const scale = (n * A) / sum;
  return raw.map((x) => Math.max(0.01, Math.min(1000, x * scale)));
}
