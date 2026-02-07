# OLIO - OIL Drilling Game

## What This Is

A Solana-native, oil-mining themed grid game where users "drill" tiles to win or lose funds. The homepage IS the game. Each tile flip is a micro-bet with four outcome tiers (Dry Hole, Oil Field, Refinery, Motherlode). Built to reinforce OIL's narrative as "liquid gold / a store of value" through transparent economics that route gameplay volume into jackpots and protocol reserves.

## Core Value

**The drilling experience must feel satisfying and premium** — polished animations, responsive controls, and clear feedback on every tile flip. If the game doesn't feel good to play, nothing else matters.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can view and interact with drilling grid (3x3, 4x4, 5x5)
- [ ] User can configure drill settings (cost, volatility, chance mode)
- [ ] User sees tile outcomes with polished animations
- [ ] User can view transparency dashboard (Explore page)
- [ ] User can read about economics (Docs/About page)
- [ ] User can chat in real-time with other players
- [ ] App has dark premium aesthetic with smooth transitions

### Out of Scope

- Actual Solana wallet integration — MVP uses mocked balances
- Real money deposits/withdrawals — deferred to v2
- OIL token contract — separate effort
- Backend game logic/randomness — frontend mocks outcomes for now
- Mobile native app — web responsive only

## Context

**Ecosystem**: Solana, OIL token narrative (liquid gold, store of value)

**Reference**: ORE Supply for transparency emphasis (different visual direction)

**Economics** (for display):
- 10% → Motherlode Pool (jackpot)
- 30% → OIL Reserve (buybacks)
- 60% → Payout Reserve

**Outcome probabilities** (for mocking):
- Dry Hole: 69.84% (lose tile cost)
- Oil Field: 24% (1.5× return)
- Refinery: 6% (4× return)
- Motherlode: 0.16% (jackpot)

## Constraints

- **Tech Stack**: Next.js App Router + TypeScript + Tailwind CSS
- **Visual**: Dark + premium aesthetic, polished animations throughout
- **Chat**: Real-time implementation (Socket.io or similar)
- **MVP Focus**: UI/UX first, mocked game logic

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Modern React, good DX, easy deployment | — Pending |
| UI-first MVP | Validate look/feel before Solana integration | — Pending |
| Real chat (not mocked) | Social element is core to engagement | — Pending |
| Off-chain game logic (later) | Simplifies architecture, Solana for funds only | — Pending |

---
*Last updated: 2025-02-06 after initialization*
