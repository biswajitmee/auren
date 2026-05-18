"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import { navLinks } from "@/lib/auren-data";
import { cn } from "@/lib/cn";
import { useScrollProgress } from "@/lib/useScrollProgress";

export function Header() {
  const progress = useScrollProgress((state) => state.progress);
  const settled = progress > 0.08;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileOverlayRef = useRef<HTMLDivElement>(null);
  const mobileTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const mobileWaveFallbackRef = useRef<number | null>(null);

  useEffect(() => {
    const overlay = mobileOverlayRef.current;
    if (!overlay) return;

    const chars = overlay.querySelectorAll<HTMLElement>(".mobile-nav-char");
    mobileTimelineRef.current?.kill();
    if (mobileWaveFallbackRef.current !== null) {
      window.clearTimeout(mobileWaveFallbackRef.current);
      mobileWaveFallbackRef.current = null;
    }

    if (mobileMenuOpen) {
      gsap.set(chars, { clearProps: "animation,opacity,visibility,transform" });
      gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto", yPercent: 0 });
      mobileWaveFallbackRef.current = window.setTimeout(() => {
        gsap.set(chars, {
          animation: "none",
          autoAlpha: 1,
          rotateX: 0,
          yPercent: 0
        });
        mobileWaveFallbackRef.current = null;
      }, 900);
      return;
    }

    gsap.set(overlay, { pointerEvents: "none" });
    mobileTimelineRef.current = gsap.timeline();
    mobileTimelineRef.current
      .to(chars, {
        autoAlpha: 0,
        yPercent: -70,
        duration: 0.18,
        ease: "power2.in",
        stagger: { each: 0.004, from: "end" }
      })
      .to(
        overlay,
        {
          yPercent: -104,
          duration: 0.24,
          ease: "power3.in",
          autoAlpha: 0
        },
        "-=0.04"
      );
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const renderSplitLabel = (label: string, linkIndex: number) => (
    <span className="mobile-nav-split" aria-hidden="true">
      {label.split("").map((char, index) => (
        <span
          className="mobile-nav-char"
          key={`${label}-${char}-${index}`}
          style={{ animationDelay: `${linkIndex * 0.055 + index * 0.012}s` }}
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </span>
  );

  return (
    <>
      <header
        className={cn(
          "hero-header pointer-events-none fixed left-0 top-0 z-50 w-full px-5 pt-5 text-gold sm:px-8 lg:px-12",
          settled && "bg-obsidian/18 pb-3 md:backdrop-blur-sm"
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
      <button
        aria-controls="mobile-navigation"
        aria-expanded={mobileMenuOpen}
        aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
        className={cn("mobile-nav-toggle md:hidden", mobileMenuOpen && "is-open")}
        onClick={() => setMobileMenuOpen((open) => !open)}
        type="button"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <div
        aria-hidden={!mobileMenuOpen}
        className={cn("mobile-nav-overlay md:hidden", mobileMenuOpen && "is-open")}
        id="mobile-navigation"
        ref={mobileOverlayRef}
      >
        <nav className="mobile-nav-menu" aria-label="Mobile navigation">
          {navLinks.map((link, index) => (
            <a
              className="mobile-nav-link focus-ring"
              href={link.href}
              key={link.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">{link.label}</span>
              <span className="mobile-nav-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {renderSplitLabel(link.label, index)}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
