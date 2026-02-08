/**
 * Mocked Explore dashboard data for MVP.
 */

import type { OutcomeType } from "./outcome-logic";

export const exploreCounters = {
  motherlodePool: 12450,
  oilReserve: 89200,
  payoutReserve: 178400,
  lifetimeVolume: 425000,
  lifetimeVolumeUsd: 33362500, // Mock USD
  lifetimeOILBought: 127500,
  totalTilesDrilled: 8420000,
  protocolRevenue: 42500,
  totalSupply: 1000000000,
  supplyOffsetPct: 8.5,
  circulatingOffsetPct: 12.75,
};

export const formatLarge = (n: number) =>
  n >= 1000
    ? n.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : n.toFixed(2);

export interface RecentRound {
  id: string;
  timestamp: number;
  cost: number;
  outcome: OutcomeType;
  payout: number;
  winner: string;
}

const OUTCOME_ICONS: Record<OutcomeType, string> = {
  dry: "✗",
  oil: "◆",
  refinery: "◇",
  motherlode: "★",
};

export const outcomeIcon = (o: OutcomeType) => OUTCOME_ICONS[o];

export const recentRounds: RecentRound[] = [
  { id: "1", timestamp: Date.now() - 2 * 60 * 1000, cost: 0.44, outcome: "motherlode", payout: 22, winner: "7xK9...m2P" },
  { id: "2", timestamp: Date.now() - 4 * 60 * 1000, cost: 0.18, outcome: "dry", payout: 0, winner: "2aBc...qR4" },
  { id: "3", timestamp: Date.now() - 5 * 60 * 1000, cost: 0.33, outcome: "oil", payout: 0.495, winner: "9fH3...n8L" },
  { id: "4", timestamp: Date.now() - 7 * 60 * 1000, cost: 0.22, outcome: "refinery", payout: 0.88, winner: "4dE1...wX7" },
  { id: "5", timestamp: Date.now() - 9 * 60 * 1000, cost: 0.41, outcome: "dry", payout: 0, winner: "1pQ2...zY9" },
  { id: "6", timestamp: Date.now() - 11 * 60 * 1000, cost: 0.16, outcome: "oil", payout: 0.24, winner: "5rT6...vC3" },
  { id: "7", timestamp: Date.now() - 13 * 60 * 1000, cost: 0.27, outcome: "dry", payout: 0, winner: "8kL9...bN0" },
  { id: "8", timestamp: Date.now() - 15 * 60 * 1000, cost: 0.37, outcome: "oil", payout: 0.555, winner: "3jM4...hG2" },
  { id: "9", timestamp: Date.now() - 18 * 60 * 1000, cost: 0.19, outcome: "dry", payout: 0, winner: "6sW7...fD5" },
  { id: "10", timestamp: Date.now() - 22 * 60 * 1000, cost: 0.29, outcome: "refinery", payout: 1.16, winner: "0uI1...aE8" },
  { id: "11", timestamp: Date.now() - 25 * 60 * 1000, cost: 0.11, outcome: "dry", payout: 0, winner: "2vO3...cR6" },
  { id: "12", timestamp: Date.now() - 28 * 60 * 1000, cost: 0.34, outcome: "oil", payout: 0.51, winner: "7xK9...m2P" },
  { id: "13", timestamp: Date.now() - 32 * 60 * 1000, cost: 0.23, outcome: "dry", payout: 0, winner: "9fH3...n8L" },
  { id: "14", timestamp: Date.now() - 36 * 60 * 1000, cost: 0.40, outcome: "oil", payout: 0.6, winner: "4dE1...wX7" },
  { id: "15", timestamp: Date.now() - 42 * 60 * 1000, cost: 0.15, outcome: "dry", payout: 0, winner: "1pQ2...zY9" },
  { id: "16", timestamp: Date.now() - 48 * 60 * 1000, cost: 0.31, outcome: "refinery", payout: 1.24, winner: "5rT6...vC3" },
  { id: "17", timestamp: Date.now() - 55 * 60 * 1000, cost: 0.26, outcome: "dry", payout: 0, winner: "8kL9...bN0" },
  { id: "18", timestamp: Date.now() - 62 * 60 * 1000, cost: 0.38, outcome: "oil", payout: 0.57, winner: "3jM4...hG2" },
  { id: "19", timestamp: Date.now() - 70 * 60 * 1000, cost: 0.21, outcome: "dry", payout: 0, winner: "6sW7...fD5" },
  { id: "20", timestamp: Date.now() - 78 * 60 * 1000, cost: 0.35, outcome: "oil", payout: 0.525, winner: "0uI1...aE8" },
];

