"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flower2, Sprout, Trees } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { aurenAssets } from "@/lib/auren-assets";
import { fragranceNotes } from "@/lib/auren-data";

const icons = {
  sprig: Sprout,
  rose: Flower2,
  root: Trees
};

export function FragranceNotesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-note-card]",
        { y: 64, opacity: 0, rotateX: 9 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionFrame
      className="min-h-screen"
      eyebrow="Fragrance Notes"
      id="fragrance-notes"
      index="04"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-4xl text-center">
        <MicroLabel>The Notes Of</MicroLabel>
        <h2 className="mt-3 font-display text-5xl uppercase leading-[0.95] text-gold/85 sm:text-7xl">
          AUREN NOIR
        </h2>
        <div className="mx-auto mt-6 h-px w-52 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {fragranceNotes.map((note, index) => {
          const Icon = icons[note.icon as keyof typeof icons] ?? Sprout;

          return (
            <article
              className="glass-edge group relative isolate min-h-[33rem] overflow-hidden rounded-[1.6rem] border border-gold/28 bg-obsidian/82 p-6 transition duration-500 hover:-translate-y-2 hover:rotate-1 hover:border-gold/62"
              data-note-card
              key={note.title}
            >
              <Image
                alt={`${note.title} ingredients`}
                className="absolute inset-0 z-0 object-cover opacity-72 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
                fill
                sizes="(min-width: 1024px) 30vw, 90vw"
                src={aurenAssets.images.fragranceNotes}
                style={{ objectPosition: note.imagePosition }}
              />
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/24" />
              <div className="absolute inset-4 z-[2] rounded-[1.1rem] border border-gold/18" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/42 bg-obsidian/45 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[0.62rem] uppercase text-gold/62">
                  0{index + 1}
                </span>
              </div>
              <h3 className="relative z-10 mt-6 font-mono text-sm uppercase text-gold/80">
                {note.title}
              </h3>
              <div className="absolute bottom-8 left-7 right-7 z-10">
                <ul className="space-y-2 border-t border-gold/20 pt-5">
                  {note.notes.map((item) => (
                    <li
                      className="font-mono text-[0.72rem] uppercase text-ivory/78"
                      key={item}
                    >
                      - {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm leading-6 text-ivory/52">{note.caption}</p>
              </div>
            </article>
          );
        })}
      </div>
      <p className="absolute left-6 top-1/2 hidden -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] font-mono text-[0.62rem] uppercase text-gold/48 lg:block">
        Scroll to explore
      </p>
    </SectionFrame>
  );
}
