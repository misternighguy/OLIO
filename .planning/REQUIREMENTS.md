# Requirements: OLIO

**Defined:** 2025-02-06
**Core Value:** The drilling experience must feel satisfying and premium

## v1 Requirements

Requirements for initial release (UI/UX MVP with mocked logic).

### Layout & Navigation

- [ ] **LAYOUT-01**: Header displays OIL logo, nav links (About, Explore, Docs), and social buttons (Twitter, GitHub, Discord)
- [ ] **LAYOUT-02**: Header displays wallet connect button (mocked state for MVP)
- [ ] **LAYOUT-03**: Home page uses 3-column layout (controls | grid | chat+stats)
- [ ] **LAYOUT-04**: App is responsive across desktop and tablet sizes

### Game Grid

- [ ] **GRID-01**: User can view drilling grid with selectable sizes (3x3, 4x4, 5x5)
- [ ] **GRID-02**: Each tile displays its drill cost before being flipped
- [ ] **GRID-03**: User can click individual tiles to drill them one-by-one
- [ ] **GRID-04**: User can click "Mine All Tiles" to flip all remaining tiles
- [ ] **GRID-05**: Tiles show polished flip animation when drilled
- [ ] **GRID-06**: Each outcome tier has distinct visual feedback (Dry Hole, Oil Field, Refinery, Motherlode)
- [ ] **GRID-07**: Motherlode triggers dramatic full-screen animation

### Controls Panel

- [ ] **CTRL-01**: User can select currency (SOL, USDC, USD1) — display only for MVP
- [ ] **CTRL-02**: User can set average drill cost via slider (0.01–1000)
- [ ] **CTRL-03**: User can set average drill cost via numeric input
- [ ] **CTRL-04**: User can adjust drill cost with +/- buttons (step by 1 unit)
- [ ] **CTRL-05**: User can set volatility/risk level via slider
- [ ] **CTRL-06**: User can toggle between Equivalent Chance and Varied Chance modes
- [ ] **CTRL-07**: User can select grid size (3x3, 4x4, 5x5)
- [ ] **CTRL-08**: User can view mocked balance and deposit/withdraw UI

### Stats & Transparency

- [ ] **STAT-01**: Right panel shows current Motherlode pool size
- [ ] **STAT-02**: Right panel shows current reserves (OIL Reserve, Payout Reserve)
- [ ] **STAT-03**: Right panel shows session stats (tiles flipped, net P/L)
- [ ] **STAT-04**: "How it Works" button opens step-by-step modal with Next/Back navigation

### Chat

- [ ] **CHAT-01**: Right panel includes real-time global chat
- [ ] **CHAT-02**: User can send messages to chat
- [ ] **CHAT-03**: User can see messages from other users in real-time

### Explore Page

- [ ] **EXPL-01**: Explore page shows live counters (Motherlode, reserves, volume)
- [ ] **EXPL-02**: Explore page shows recent rounds feed with outcomes
- [ ] **EXPL-03**: Explore page shows leaderboards (top miners, top winners)

### Docs/About Page

- [ ] **DOCS-01**: About page explains OIL as "liquid gold" narrative
- [ ] **DOCS-02**: About page explains game mechanics (grid, costs, volatility)
- [ ] **DOCS-03**: About page explains economics (10/30/60 split)
- [ ] **DOCS-04**: About page explains Motherlode jackpot mechanics

### Visual & Animation

- [ ] **VIS-01**: App uses dark premium aesthetic (sleek, subtle gradients)
- [ ] **VIS-02**: All interactive elements have smooth transitions
- [ ] **VIS-03**: Tile outcomes have satisfying visual feedback
- [ ] **VIS-04**: Loading states and micro-interactions are polished

## v2 Requirements

Deferred to future release (Solana integration).

### Wallet Integration

- **WALLET-01**: User can connect Solana wallet (Phantom, Solflare, etc.)
- **WALLET-02**: User can deposit SOL/USDC/USD1 to in-app balance
- **WALLET-03**: User can withdraw funds to wallet
- **WALLET-04**: Transactions are signed and confirmed on-chain

### Backend & Logic

- **BACK-01**: Game outcomes are determined by verifiable randomness
- **BACK-02**: Fund splits (10/30/60) are enforced programmatically
- **BACK-03**: Motherlode payouts draw from actual pool

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile native app | Web responsive is sufficient for MVP |
| OIL token contract | Separate workstream |
| Real Solana transactions | UI/UX validation first |
| Admin dashboard | Not needed for MVP |
| User accounts/profiles | Wallet-based identity comes with v2 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAYOUT-01 | Phase 1 | Pending |
| LAYOUT-02 | Phase 1 | Pending |
| LAYOUT-03 | Phase 2 | Pending |
| LAYOUT-04 | Phase 6 | Pending |
| GRID-01 | Phase 2 | Pending |
| GRID-02 | Phase 2 | Pending |
| GRID-03 | Phase 2 | Pending |
| GRID-04 | Phase 2 | Pending |
| GRID-05 | Phase 3 | Pending |
| GRID-06 | Phase 3 | Pending |
| GRID-07 | Phase 3 | Pending |
| CTRL-01 | Phase 2 | Pending |
| CTRL-02 | Phase 2 | Pending |
| CTRL-03 | Phase 2 | Pending |
| CTRL-04 | Phase 2 | Pending |
| CTRL-05 | Phase 2 | Pending |
| CTRL-06 | Phase 2 | Pending |
| CTRL-07 | Phase 2 | Pending |
| CTRL-08 | Phase 2 | Pending |
| STAT-01 | Phase 4 | Pending |
| STAT-02 | Phase 4 | Pending |
| STAT-03 | Phase 4 | Pending |
| STAT-04 | Phase 4 | Pending |
| CHAT-01 | Phase 4 | Pending |
| CHAT-02 | Phase 4 | Pending |
| CHAT-03 | Phase 4 | Pending |
| EXPL-01 | Phase 5 | Pending |
| EXPL-02 | Phase 5 | Pending |
| EXPL-03 | Phase 5 | Pending |
| DOCS-01 | Phase 5 | Pending |
| DOCS-02 | Phase 5 | Pending |
| DOCS-03 | Phase 5 | Pending |
| DOCS-04 | Phase 5 | Pending |
| VIS-01 | Phase 1 | Pending |
| VIS-02 | Phase 3 | Pending |
| VIS-03 | Phase 3 | Pending |
| VIS-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 35 total
- Mapped to phases: 35
- Unmapped: 0 ✓

---
*Requirements defined: 2025-02-06*
*Last updated: 2025-02-06 after initial definition*