export interface LeaderboardEntry {
  rank: number;
  address: string;
  value: number;
  label?: string;
}

export const topMiners: LeaderboardEntry[] = [
  { rank: 1, address: "AeRD...Dfpe", value: 24227.18 },
  { rank: 2, address: "8Q4M...KJdZ", value: 15689.5633 },
  { rank: 3, address: "Tirith", value: 15522.1 },
  { rank: 4, address: "7xK9...m2P", value: 12450 },
  { rank: 5, address: "2aBc...qR4", value: 9870 },
  { rank: 6, address: "9fH3...n8L", value: 8430 },
  { rank: 7, address: "4dE1...wX7", value: 7120 },
  { rank: 8, address: "1pQ2...zY9", value: 5890 },
  { rank: 9, address: "0uI1...aE8", value: 5120 },
  { rank: 10, address: "5rT6...vC3", value: 4580 },
  { rank: 11, address: "8kL9...bN0", value: 3920 },
  { rank: 12, address: "3jM4...hG2", value: 3410 },
  { rank: 13, address: "6sW7...fD5", value: 2890 },
  { rank: 14, address: "tS2K...izGj", value: 2450 },
  { rank: 15, address: "2vO3...cR6", value: 1980 },
  { rank: 16, address: "vO9...xR2", value: 1650 },
  { rank: 17, address: "K3m...pL7", value: 1420 },
  { rank: 18, address: "qN1...wZ4", value: 1180 },
  { rank: 19, address: "bT5...yM9", value: 980 },
  { rank: 20, address: "fH8...nQ2", value: 820 },
];

export const topWinners: LeaderboardEntry[] = [
  { rank: 1, address: "7xK9...m2P", value: 2240 },
  { rank: 2, address: "0uI1...aE8", value: 1180 },
  { rank: 3, address: "5rT6...vC3", value: 920 },
  { rank: 4, address: "4dE1...wX7", value: 650 },
  { rank: 5, address: "3jM4...hG2", value: 480 },
];

export const mostMotherlodes: LeaderboardEntry[] = [
  { rank: 1, address: "7xK9...m2P", value: 3, label: "3 hits" },
  { rank: 2, address: "2aBc...qR4", value: 2, label: "2 hits" },
  { rank: 3, address: "9fH3...n8L", value: 2, label: "2 hits" },
  { rank: 4, address: "4dE1...wX7", value: 1, label: "1 hit" },
  { rank: 5, address: "0uI1...aE8", value: 1, label: "1 hit" },
];

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (secs < 60) return secs <= 1 ? "just now" : `${secs} sec ago`;
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/** Motherlode round — when a player hit the jackpot */
export interface MotherlodeRound {
  roundId: number;
  segment: number; // segments are every 6 hours
  winner: string;
  winnersCount: number;
  deployed: number; // SOL wagered
  vaulted: number; // game profit (SOL)
  winnings: number; // motherlode payout (SOL)
  timestamp: number;
  solscanTx: string;
}

const MOCK_TX = "4vVdMNx9K2pL7qR3sT8uW1xY5zA6bC0dE2fG4hI"; // placeholder for Solscan link

