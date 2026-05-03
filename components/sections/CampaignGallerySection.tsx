"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { galleryItems } from "@/lib/auren-data";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function CampaignGallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    if (!reducedMotion) {
      mm.add("(min-width: 900px)", () => {
        const ctx = gsap.context(() => {
          const track = trackRef.current;

          if (!track) {
            return;
          }

          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

          gsap.from("[data-gallery-card]", {
            y: 46,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 64%"
            }
          });

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => `+=${distance()}`
            }
          });
        }, sectionRef);

        return () => ctx.revert();
      });
    }

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <SectionFrame
      className="min-h-screen"
      eyebrow="Campaign Gallery"
      id="campaign-gallery"
      index="03"
      ref={sectionRef}
    >
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <MicroLabel>03 / Campaign Archive</MicroLabel>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[0.96] text-ivory sm:text-7xl">
            Architecture of desire.
          </h2>
        </div>
        <p className="max-w-sm border-t border-gold/24 pt-4 font-mono text-[0.66rem] uppercase leading-5 text-ivory/48">
          Five cinematic chapters composed in black marble, shadow, flame, and
          gold.
        </p>
      </div>

      <div
        className="flex flex-col gap-4 will-change-transform md:w-max md:flex-row"
        ref={trackRef}
      >
        {galleryItems.map((item) => (
          <article
            className="gold-frame group relative h-[73vh] min-h-[34rem] overflow-hidden border border-gold/20 bg-charcoal/50 md:w-[27rem] lg:w-[31rem]"
            data-gallery-card
            key={item.index}
          >
            <Image
              alt={`${item.title} campaign frame`}
              className="image-lift object-cover opacity-82 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
              fill
              sizes="(min-width: 900px) 31rem, 100vw"
              src={item.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/22 to-obsidian/20" />
            <div className="absolute inset-x-6 top-6 flex justify-between font-mono text-[0.62rem] uppercase text-gold/76">
              <span>{item.index}</span>
              <span>{item.caption}</span>
            </div>
            <div className="absolute bottom-7 left-6 right-6">
              <div className="mb-4 h-px bg-gradient-to-r from-gold/70 to-transparent" />
              <h3 className="font-display text-3xl leading-tight text-ivory sm:text-4xl">
                {item.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
