"use client";

import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-reveal]", {
        y: 22,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.14
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionFrame
      className="hero-ui-stage flex min-h-screen items-end justify-center pb-0 pt-28 [&>div:first-child]:hidden"
      eyebrow="Arrival"
      id="hero"
      index="01"
      ref={sectionRef}
    >
      <h1 className="sr-only">AUREN NOIR</h1>
      <div className="hero-copy-panel">
        <span className="hero-copy-emblem" aria-hidden="true" />
        <p
          className="hero-main-line"
          data-hero-reveal
        >
          A fragrance carved in shadow,
          <br />
          crowned in gold.
        </p>
        <p className="hero-sub-line" data-hero-reveal>
          <span aria-hidden="true" />
          An extrait of amber, smoke, and quiet power.
          <span aria-hidden="true" />
        </p>
        <a
          className="hero-essence-button pointer-events-auto focus-ring"
          data-hero-reveal
          href="#fragrance-notes"
        >
          Discover the Essence
          <ArrowRight aria-hidden="true" size={18} strokeWidth={1.25} />
        </a>
      </div>
      <div className="hero-footnotes" data-hero-reveal>
        <div className="hero-footnote hero-footnote-left">
          <span aria-hidden="true" />
          <p>01 / Royal Extrait</p>
        </div>
        <div className="hero-scroll-note">
          <span className="hero-scroll-pin" aria-hidden="true">
            <span />
          </span>
          <p>Scroll to Enter</p>
        </div>
        <div className="hero-footnote hero-footnote-right">
          <p>Amber / Oud / Saffron / Vetiver</p>
          <span aria-hidden="true" />
        </div>
      </div>
      <style jsx global>{`
        @keyframes scroll-line {
          0% {
            transform: translateY(-1.5rem);
          }
          100% {
            transform: translateY(3rem);
          }
        }
      `}</style>
    </SectionFrame>
  );
}
