"use client";

import Link from "next/link";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 rounded-3xl border border-amber-900/30 bg-gradient-to-br from-amber-950/40 via-stone-950/60 to-neutral-950/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(212,168,83,0.15)] transition-all duration-500 hover:border-amber-800/40 hover:shadow-[0_12px_48px_rgba(212,168,83,0.25)] md:p-8">
      <h2 className="mb-4 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed text-amber-100/90 md:text-lg">
        {children}
      </div>
    </section>
  );
}

export function AboutContent() {
  return (
    <div className="relative min-h-screen">
      {/* Custom background gradient for About page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-amber-950/20 via-stone-950/40 to-neutral-950/60"
      />
      
      <main className="relative z-10 min-h-[calc(100vh-3.5rem)] px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Hero section with custom styling */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-block rounded-full border-2 border-amber-500/30 bg-gradient-to-br from-amber-600/20 to-yellow-600/10 p-4 shadow-[0_0_60px_rgba(212,168,83,0.3)]">
              <span className="text-6xl">🛢️</span>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl lg:text-7xl">
              About OIL Drilling
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-amber-100/80 md:text-2xl">
              A grid-based oil mining game that reinforces OIL as liquid gold—a store
              of value backed by transparent, deflationary economics.
            </p>
          </div>

          <Section title="OIL as Liquid Gold">
            <p>
              OIL positions itself as a store of value—digital liquid gold. The
              token is designed to accrue value over time through protocol
              buybacks, reserve accumulation, and deflationary mechanics. OIL
              Drilling turns that narrative into play: every drill contributes to
              reserves and a shared Motherlode jackpot.
            </p>
          </Section>

          <Section title="Why a Mining Game">
            <p>
              The mining game is a fun, low-friction way to onboard users into the
              OIL ecosystem. Gameplay reinforces the deflation and backing thesis:
              you see your actions flow into Motherlode pools, OIL reserves, and
              payout reserves in real time. It's education through interaction.
            </p>
          </Section>

          <Section title="How Drilling Works">
            <p>
              The game uses a grid of hidden tiles (3×3, 4×4, or 5×5). Each tile
              shows its drill cost before you flip it. You set an average drill
              cost and a volatility slider—volatility controls how much tile costs
              spread around that average (low = similar costs, high = wider range).
            </p>
            <p className="mt-4">
              Two chance modes: <strong className="font-bold text-amber-300">Equivalent Chance</strong> (same odds per
              tile) and <strong className="font-bold text-amber-300">Varied Chance</strong> (odds vary by tile cost in a
              transparent way). Click tiles one-by-one or use Mine All to flip
              every remaining tile at once.
            </p>
          </Section>

          <Section title="Economics: 10/30/60">
            <p className="mb-4">
              Every tile bet allocates funds automatically:
            </p>
            <div className="space-y-3 rounded-2xl border border-amber-800/20 bg-gradient-to-br from-amber-900/20 to-yellow-900/10 p-6">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-300">10</span>
                <div>
                  <strong className="text-lg font-bold text-amber-300">10%</strong>
                  <span className="ml-2 text-amber-100/70">→ Motherlode Pool (jackpot vault)</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-300">30</span>
                <div>
                  <strong className="text-lg font-bold text-amber-300">30%</strong>
                  <span className="ml-2 text-amber-100/70">→ OIL Reserve (protocol buybacks and accumulation)</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-300">60</span>
                <div>
                  <strong className="text-lg font-bold text-amber-300">60%</strong>
                  <span className="ml-2 text-amber-100/70">→ Payout Reserve (funds Oil Field and Refinery wins)</span>
                </div>
              </div>
            </div>
            <p className="mt-4">
              This split keeps the system sustainable while directing volume into
              backing and jackpots.
            </p>
          </Section>

          <Section title="Motherlode Jackpot">
            <p>
              The Motherlode is a rare outcome (about 0.16% chance—roughly 1 in
              625 tiles). When you hit it, you win a payout drawn from the
              Motherlode pool. The pool grows from 10% of every bet, so the more
              everyone drills, the bigger the jackpot. A dramatic full-screen
              moment celebrates the hit.
            </p>
          </Section>

          <Section title="Transparency">
            <p>
              The Explore dashboard shows live counters: Motherlode pool size, OIL
              Reserve, Payout Reserve, lifetime volume, OIL bought, and protocol
              revenue. You can browse recent rounds (cost, outcome, payout,
              winner) and leaderboards (top miners, top winners, most Motherlodes).
              Full transparency, no black boxes.
            </p>
          </Section>

          <Section title="Security & Fairness">
            <p>
              In this MVP, game logic runs client-side with mocked outcomes.
              Future versions will use verifiable randomness and on-chain
              enforcement of the 10/30/60 split. Outcomes are designed so that
              standard payouts (Oil Field, Refinery) are sustainable from the 60%
              Payout Reserve, and the Motherlode pool is funded by its 10% share.
            </p>
          </Section>

          {/* CTA Button */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/"
              className="group relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-10 py-5 text-xl font-bold text-black shadow-[0_0_40px_rgba(212,168,83,0.4)] transition-all duration-500 hover:scale-105 hover:border-amber-400 hover:shadow-[0_0_60px_rgba(212,168,83,0.6)] active:scale-95"
            >
              <span className="relative z-10">Start Drilling Now</span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
