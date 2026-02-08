"use client";

import {
  exploreCounters,
  formatLarge,
  dailyDrillingActivity,
} from "@/lib/explore-data";

/** Stat card with unique styling */
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
    <div className="group relative overflow-hidden rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/50 via-teal-950/40 to-cyan-950/30 p-5 backdrop-blur-xl shadow-[0_4px_24px_rgba(16,185,129,0.1)] transition-all duration-500 hover:scale-[1.03] hover:border-emerald-700/60 hover:shadow-[0_8px_40px_rgba(16,185,129,0.25)] md:p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <h3 className="relative z-10 text-xs font-bold uppercase tracking-widest text-emerald-300/80 md:text-sm">
        {label}
      </h3>
      <p
        className={`relative z-10 mt-3 font-mono text-2xl font-extrabold md:text-3xl ${
          accent ? "bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent" : "text-emerald-100"
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
      {/* Custom background gradient for Explore page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-emerald-950/30 via-teal-950/50 to-cyan-950/60"
      />
      
      <main className="relative z-10 min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-6 md:pb-20 md:pt-16 lg:px-8">
          {/* Hero with unique styling */}
          <div className="mb-12 flex flex-col items-center text-center md:mb-16">
            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-600/30 to-teal-600/20 shadow-[0_0_60px_rgba(16,185,129,0.3)] backdrop-blur-sm md:h-24 md:w-24"
              aria-hidden
            >
              <span className="text-5xl md:text-6xl">🛢</span>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-emerald-200 via-teal-300 to-cyan-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl lg:text-7xl">
              OIL Token
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-emerald-100/80 md:text-xl">
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

          {/* Disclaimer block */}
          <div className="mb-12 rounded-3xl border border-emerald-900/30 bg-gradient-to-br from-emerald-950/40 via-teal-950/30 to-cyan-950/20 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(16,185,129,0.1)] md:mb-16 md:p-8">
            <p className="text-sm leading-relaxed text-emerald-100/70 md:text-base">
              OLIO expects to use substantially all net revenue for the Motherlode
              jackpot, OIL Reserve buybacks, and protocol development. OLIO may
              modify or discontinue these allocations at any time. The OIL token
              does not represent a right to revenues or any distribution.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/70 md:text-base">
              &quot;Revenue&quot; includes drilling fees net of payouts. Economics
              are transparent: 10% to Motherlode Pool, 30% to OIL Reserve, 60% to
              Payout Reserve.
            </p>
          </div>

          {/* Drilling Activity table */}
          <section>
            <h2 className="mb-6 bg-gradient-to-r from-emerald-200 to-teal-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Drilling Activity
            </h2>
            <div className="overflow-hidden rounded-3xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/50 via-teal-950/40 to-cyan-950/30 shadow-[0_8px_32px_rgba(16,185,129,0.15)] backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-emerald-800/30 bg-gradient-to-r from-emerald-900/40 to-teal-900/30">
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-emerald-300 md:px-6">
                        Tiles
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-emerald-300 md:px-6">
                        Amount (SOL)
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-emerald-300 md:px-6">
                        Amount (USD)
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-emerald-300 md:px-6">
                        Avg Cost
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-emerald-300 md:px-6">
                        % of Daily Revenue
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-emerald-300 md:px-6">
                        Revenue
                      </th>
                      <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-emerald-300 md:px-6">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyDrillingActivity.map((row, i) => (
                      <tr
                        key={row.date + i}
                        className="border-b border-emerald-900/20 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-900/20 hover:to-teal-900/10 last:border-0"
                      >
                        <td className="px-4 py-4 font-mono text-sm font-semibold text-emerald-100 md:px-6">
                          {formatLarge(row.tilesDrilled)}
                        </td>
                        <td className="px-4 py-4 font-mono text-sm font-semibold text-emerald-100 md:px-6">
                          {row.amountSol.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4 font-mono text-sm font-semibold text-emerald-100 md:px-6">
                          {row.amountUsd.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4 font-mono text-sm font-semibold text-emerald-100 md:px-6">
                          ${row.avgCostSol.toFixed(3)}
                        </td>
                        <td className="px-4 py-4 font-mono text-sm font-semibold text-emerald-100 md:px-6">
                          {row.pctOfDailyRevenue.toFixed(3)}%
                        </td>
                        <td className="px-4 py-4 font-mono text-sm font-semibold text-emerald-100 md:px-6">
                          {row.revenueSol.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          SOL
                        </td>
                        <td className="px-4 py-4 text-sm text-emerald-200/70 md:px-6">
                          {row.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Legal disclaimer */}
          <div className="mt-12 rounded-2xl border border-emerald-900/20 bg-gradient-to-br from-emerald-950/30 to-teal-950/20 p-6 backdrop-blur-lg md:mt-16 md:p-8">
            <h3 className="mb-3 text-lg font-bold text-emerald-300">
              Legal Disclaimer
            </h3>
            <p className="text-sm leading-relaxed text-emerald-100/60 md:text-base">
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
