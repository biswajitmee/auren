"use client";

import gsap from "gsap";
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
        <p
          className="hero-main-line"
          data-hero-reveal
        >
          A fragrance carved in
          <br />
          shadow crowned in gold
        </p>
        <a
          className="hero-cta-perfect"
          data-hero-reveal
          href="#fragrance-notes"
        >
          <span className="hero-cta-perfect-text">DISCOVER THE ESSENCE</span>
        </a>
        <div className="hero-scroll-note" data-hero-reveal>
          <p>Scroll to Enter</p>
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
