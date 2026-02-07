"use client";

import Link from "next/link";

const socialLinks = [
  { href: "https://twitter.com", label: "Twitter", icon: "𝕏" },
  { href: "https://github.com", label: "GitHub", icon: "◉" },
  { href: "https://discord.com", label: "Discord", icon: "◆" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--text-primary)] transition-opacity hover:opacity-90"
          >
            <span className="text-[var(--accent)]">OIL</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              About
            </Link>
            <Link
              href="/explore"
              className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              Explore
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              Docs
            </Link>
          </nav>
        </div>

        {/* Right: Social + Wallet */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {}}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black transition-all hover:bg-[var(--accent-muted)] active:scale-[0.98]"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
}
