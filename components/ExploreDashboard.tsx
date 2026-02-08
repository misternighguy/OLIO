"use client";

import { useState } from "react";
import {
  exploreCounters,
  formatLarge,
  dailyDrillingActivity,
  motherlodeRounds,
  topMiners,
  formatRelativeTime,
} from "@/lib/explore-data";
import { OilPurchasesChart } from "./OilPurchasesChart";

function PaginationBar({
  page,
  totalPages,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3 md:px-6">
      <span className="text-sm text-[var(--text-muted)]">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function PaginatedMotherlodesTable({
  data,
  pageSize,
}: {
  data: import("@/lib/explore-data").MotherlodeRound[];
  pageSize: number;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const slice = data.slice(page * pageSize, (page + 1) * pageSize);
  const SOLSCAN_BASE = "https://solscan.io/tx/";
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Round
              </th>
              <th
                className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6"
                title="Segments are every 6 hours"
              >
                Segment
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Winner
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Winners
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Deployed
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Vaulted
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Winnings
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Tx
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Motherlode Time
              </th>
            </tr>
          </thead>
          <tbody>
            {slice.map((row) => (
              <tr
                key={row.roundId}
                className="border-b border-white/5 transition-colors hover:bg-black/50 last:border-0"
              >
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  #{row.roundId.toLocaleString()}
                </td>
                <td
                  className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6 cursor-help"
                  title="Segments are every 6 hours"
                >
                  {row.segment}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {row.winner}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {row.winnersCount}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {row.deployed.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {row.vaulted.toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--accent)] md:px-6">
                  {row.winnings.toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </td>
                <td className="px-4 py-4 md:px-6">
                  <a
                    href={`${SOLSCAN_BASE}${row.solscanTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[var(--accent)] transition-colors duration-200 hover:underline"
                  >
                    View
                  </a>
                </td>
                <td className="px-4 py-4 text-sm text-[var(--text-muted)] md:px-6">
                  {formatRelativeTime(row.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <PaginationBar
          page={page + 1}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          canPrev={page > 0}
          canNext={page < totalPages - 1}
        />
      )}
    </div>
  );
}

function PaginatedDrillingTable({
  data,
  pageSize,
}: {
  data: import("@/lib/explore-data").DailyDrillingEntry[];
  pageSize: number;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const slice = data.slice(page * pageSize, (page + 1) * pageSize);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Tiles
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Amount (SOL)
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Amount (USD)
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Avg Cost
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                % of Daily Revenue
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Revenue
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <tr
                key={row.date + i}
                className="border-b border-white/5 transition-colors hover:bg-black/50 last:border-0"
              >
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {formatLarge(row.tilesDrilled)}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {row.amountSol.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {row.amountUsd.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  ${row.avgCostSol.toFixed(3)}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {row.pctOfDailyRevenue.toFixed(3)}%
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {row.revenueSol.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  SOL
                </td>
                <td className="px-4 py-4 text-sm text-[var(--text-muted)] md:px-6">
                  {row.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <PaginationBar
          page={page + 1}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          canPrev={page > 0}
          canNext={page < totalPages - 1}
        />
      )}
    </div>
  );
}

function PaginatedLeaderboardTable({
  data,
  pageSize,
}: {
  data: import("@/lib/explore-data").LeaderboardEntry[];
  pageSize: number;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const slice = data.slice(page * pageSize, (page + 1) * pageSize);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Rank
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Address
              </th>
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                Total Deployed
              </th>
            </tr>
          </thead>
          <tbody>
            {slice.map((entry) => (
              <tr
                key={entry.rank}
                className="border-b border-white/5 transition-colors hover:bg-black/50 last:border-0"
              >
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  #{entry.rank}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {entry.address}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)] md:px-6">
                  {entry.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{" "}
                  SOL
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <PaginationBar
          page={page + 1}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          canPrev={page > 0}
          canNext={page < totalPages - 1}
        />
      )}
    </div>
  );
}

/** Stat card — matches OIL Purchases chart */
function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 md:p-5">
      <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:text-sm">
        {label}
      </h3>
      <p
        className={`mt-2 font-mono text-lg font-semibold md:text-xl ${
          accent ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function ExploreDashboard() {
  return (
    <div className="relative min-h-screen">
      <main className="relative z-10 min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-6 md:pb-20 md:pt-16 lg:px-8">
          {/* Hero */}
          <div className="mb-12 flex flex-col items-center text-center md:mb-16">
            <h1 className="mb-4 text-4xl font-bold text-black md:text-5xl lg:text-6xl">
              OIL Token
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-black/80 md:text-lg">
              View historical OLIO drilling revenue and activity since launch.
              Transparent economics: 10% Motherlode Pool, 30% OIL Reserve, 60% Payout Reserve.
            </p>
          </div>

          {/* Stats grid */}
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mb-16 lg:grid-cols-3 lg:gap-6">
            <StatCard
              label="Total Drilling (SOL)"
              value={`${formatLarge(exploreCounters.lifetimeVolume)} SOL`}
              accent
            />
            <StatCard
              label="Total Drilling (USD)"
              value={`$${formatLarge(exploreCounters.lifetimeVolumeUsd)}`}
            />
            <StatCard
              label="Total Tiles Drilled"
              value={formatLarge(exploreCounters.totalTilesDrilled)}
            />
            <StatCard
              label="Motherlode Pool"
              value={`${formatLarge(exploreCounters.motherlodePool)} SOL`}
            />
            <StatCard
              label="OIL Reserve offset"
              value={`${exploreCounters.supplyOffsetPct}%`}
            />
            <StatCard
              label="Protocol Revenue"
              value={`${formatLarge(exploreCounters.protocolRevenue)} SOL`}
            />
          </div>

          {/* OIL Purchases / Buybacks Chart */}
          <section className="mb-12 md:mb-16">
            <h2 className="mb-6 text-2xl font-semibold text-black md:text-3xl">
              OIL Reserve Purchases
            </h2>
            <OilPurchasesChart />
          </section>

          {/* Motherlodes — recent rounds where motherlode hit */}
          <section className="mb-12 md:mb-16">
            <h2 className="mb-6 text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              Mining Rounds
            </h2>
            <p className="mb-4 text-sm text-[var(--text-muted)]">
              Recent mining rounds where the motherlode hit.
            </p>
            <PaginatedMotherlodesTable data={motherlodeRounds} pageSize={10} />
          </section>

          {/* Drilling Activity table — 20 rows per page */}
          <section className="mb-12 md:mb-16">
            <h2 className="mb-6 text-2xl font-semibold text-black md:text-3xl">
              Drilling Activity
            </h2>
            <PaginatedDrillingTable data={dailyDrillingActivity} pageSize={20} />
          </section>

          {/* Leaderboard — top miners by total deployed */}
          <section className="mb-12 md:mb-16">
            <h2 className="mb-6 text-2xl font-semibold text-black md:text-3xl">
              Leaderboard
            </h2>
            <p className="mb-4 text-sm text-black/80">
              Top miners by total SOL deployed over their lifetime.
            </p>
            <PaginatedLeaderboardTable data={topMiners} pageSize={20} />
          </section>

          {/* Legal disclaimer */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-md md:mt-16 md:p-8">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Legal Disclaimer
            </h3>
            <p className="text-xs leading-relaxed text-[var(--text-muted)] md:text-sm">
              Any references to drilling activity are for informational purposes
              only and describe historical data. This information should not be
              understood as a commitment to future allocations. OLIO reserves the
              right to modify economics, allocations, or discontinue the game at
              any time. Participation involves risk. Past activity is not
              indicative of future results.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
