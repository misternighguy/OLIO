/**
 * Tile cost generation and outcome logic for OIL Drilling.
 * From spec: min=max(0.01,0.04A) at v=1, max=min(1000,4A) at v=1.
 *
 * Risk-based probabilities (tuned for -15% EV):
 *   Strategic (low):   Dry 60.71%, Oil 34.29% (1.75x), Refinery 5.00% (5x)
 *   Targeted (medium): Dry 72.00%, Oil 26.00% (2.5x),  Refinery 2.00% (10x)
 *   Random (high):     Dry 82.88%, Oil 15.62% (4x),    Refinery 1.50% (15x)
 *   Motherlode: dynamic probability (bet_usd / 3) / motherlode_pool_usd
 */

export type OutcomeType = "dry" | "oil" | "refinery" | "motherlode";
export type RiskLevel = "strategic" | "targeted" | "random";

interface RiskConfig {
  probabilities: {
    dry: number;
    oil: number;
    refinery: number;
  };
  payouts: {
    oil: number;
    refinery: number;
  };
}

const RISK_CONFIG: Record<RiskLevel, RiskConfig> = {
  strategic: {
    probabilities: { dry: 60.71, oil: 34.29, refinery: 5.0 },
    payouts: { oil: 1.75, refinery: 5.0 },
  },
  targeted: {
    probabilities: { dry: 72.0, oil: 26.0, refinery: 2.0 },
    payouts: { oil: 2.5, refinery: 10.0 },
  },
  random: {
    probabilities: { dry: 82.88, oil: 15.62, refinery: 1.5 },
    payouts: { oil: 4.0, refinery: 15.0 },
  },
};

/**
 * Determine outcome based on risk level (dry/oil/refinery only).
 * Motherlode is rolled separately with dynamic probability.
 */
export function getOutcome(riskLevel: RiskLevel): OutcomeType {
  const config = RISK_CONFIG[riskLevel];
  const r = Math.random() * 100;

  if (r < config.probabilities.dry) return "dry";
  if (r < config.probabilities.dry + config.probabilities.oil) return "oil";
  if (r < config.probabilities.dry + config.probabilities.oil + config.probabilities.refinery) {
    return "refinery";
  }
  return "dry";
}

/**
 * Calculate payout for a given outcome.
 * @param cost        The tile's drill cost
 * @param outcome     The outcome type
 * @param riskLevel   Risk level (determines multipliers)
 * @param motherlodePool  Current motherlode reserve (needed for motherlode payout)
 */
export function getPayout(
  cost: number,
  outcome: OutcomeType,
  riskLevel: RiskLevel,
  motherlodePool?: number
): number {
  const config = RISK_CONFIG[riskLevel];
  switch (outcome) {
    case "dry":
      return 0;
    case "oil":
      return cost * config.payouts.oil;
    case "refinery":
      return cost * config.payouts.refinery;
    case "motherlode":
      return (motherlodePool ?? 0) * 0.8;
    default:
      return 0;
  }
}

/**
 * Calculate motherlode probability dynamically based on bet size and pool.
 * P(motherlode) = (bet_usd / 3) / motherlode_pool_usd
 * Clamped to [0, 0.01] to avoid degenerate cases.
 */
export function getMotherlodeProbability(betUSD: number, motherlodePoolUSD: number): number {
  if (motherlodePoolUSD <= 0) return 0;
  const prob = (betUSD / 3) / motherlodePoolUSD;
  return Math.max(0, Math.min(0.01, prob));
}

/**
 * Roll for motherlode separately (after main outcome).
 * Returns true if motherlode is hit.
 */
export function rollMotherlode(betUSD: number, motherlodePoolUSD: number): boolean {
  const prob = getMotherlodeProbability(betUSD, motherlodePoolUSD);
  return Math.random() < prob;
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