export const motherlodeRounds: MotherlodeRound[] = [
  { roundId: 148904, segment: 15, winner: "tS2K...izGj", winnersCount: 1, deployed: 206.7, vaulted: 0.0641, winnings: 0.6712, timestamp: Date.now() - 46 * 1000, solscanTx: MOCK_TX },
  { roundId: 148891, segment: 15, winner: "7xK9...m2P", winnersCount: 1, deployed: 189.2, vaulted: 0.0589, winnings: 0.7124, timestamp: Date.now() - 4 * 60 * 1000, solscanTx: MOCK_TX },
  { roundId: 148856, segment: 14, winner: "2aBc...qR4", winnersCount: 1, deployed: 224.1, vaulted: 0.0692, winnings: 0.5833, timestamp: Date.now() - 43 * 60 * 1000, solscanTx: MOCK_TX },
  { roundId: 148820, segment: 14, winner: "9fH3...n8L", winnersCount: 1, deployed: 198.5, vaulted: 0.0612, winnings: 0.6491, timestamp: Date.now() - 2 * 3600 * 1000, solscanTx: MOCK_TX },
  { roundId: 148801, segment: 13, winner: "4dE1...wX7", winnersCount: 2, deployed: 312.4, vaulted: 0.0965, winnings: 1.2402, timestamp: Date.now() - 5 * 3600 * 1000, solscanTx: MOCK_TX },
  { roundId: 148763, segment: 13, winner: "0uI1...aE8", winnersCount: 1, deployed: 167.8, vaulted: 0.0518, winnings: 0.5521, timestamp: Date.now() - 8 * 3600 * 1000, solscanTx: MOCK_TX },
  { roundId: 148721, segment: 12, winner: "5rT6...vC3", winnersCount: 1, deployed: 245.3, vaulted: 0.0757, winnings: 0.8089, timestamp: Date.now() - 14 * 3600 * 1000, solscanTx: MOCK_TX },
  { roundId: 148689, segment: 12, winner: "7xK9...m2P", winnersCount: 1, deployed: 278.9, vaulted: 0.0861, winnings: 0.9234, timestamp: Date.now() - 20 * 3600 * 1000, solscanTx: MOCK_TX },
  { roundId: 148652, segment: 11, winner: "3jM4...hG2", winnersCount: 1, deployed: 193.2, vaulted: 0.0597, winnings: 0.6345, timestamp: Date.now() - 26 * 3600 * 1000, solscanTx: MOCK_TX },
  { roundId: 148615, segment: 11, winner: "8kL9...bN0", winnersCount: 1, deployed: 221.7, vaulted: 0.0685, winnings: 0.7289, timestamp: Date.now() - 32 * 3600 * 1000, solscanTx: MOCK_TX },
];

/** Daily drilling activity for transparency table (fees.pump.fun style) */
export interface DailyDrillingEntry {
  date: string; // "Feb 6, 2026"
  tilesDrilled: number;
  amountSol: number;
  amountUsd: number;
  avgCostSol: number;
  pctOfDailyRevenue: number;
  revenueSol: number;
}

