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
      className="flex min-h-screen items-end justify-center pb-0 pt-28 [&>div:first-child]:hidden"
      eyebrow="Arrival"
      id="hero"
      index="01"
      ref={sectionRef}
    >
      <h1 className="sr-only">AUREN NOIR</h1>
      <div className="absolute bottom-[4.5vh] left-1/2 mx-auto flex w-full max-w-4xl -translate-x-1/2 flex-col items-center px-6 text-center md:bottom-[4vh]">
        <p
          className="max-w-3xl font-display text-3xl leading-tight text-ivory/88 sm:text-4xl lg:text-5xl"
          data-hero-reveal
        >
          Structure is the new seduction.
        </p>
        <span className="mt-6 h-16 w-px overflow-hidden bg-ivory/16" data-hero-reveal>
          <span className="block h-5 w-px animate-[scroll-line_1.8s_ease-in-out_infinite] bg-gold/90" />
        </span>
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
