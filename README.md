# OLIO — OIL Drilling

A Solana-native, oil-mining themed grid game. Drill tiles, hit Oil Fields or Motherlodes, and explore transparent economics (10/30/60 split).

## Features

- **Drilling grid** — 3×3, 4×4, or 5×5 tiles; drill one-by-one or Mine All
- **Outcomes** — Dry Hole, Oil Field, Refinery, Motherlode
- **Controls** — Currency (SOL/USDC/USD1), average cost, volatility, chance mode
- **Live stats** — Motherlode pool, reserves, session P/L
- **Real-time chat** — Global room (requires socket server)
- **Explore** — Transparency dashboard, leaderboards, recent rounds
- **About** — OIL narrative, mechanics, economics

## Getting Started

### Game only

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The game works without the chat server.

### Full features (including chat)

```bash
npm install
npm run dev:all
```

Runs Next.js (:3000) and the Socket.io chat server (:3001). Or run in two terminals:

```bash
npm run dev     # Next.js
npm run socket  # Chat server
```

### Environment (optional)

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SOCKET_URL=https://your-chat-server.com
```

Defaults to `http://localhost:3001` when unset.

## Build & Deploy

```bash
npm run build
npm run start
```

**Vercel:** The Next.js app deploys directly. Chat requires a separate Socket.io server (e.g. Railway, Render). Point `NEXT_PUBLIC_SOCKET_URL` to it.

## Tech

- Next.js 16 (App Router), React 19, TypeScript, Tailwind 4
- Socket.io (chat)
- Mocked game logic for MVP
