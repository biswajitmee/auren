"use client";

import { navLinks } from "@/lib/auren-data";
import { cn } from "@/lib/cn";
import { useScrollProgress } from "@/lib/useScrollProgress";

export function Header() {
  const progress = useScrollProgress((state) => state.progress);
  const settled = progress > 0.08;

  return (
    <header
      className={cn(
        "hero-header pointer-events-none fixed left-0 top-0 z-50 w-full px-5 pt-5 text-gold sm:px-8 lg:px-12",
        settled && "bg-obsidian/18 pb-3 backdrop-blur-sm"
      )}
    >
      <a
        className="hero-brand pointer-events-auto focus-ring"
        href="#hero"
        aria-label="AUREN NOIR home"
      >
        <span className="hero-brand-mark" aria-hidden="true">
          <svg viewBox="0 0 54 64">
            <path d="M16 4 21 11 27 3 33 11 38 4" />
            <path d="M16 14h22" />
            <path d="M12 23 27 16l15 7v25L27 59 12 48Z" />
            <path d="M20 45 27 27l7 18" />
            <path d="M22.5 39h9" />
          </svg>
        </span>
        <span className="hero-brand-name">AUREN NOIR</span>
        <span className="hero-brand-line" aria-hidden="true" />
      </a>
      <nav
        className={cn(
          "hero-nav pointer-events-auto hidden items-center uppercase text-gold/82 transition-colors duration-500 md:flex",
          settled && "text-gold/70"
        )}
      >
        {navLinks.map((link) => (
          <a
            className="transition hover:text-gold focus-ring"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
