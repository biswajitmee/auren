"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { GoldButton } from "@/components/ui/GoldButton";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { aurenAssets } from "@/lib/auren-assets";
import { materialCallouts } from "@/lib/auren-data";

export function ProductRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-product-copy]", {
        y: 34,
        opacity: 0,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 66%"
        }
      });

      gsap.from("[data-callout]", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 54%"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionFrame
      className="grid min-h-[118vh] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      eyebrow="Product Reveal"
      id="product-reveal"
      index="02"
      ref={sectionRef}
    >
      <div className="relative min-h-[42rem] overflow-hidden border border-gold/18 bg-charcoal/30">
        <Image
          alt="AUREN NOIR macro bottle detail"
          className="image-lift object-cover object-[35%_center] opacity-90"
          fill
          priority={false}
          sizes="(min-width: 1024px) 58vw, 100vw"
          src={aurenAssets.images.productReveal}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-obsidian/18 to-obsidian/82" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/72 via-transparent to-obsidian/16" />
        <div className="absolute left-6 top-6 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 grid gap-4 md:grid-cols-4">
          {materialCallouts.map((callout) => (
            <div
              className="border-t border-gold/28 pt-3"
              data-callout
              key={callout.index}
            >
              <p className="font-mono text-[0.62rem] uppercase text-gold/78">
                {callout.index} / {callout.label}
              </p>
              <p className="mt-2 text-xs leading-5 text-ivory/60">{callout.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="luxury-panel relative z-10 ml-auto max-w-xl p-7 sm:p-10 lg:-ml-16">
        <MicroLabel data-product-copy>02 / Eau de Parfum Intense</MicroLabel>
        <h2
          className="mt-6 font-display text-6xl font-medium leading-[0.86] text-ivory sm:text-7xl"
          data-product-copy
        >
          AUREN NOIR
        </h2>
        <p
          className="mt-5 font-mono text-xs uppercase text-gold/72"
          data-product-copy
        >
          50ML | 100ML
        </p>
        <p
          className="mt-8 font-display text-3xl leading-tight text-ivory/78"
          data-product-copy
        >
          &quot;A study in contrast. Shadow meets radiance.&quot;
        </p>
        <p className="mt-8 max-w-md text-sm leading-7 text-ivory/58" data-product-copy>
          Smoked crystal, amber glow, brushed gold and a black tactile label come
          together as a single architectural object.
        </p>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <GoldButton>Discover the essence</GoldButton>
          <span className="font-mono text-[0.66rem] uppercase text-ivory/40">
            Structure / Shadow / Radiance
          </span>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-3 border-t border-gold/18 pt-5 font-mono text-[0.62rem] uppercase text-ivory/44">
          <span>Top / Saffron</span>
          <span>Heart / Rose</span>
          <span>Base / Vetiver</span>
        </div>
      </div>
    </SectionFrame>
  );
}
