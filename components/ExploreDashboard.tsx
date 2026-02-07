"use client";

import {
  exploreCounters,
  formatLarge,
  dailyDrillingActivity,
} from "@/lib/explore-data";

/** Stat card — fees.pump.fun style */
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
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 md:p-5">
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
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 md:px-6 md:pt-12 lg:px-8">
        {/* Hero — fees.pump.fun style */}
        <div className="mb-8 flex flex-col items-center text-center md:mb-12">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[var(--accent)]/10 md:h-16 md:w-16"
            aria-hidden
          >
            <span className="text-2xl md:text-3xl">🛢</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl lg:text-4xl">
            OIL token
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)] md:text-base">
            View historical OLIO drilling revenue and activity since launch.
            Transparent economics: 10% Motherlode Pool, 30% OIL Reserve, 60% Payout Reserve.
          </p>
        </div>

        {/* Stats grid — 6 cards like fees.pump.fun */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* Disclaimer block */}
        <div className="mb-10 rounded-xl border border-white/10 bg-white/[0.02] p-4 md:p-6">
          <p className="text-xs leading-relaxed text-[var(--text-muted)] md:text-sm">
            OLIO expects to use substantially all net revenue for the Motherlode
            jackpot, OIL Reserve buybacks, and protocol development. OLIO may
            modify or discontinue these allocations at any time. The OIL token
            does not represent a right to revenues or any distribution.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)] md:text-sm">
            &quot;Revenue&quot; includes drilling fees net of payouts. Economics
            are transparent: 10% to Motherlode Pool, 30% to OIL Reserve, 60% to
            Payout Reserve.
          </p>
        </div>

        {/* Drilling Activity table — Token Purchases style */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)] md:text-xl">
            Drilling Activity
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                    Tiles
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                    Amount (SOL)
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                    Amount (USD)
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                    Avg Cost
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                    % of Daily Revenue
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] md:px-6">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyDrillingActivity.map((row, i) => (
                  <tr
                    key={row.date + i}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.02] last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-sm text-[var(--text-primary)] md:px-6">
                      {formatLarge(row.tilesDrilled)}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[var(--text-primary)] md:px-6">
                      {row.amountSol.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[var(--text-primary)] md:px-6">
                      {row.amountUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[var(--text-primary)] md:px-6">
                      ${row.avgCostSol.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[var(--text-primary)] md:px-6">
                      {row.pctOfDailyRevenue.toFixed(3)}%
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[var(--text-primary)] md:px-6">
                      {row.revenueSol.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      SOL
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)] md:px-6">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Legal disclaimer */}
        <div className="mt-10 rounded-lg border border-white/5 bg-transparent p-4 md:p-6">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
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
  );
}
