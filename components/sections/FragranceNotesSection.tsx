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
          opacity: 0,
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
        <h2 className="mt-3 font-display text-gold/85 text-5xl sm:text-7xl uppercase leading-[0.95]">
          AUREN NOIR
        </h2>
        <div className="bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto mt-6 w-52 h-px" />
      </div>

      <div className="gap-6 grid lg:grid-cols-3 mt-14">
        {fragranceNotes.map((note, index) => {
          const Icon = icons[note.icon as keyof typeof icons] ?? Sprout;

          return (
            <article
              className="group isolate relative bg-obsidian/82 p-6 border border-gold/28 hover:border-gold/62 rounded-[1.6rem] min-h-[33rem] overflow-hidden hover:rotate-1 transition hover:-translate-y-2 duration-500 glass-edge"
              data-note-card
              key={note.title}
            >
              <Image
                alt={`${note.title} ingredients`}
                className="z-0 absolute inset-0 opacity-72 group-hover:opacity-90 object-cover group-hover:scale-105 transition duration-700"
                fill
                sizes="(min-width: 1024px) 30vw, 90vw"
                src={aurenAssets.images.fragranceNotes}
                style={{ objectPosition: note.imagePosition }}
              />
              <div className="z-[1] absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/24" />
              <div className="z-[2] absolute inset-4 border border-gold/18 rounded-[1.1rem]" />
              <div className="z-10 relative flex justify-between items-center">
                <span className="flex justify-center items-center bg-obsidian/45 border border-gold/42 rounded-full w-12 h-12 text-gold">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="font-mono text-[0.62rem] text-gold/62 uppercase">
                  0{index + 1}
                </span>
              </div>
              <h3 className="z-10 relative mt-6 font-mono text-gold/80 text-sm uppercase">
                {note.title}
              </h3>
              <div className="right-7 bottom-8 left-7 z-10 absolute">
                <ul className="space-y-2 pt-5 border-gold/20 border-t">
                  {note.notes.map((item) => (
                    <li
                      className="font-mono text-[0.72rem] text-ivory/78 uppercase"
                      key={item}
                    >
                      - {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-ivory/52 text-sm leading-6">{note.caption}</p>
              </div>
            </article>
          );
        })}
      </div>
      <p className="hidden lg:block top-1/2 left-6 absolute font-mono text-[0.62rem] text-gold/48 uppercase rotate-180 -translate-y-1/2 [writing-mode:vertical-rl]">
        Scroll to explore
      </p>
    </SectionFrame>
  );
}