function formatDate(monthsAgo: number, day: number): string {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = dt.getMonth() - monthsAgo;
  const safeMonth = ((m % 12) + 12) % 12;
  const safeYear = y + Math.floor(m / 12);
  const clamped = Math.min(day, new Date(safeYear, safeMonth + 1, 0).getDate());
  return new Date(safeYear, safeMonth, clamped).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const dailyDrillingActivity: DailyDrillingEntry[] = [
  { date: formatDate(0, 6), tilesDrilled: 28420, amountSol: 12450, amountUsd: 977325, avgCostSol: 0.438, pctOfDailyRevenue: 106.2, revenueSol: 11720 },
  { date: formatDate(0, 5), tilesDrilled: 27100, amountSol: 11890, amountUsd: 933365, avgCostSol: 0.439, pctOfDailyRevenue: 102.5, revenueSol: 11598 },
  { date: formatDate(0, 4), tilesDrilled: 28900, amountSol: 12720, amountUsd: 998520, avgCostSol: 0.44, pctOfDailyRevenue: 101.8, revenueSol: 12495 },
  { date: formatDate(0, 3), tilesDrilled: 26500, amountSol: 11640, amountUsd: 913740, avgCostSol: 0.439, pctOfDailyRevenue: 97.6, revenueSol: 11926 },
  { date: formatDate(0, 2), tilesDrilled: 25100, amountSol: 11020, amountUsd: 865070, avgCostSol: 0.439, pctOfDailyRevenue: 101.4, revenueSol: 10864 },
  { date: formatDate(0, 1), tilesDrilled: 26800, amountSol: 11780, amountUsd: 924730, avgCostSol: 0.439, pctOfDailyRevenue: 105.2, revenueSol: 11196 },
  { date: formatDate(1, 31), tilesDrilled: 31200, amountSol: 13700, amountUsd: 1075450, avgCostSol: 0.439, pctOfDailyRevenue: 100.7, revenueSol: 13601 },
  { date: formatDate(1, 30), tilesDrilled: 28200, amountSol: 12380, amountUsd: 971830, avgCostSol: 0.439, pctOfDailyRevenue: 103.5, revenueSol: 11963 },
  { date: formatDate(1, 29), tilesDrilled: 29100, amountSol: 12780, amountUsd: 1003230, avgCostSol: 0.439, pctOfDailyRevenue: 100.5, revenueSol: 12718 },
  { date: formatDate(1, 28), tilesDrilled: 30200, amountSol: 13260, amountUsd: 1040910, avgCostSol: 0.439, pctOfDailyRevenue: 99.3, revenueSol: 13357 },
  { date: formatDate(1, 27), tilesDrilled: 32800, amountSol: 14400, amountUsd: 1130400, avgCostSol: 0.439, pctOfDailyRevenue: 96.5, revenueSol: 14922 },
  { date: formatDate(1, 26), tilesDrilled: 28500, amountSol: 12510, amountUsd: 982035, avgCostSol: 0.439, pctOfDailyRevenue: 102.0, revenueSol: 12267 },
  { date: formatDate(1, 25), tilesDrilled: 29500, amountSol: 12950, amountUsd: 1016575, avgCostSol: 0.439, pctOfDailyRevenue: 99.9, revenueSol: 12962 },
  { date: formatDate(1, 24), tilesDrilled: 21200, amountSol: 9310, amountUsd: 730835, avgCostSol: 0.439, pctOfDailyRevenue: 100.1, revenueSol: 9298 },
  { date: formatDate(1, 23), tilesDrilled: 20600, amountSol: 9040, amountUsd: 709640, avgCostSol: 0.439, pctOfDailyRevenue: 99.9, revenueSol: 9051 },
  { date: formatDate(1, 22), tilesDrilled: 20100, amountSol: 8820, amountUsd: 692370, avgCostSol: 0.439, pctOfDailyRevenue: 97.9, revenueSol: 9008 },
  { date: formatDate(1, 21), tilesDrilled: 20800, amountSol: 9130, amountUsd: 716705, avgCostSol: 0.439, pctOfDailyRevenue: 103.2, revenueSol: 8848 },
  { date: formatDate(1, 20), tilesDrilled: 22300, amountSol: 9790, amountUsd: 768515, avgCostSol: 0.439, pctOfDailyRevenue: 103.4, revenueSol: 9470 },
  { date: formatDate(1, 19), tilesDrilled: 20700, amountSol: 9090, amountUsd: 713565, avgCostSol: 0.439, pctOfDailyRevenue: 100.5, revenueSol: 9043 },
  { date: formatDate(1, 18), tilesDrilled: 24600, amountSol: 10800, amountUsd: 847800, avgCostSol: 0.439, pctOfDailyRevenue: 99.1, revenueSol: 10898 },
  { date: formatDate(1, 17), tilesDrilled: 24500, amountSol: 10750, amountUsd: 843875, avgCostSol: 0.439, pctOfDailyRevenue: 99.9, revenueSol: 10758 },
  { date: formatDate(1, 16), tilesDrilled: 26500, amountSol: 11630, amountUsd: 912955, avgCostSol: 0.439, pctOfDailyRevenue: 99.9, revenueSol: 11639 },
  { date: formatDate(1, 15), tilesDrilled: 23700, amountSol: 10400, amountUsd: 816400, avgCostSol: 0.439, pctOfDailyRevenue: 100.6, revenueSol: 10335 },
  { date: formatDate(1, 14), tilesDrilled: 24200, amountSol: 10620, amountUsd: 833670, avgCostSol: 0.439, pctOfDailyRevenue: 97.8, revenueSol: 10858 },
  { date: formatDate(1, 13), tilesDrilled: 28800, amountSol: 12640, amountUsd: 992240, avgCostSol: 0.439, pctOfDailyRevenue: 98.9, revenueSol: 12781 },
  { date: formatDate(1, 12), tilesDrilled: 27900, amountSol: 12250, amountUsd: 961625, avgCostSol: 0.439, pctOfDailyRevenue: 98.5, revenueSol: 12437 },
  { date: formatDate(1, 11), tilesDrilled: 25900, amountSol: 11370, amountUsd: 892545, avgCostSol: 0.439, pctOfDailyRevenue: 108.9, revenueSol: 10438 },
  { date: formatDate(1, 10), tilesDrilled: 26300, amountSol: 11550, amountUsd: 906675, avgCostSol: 0.439, pctOfDailyRevenue: 90.6, revenueSol: 12752 },
  { date: formatDate(1, 9), tilesDrilled: 29400, amountSol: 12900, amountUsd: 1012650, avgCostSol: 0.439, pctOfDailyRevenue: 99.4, revenueSol: 12978 },
  { date: formatDate(1, 8), tilesDrilled: 29800, amountSol: 13080, amountUsd: 1026780, avgCostSol: 0.439, pctOfDailyRevenue: 101.6, revenueSol: 12875 },
  { date: formatDate(1, 7), tilesDrilled: 30200, amountSol: 13260, amountUsd: 1040910, avgCostSol: 0.439, pctOfDailyRevenue: 98.8, revenueSol: 13421 },
  { date: formatDate(1, 6), tilesDrilled: 22500, amountSol: 9880, amountUsd: 775580, avgCostSol: 0.439, pctOfDailyRevenue: 97.8, revenueSol: 10102 },
  { date: formatDate(1, 5), tilesDrilled: 15800, amountSol: 6940, amountUsd: 544790, avgCostSol: 0.439, pctOfDailyRevenue: 98.9, revenueSol: 7016 },
  { date: formatDate(1, 4), tilesDrilled: 15900, amountSol: 6980, amountUsd: 547930, avgCostSol: 0.439, pctOfDailyRevenue: 100.0, revenueSol: 6980 },
  { date: formatDate(1, 3), tilesDrilled: 21200, amountSol: 9310, amountUsd: 730835, avgCostSol: 0.439, pctOfDailyRevenue: 98.2, revenueSol: 9482 },
  { date: formatDate(1, 2), tilesDrilled: 20600, amountSol: 9040, amountUsd: 709640, avgCostSol: 0.439, pctOfDailyRevenue: 99.3, revenueSol: 9105 },
  { date: formatDate(1, 1), tilesDrilled: 22100, amountSol: 9700, amountUsd: 761450, avgCostSol: 0.439, pctOfDailyRevenue: 99.4, revenueSol: 9755 },
];

/** OIL purchase/buyback entry for chart (30% of revenue → OIL Reserve buybacks) */
export interface DailyPurchaseEntry {
  date: string;
  dateKey: string; // for sorting/selection
  timestamp: number;
  revenueSol: number;
  revenueUsd: number;
  purchasesSol: number;
  purchasesUsd: number;
  purchasesPctOfPrevRevenue: number;
  oilBought: number;
  priceSolPerOil: number;
}

const SOL_USD = 78.5; // mock SOL price for USD calc

/** Derive OIL purchase data from dailyDrillingActivity (30% revenue → buybacks) */
export function getDailyPurchaseData(): DailyPurchaseEntry[] {
  const entries: DailyPurchaseEntry[] = [];
  for (let i = 0; i < dailyDrillingActivity.length; i++) {
    const row = dailyDrillingActivity[i];
    const prev = dailyDrillingActivity[i + 1];
    const purchasesSol = row.revenueSol * 0.3; // 30% to OIL Reserve
    const priceSolPerOil = 0.85 + (i % 11) * 0.025; // mock: ~0.85–1.1 SOL per OIL (deterministic)
    const oilBought = purchasesSol / priceSolPerOil;
    const purchasesPctOfPrevRevenue = prev
      ? (purchasesSol / prev.revenueSol) * 100
      : 100;

    const parts = row.date.replace(",", "").split(" ");
    const month = parts[0];
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const monthNum =
      "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month.slice(0, 3)) / 3 + 1;
    const dt = new Date(year, monthNum - 1, day);

    entries.push({
      date: row.date,
      dateKey: dt.toISOString().slice(0, 10),
      timestamp: dt.getTime(),
      revenueSol: row.revenueSol,
      revenueUsd: row.revenueSol * SOL_USD,
      purchasesSol,
      purchasesUsd: purchasesSol * SOL_USD,
      purchasesPctOfPrevRevenue,
      oilBought,
      priceSolPerOil,
    });
  }
  return entries.reverse(); // oldest first for chart
}

export const dailyPurchaseData = getDailyPurchaseData();

/** Totals for OIL purchases chart header */
export const purchaseTotals = {
  totalPurchasesUsd: dailyPurchaseData.reduce((s, r) => s + r.purchasesUsd, 0),
  totalOilBought: dailyPurchaseData.reduce((s, r) => s + r.oilBought, 0),
  totalSolSpent: dailyPurchaseData.reduce((s, r) => s + r.purchasesSol, 0),
  totalUsdSpent: dailyPurchaseData.reduce((s, r) => s + r.purchasesUsd, 0),
};
