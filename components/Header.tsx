"use client";

import Link from "next/link";
import { WalletButton } from "./WalletButton";

const socialLinks = [
  { href: "https://twitter.com", label: "Twitter", icon: "𝕏" },
  { href: "https://github.com", label: "GitHub", icon: "◉" },
  { href: "https://discord.com", label: "Discord", icon: "◆" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl min-w-0 items-center justify-between gap-2 px-3 sm:px-4 md:px-6">
        {/* Left: Logo + Nav */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4 md:gap-8">
          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-[var(--text-primary)] transition-opacity hover:opacity-90 sm:text-xl"
          >
            <span className="text-[var(--accent)]">OIL</span>
          </Link>
          <nav className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6">
            <Link
              href="/about"
              className="whitespace-nowrap text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] sm:text-sm"
            >
              About
            </Link>
            <Link
              href="/explore"
              className="whitespace-nowrap text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] sm:text-sm"
            >
              Explore
            </Link>
            <Link
              href="/docs"
              className="whitespace-nowrap text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] sm:text-sm"
            >
              Docs
            </Link>
          </nav>
        </div>

        {/* Right: Social + Wallet */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <div className="hidden items-center gap-2 sm:flex">
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
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
