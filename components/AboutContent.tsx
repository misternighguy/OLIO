"use client";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
      <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function AboutContent() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] py-12 px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          About OIL Drilling
        </h1>
        <p className="mt-4 text-lg text-[var(--text-muted)]">
          A grid-based oil mining game that reinforces OIL as liquid gold—a store
          of value backed by transparent, deflationary economics.
        </p>

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
            payout reserves in real time. It’s education through interaction.
          </p>
        </Section>

        <Section title="How Drilling Works">
          <p>
            The game uses a grid of hidden tiles (3×3, 4×4, or 5×5). Each tile
            shows its drill cost before you flip it. You set an average drill
            cost and a volatility slider—volatility controls how much tile costs
            spread around that average (low = similar costs, high = wider range).
          </p>
          <p>
            Two chance modes: <strong>Equivalent Chance</strong> (same odds per
            tile) and <strong>Varied Chance</strong> (odds vary by tile cost in a
            transparent way). Click tiles one-by-one or use Mine All to flip
            every remaining tile at once.
          </p>
        </Section>

        <Section title="Economics: 10/30/60">
          <p>
            Every tile bet allocates funds automatically:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-2">
            <li>
              <strong className="text-[var(--text-primary)]">10%</strong> →
              Motherlode Pool (jackpot vault)
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">30%</strong> → OIL
              Reserve (protocol buybacks and accumulation)
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">60%</strong> → Payout
              Reserve (funds Oil Field and Refinery wins)
            </li>
          </ul>
          <p>
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
      </div>
    </main>
  );
}
