"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { aurenAssets } from "@/lib/auren-assets";
import { ritualSteps } from "@/lib/auren-data";

export function RitualGuideSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-guide-item]", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 58%"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionFrame
      className="grid min-h-screen items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]"
      eyebrow="Ritual Guide"
      id="ritual-guide"
      index="09"
      ref={sectionRef}
    >
      <div>
        <MicroLabel data-guide-item>09 / Ritual Guide</MicroLabel>
        <blockquote
          className="mt-7 max-w-xl font-display text-5xl leading-[0.98] text-ivory sm:text-7xl"
          data-guide-item
        >
          Apply to pulse points.
          <br />
          Wait. Become.
        </blockquote>
        <p className="mt-7 max-w-md text-sm leading-7 text-ivory/54" data-guide-item>
          AUREN NOIR is designed to unfold slowly. Heat, skin, and time reveal the
          architecture.
        </p>
      </div>

      <div className="luxury-panel relative overflow-hidden p-7 sm:p-10">
        <Image
          alt=""
          className="absolute inset-0 -z-10 object-cover opacity-22"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={aurenAssets.images.ritualGuide}
        />
        <div className="absolute left-20 right-20 top-[5.2rem] hidden h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent md:block" />
        <div className="grid gap-8 md:grid-cols-3">
          {ritualSteps.map((step, index) => (
            <article className="relative" data-guide-item key={step}>
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border border-gold/45 bg-obsidian shadow-gold-soft">
                <Image
                  alt=""
                  className="object-cover opacity-82"
                  fill
                  sizes="7rem"
                  src={aurenAssets.images.ritualGuide}
                />
                <div className="absolute inset-0 bg-obsidian/22" />
              </div>
              <p className="mt-5 text-center font-mono text-xs uppercase text-gold/76">
                0{index + 1}
              </p>
              <p className="mx-auto mt-3 max-w-[13rem] text-center font-display text-2xl leading-snug text-ivory/78">
                {step}
              </p>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
