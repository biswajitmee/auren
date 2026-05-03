"use client";

import { navLinks } from "@/lib/auren-data";
import { cn } from "@/lib/cn";
import { useScrollProgress } from "@/lib/useScrollProgress";

export function Header() {
  const progress = useScrollProgress((state) => state.progress);
  const onHero = progress < 0.055;

  return (
    <header className="pointer-events-none fixed left-0 top-0 z-50 flex w-full items-center justify-between px-5 py-5 text-ivory sm:px-8 lg:px-10">
      <a
        className="pointer-events-auto font-display text-lg uppercase text-gold/90 sm:text-xl"
        href="#hero"
        aria-label="AUREN NOIR home"
      >
        AUREN NOIR
      </a>
      <nav
        className={cn(
          "pointer-events-auto hidden items-center gap-6 rounded-full border border-gold/20 bg-obsidian/32 px-5 py-3 text-[0.64rem] uppercase text-ivory/64 shadow-[0_0_40px_rgba(0,0,0,.28)] backdrop-blur-md transition duration-500 md:flex",
          onHero && "pointer-events-none opacity-0"
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
