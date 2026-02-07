# Plan 05-01 Summary: Explore Dashboard

**Status:** Complete

## Delivered

1. **lib/explore-data.ts** — Mocked counters, recent rounds, leaderboards
   - exploreCounters: motherlodePool, oilReserve, payoutReserve, lifetimeVolume, lifetimeOILBought, protocolRevenue
   - recentRounds: 20 entries with timestamp, cost, outcome, payout, winner
   - topMiners, topWinners, mostMotherlodes
   - formatLarge, formatRelativeTime, outcomeIcon helpers

2. **ExploreDashboard.tsx** — Full dashboard
   - Live Counters: 6 stat cards (grid, accent on Motherlode)
   - Recent Rounds: scrollable feed with outcome icons, cost→payout, winner, relative time
   - Leaderboards: Top Miners, Top Winners, Most Motherlodes

3. **app/explore/page.tsx** — Wired to ExploreDashboard
