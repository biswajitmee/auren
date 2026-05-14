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
      className="items-center gap-8 grid lg:grid-cols-[1.1fr_0.9fr] min-h-[118vh]"
      eyebrow="Product Reveal"
      id="product-reveal"
      index="02"
      ref={sectionRef}
    >
      <div className="relative bg-charcoal/5 border min-h-[42rem] overflow-hidden">
        {/* <Image
          alt="AUREN NOIR macro bottle detail"
          className="opacity-90 object-[35%_center] object-cover image-lift"
          fill
          priority={false}
          sizes="(min-width: 1024px) 58vw, 100vw"
          src={aurenAssets.images.productReveal}
        /> */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-obsidian/18 to-obsidian/82" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/72 via-transparent to-obsidian/16" />
        <div className="top-6 left-6 absolute bg-gradient-to-b from-transparent via-gold/45 to-transparent w-px h-[calc(100%-3rem)]" />
        <div className="right-6 bottom-6 left-6 absolute gap-4 grid md:grid-cols-4">
          {materialCallouts.map((callout) => (
            <div
              className="pt-3 border-gold/28 border-t"
              data-callout
              key={callout.index}
            >
              <p className="font-mono text-[0.62rem] text-gold/78 uppercase">
                {callout.index} / {callout.label}
              </p>
              <p className="mt-2 text-ivory/60 text-xs leading-5">{callout.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="z-10 relative ml-auto lg:-ml-16 p-7 sm:p-10 max-w-xl luxury-panel">
        <MicroLabel data-product-copy>02 / Eau de Parfum Intense</MicroLabel>
        <h2
          className="mt-6 font-display font-medium text-ivory text-6xl sm:text-7xl leading-[0.86]"
          data-product-copy
        >
          AUREN NOIR
        </h2>
        <p
          className="mt-5 font-mono text-gold/72 text-xs uppercase"
          data-product-copy
        >
          50ML | 100ML
        </p>
        <p
          className="mt-8 font-display text-ivory/78 text-3xl leading-tight"
          data-product-copy
        >
          &quot;A study in contrast. Shadow meets radiance.&quot;
        </p>
        <p className="mt-8 max-w-md text-ivory/58 text-sm leading-7" data-product-copy>
          Smoked crystal, amber glow, brushed gold and a black tactile label come
          together as a single architectural object.
        </p>
        <div className="flex sm:flex-row flex-col sm:items-center gap-4 mt-9">
          <GoldButton>Discover the essence</GoldButton>
          <span className="font-mono text-[0.66rem] text-ivory/40 uppercase">
            Structure / Shadow / Radiance
          </span>
        </div>
        <div className="gap-3 grid grid-cols-3 mt-10 pt-5 border-gold/18 border-t font-mono text-[0.62rem] text-ivory/44 uppercase">
          <span>Top / Saffron</span>
          <span>Heart / Rose</span>
          <span>Base / Vetiver</span>
        </div>
      </div>
    </SectionFrame>
  );
}
