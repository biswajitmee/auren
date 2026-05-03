"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { aurenAssets } from "@/lib/auren-assets";
import { ritualStoryLines } from "@/lib/auren-data";

export function RitualStorySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-ritual-line]", {
        yPercent: 115,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 56%",
          end: "bottom 46%",
          scrub: 0.75
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionFrame
      className="flex min-h-[120vh] items-center justify-center"
      eyebrow="Ritual Story"
      id="ritual-story"
      index="05"
      ref={sectionRef}
    >
      <Image
        alt=""
        className="absolute inset-0 -z-10 object-cover opacity-30 mix-blend-screen"
        fill
        sizes="100vw"
        src={aurenAssets.images.ritualStory}
      />
      <div className="ambient-vignette absolute inset-0 -z-10" />
      <div className="mx-auto max-w-5xl text-center">
        <MicroLabel className="mb-9">05 / The Ritual</MicroLabel>
        {ritualStoryLines.map((line, index) => (
          <div className="overflow-hidden py-2" key={line}>
            <p
              className={
                index === 1
                  ? "font-display text-4xl leading-tight text-gold/86 sm:text-6xl lg:text-7xl"
                  : "font-display text-3xl leading-tight text-ivory/82 sm:text-5xl lg:text-6xl"
              }
              data-ritual-line
            >
              {line}
            </p>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
