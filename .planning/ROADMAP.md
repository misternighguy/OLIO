# Roadmap: OLIO

## Overview

Build a polished UI/UX for the OIL Drilling game, starting with project foundation and layout, then the core game grid and controls, followed by animations and visual polish, live features (chat + stats), secondary pages (Explore + Docs), and finally responsive refinements.

## Phases

- [ ] **Phase 1: Foundation** - Project setup, global layout, header, dark theme
- [ ] **Phase 2: Game Core** - Drilling grid, controls panel, tile interactions
- [ ] **Phase 3: Visual Polish** - Animations, outcome effects, Motherlode drama
- [ ] **Phase 4: Live Features** - Real-time chat, stats panel, How It Works modal
- [ ] **Phase 5: Secondary Pages** - Explore dashboard, Docs/About page
- [ ] **Phase 6: Refinement** - Responsive design, edge cases, final polish

## Phase Details

### Phase 1: Foundation
**Goal**: Project scaffolding with dark premium aesthetic and global navigation
**Depends on**: Nothing (first phase)
**Requirements**: LAYOUT-01, LAYOUT-02, VIS-01
**Success Criteria** (what must be TRUE):
  1. Next.js app runs locally with Tailwind configured
  2. Header displays logo, nav links, social buttons, and wallet connect stub
  3. Dark premium theme is applied globally
  4. Page transitions are smooth
**Plans**: 2 plans

Plans:
- [x] 01-01: Project scaffolding — Next.js + Tailwind + dark theme
- [x] 01-02: Header component — Logo, nav, social, wallet stub, transitions

### Phase 2: Game Core
**Goal**: Functional drilling grid with all controls (mocked outcomes)
**Depends on**: Phase 1
**Requirements**: LAYOUT-03, GRID-01, GRID-02, GRID-03, GRID-04, CTRL-01, CTRL-02, CTRL-03, CTRL-04, CTRL-05, CTRL-06, CTRL-07, CTRL-08
**Success Criteria** (what must be TRUE):
  1. User can see 3-column layout on home page
  2. User can select grid size and see correct number of tiles
  3. User can adjust all drill settings (cost, volatility, chance mode)
  4. User can click tiles to flip them (basic flip, mocked outcome)
  5. User can click "Mine All Tiles" to flip all remaining
  6. Each tile shows its cost before flip
**Plans**: 2 plans

Plans:
- [x] 02-01: Layout + controls panel — 3-column layout, all drill settings, balance, Mine All
- [x] 02-02: Grid + tiles — DrillingGrid, DrillTile, mock outcomes, Mine All wiring

### Phase 3: Visual Polish
**Goal**: Polished animations and distinct outcome visuals
**Depends on**: Phase 2
**Requirements**: GRID-05, GRID-06, GRID-07, VIS-02, VIS-03, VIS-04
**Success Criteria** (what must be TRUE):
  1. Tile flip animation is smooth and satisfying
  2. Each outcome tier (Dry Hole, Oil Field, Refinery, Motherlode) has distinct visuals
  3. Motherlode triggers dramatic full-screen moment
  4. All interactive elements have hover/active states
  5. Loading states are polished
**Plans**: 2 plans

Plans:
- [ ] 03-01: Flip animation + outcome visuals + interaction polish
- [ ] 03-02: Motherlode overlay + loading state polish

### Phase 4: Live Features
**Goal**: Real-time chat and stats panel with How It Works modal
**Depends on**: Phase 3
**Requirements**: STAT-01, STAT-02, STAT-03, STAT-04, CHAT-01, CHAT-02, CHAT-03
**Success Criteria** (what must be TRUE):
  1. Right panel shows live stats (Motherlode size, reserves, session P/L)
  2. User can send and receive chat messages in real-time
  3. "How it Works" button opens step-by-step modal
  4. Modal has Next/Back navigation through all steps
**Plans**: TBD

### Phase 5: Secondary Pages
**Goal**: Explore dashboard and Docs/About narrative page
**Depends on**: Phase 4
**Requirements**: EXPL-01, EXPL-02, EXPL-03, DOCS-01, DOCS-02, DOCS-03, DOCS-04
**Success Criteria** (what must be TRUE):
  1. Explore page shows live counters with mocked data
  2. Explore page shows recent rounds feed
  3. Explore page shows leaderboards
  4. About page explains OIL narrative clearly
  5. About page explains game mechanics and economics
**Plans**: TBD

### Phase 6: Refinement
**Goal**: Responsive design and final polish across all features
**Depends on**: Phase 5
**Requirements**: LAYOUT-04
**Success Criteria** (what must be TRUE):
  1. App works well on tablet-sized screens
  2. Controls collapse appropriately on smaller screens
  3. All edge cases handled (empty states, loading, errors)
  4. Performance is smooth throughout
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | 2025-02-06 |
| 2. Game Core | 2/2 | Complete | 2025-02-07 |
| 3. Visual Polish | 0/2 | Not started | - |
| 4. Live Features | 0/? | Not started | - |
| 5. Secondary Pages | 0/? | Not started | - |
| 6. Refinement | 0/? | Not started | - |
