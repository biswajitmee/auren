"use client";

import { Instagram, Mail, Send } from "lucide-react";
import Image from "next/image";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { aurenAssets } from "@/lib/auren-assets";

export function FooterSection() {
  return (
    <SectionFrame
      className="flex min-h-screen items-end overflow-hidden pb-8"
      eyebrow="Footer"
      id="footer"
      index="10"
    >
      <Image
        alt=""
        className="absolute inset-0 -z-10 object-cover opacity-32"
        fill
        sizes="100vw"
        src={aurenAssets.images.footer}
      />
      <div className="ambient-vignette absolute inset-0 -z-10" />
      <div className="w-full">
        <p className="pointer-events-none select-none font-display text-[17vw] leading-none text-ivory/[0.055]">
          AUREN NOIR
        </p>
        <div className="grid gap-10 border-t border-gold/18 pt-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="font-display text-5xl leading-tight text-ivory sm:text-6xl">
              Enter the circle.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-ivory/62">
              A fragrance constructed in shadow and gold.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <label className="font-mono text-xs uppercase text-gold/70" htmlFor="email">
              Enter your email
            </label>
            <div className="mt-4 flex max-w-lg border border-gold/22 bg-obsidian/55">
              <input
                className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-ivory outline-none placeholder:text-ivory/30"
                id="email"
                placeholder="name@example.com"
                type="email"
              />
              <button
                aria-label="Submit email"
                className="focus-ring flex items-center justify-center border-l border-gold/20 px-5 text-gold transition hover:bg-gold hover:text-obsidian"
                type="button"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-6 border-t border-gold/12 pt-6 font-mono text-[0.68rem] uppercase text-ivory/42 sm:flex-row">
          <div className="flex gap-5">
            <a className="transition hover:text-gold" href="#campaign-gallery">
              Gallery
            </a>
            <a className="transition hover:text-gold" href="#fragrance-notes">
              Fragrance
            </a>
            <a className="transition hover:text-gold" href="#film">
              Film
            </a>
            <a className="transition hover:text-gold" href="#editions">
              Editions
            </a>
          </div>
          <div className="flex gap-4">
            <Instagram className="h-4 w-4" />
            <Mail className="h-4 w-4" />
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
