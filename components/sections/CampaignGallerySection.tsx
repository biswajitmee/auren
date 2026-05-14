"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { galleryItems } from "@/lib/auren-data";
import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function CampaignGallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const setGalleryProgress = useDesireGalleryScene((state) => state.setProgress);
  const setGalleryVisible = useDesireGalleryScene((state) => state.setVisible);
  const resetGalleryScene = useDesireGalleryScene((state) => state.reset);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const visibilityTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      end: "bottom 12%",
      onEnter: () => {
        if (reducedMotion || window.innerWidth < 900) {
          setGalleryVisible(true);
        }
      },
      onEnterBack: () => {
        if (reducedMotion || window.innerWidth < 900) {
          setGalleryVisible(true);
        }
      },
      onLeave: () => {
        if (reducedMotion || window.innerWidth < 900) {
          setGalleryVisible(false);
        }
      },
      onLeaveBack: () => {
        if (reducedMotion || window.innerWidth < 900) {
          setGalleryVisible(false);
        }
      },
      onUpdate: (self) => {
        if (reducedMotion || window.innerWidth < 900) {
          setGalleryProgress(self.progress);
        }
      }
    });

    if (!reducedMotion) {
      mm.add("(min-width: 900px)", () => {
        const ctx = gsap.context(() => {
          const track = trackRef.current;

          if (!track) {
            return;
          }

          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => `+=${distance()}`,
              onEnter: () => setGalleryVisible(true),
              onEnterBack: () => setGalleryVisible(true),
              onLeave: () => setGalleryVisible(false),
              onLeaveBack: () => setGalleryVisible(false),
              onUpdate: (self) => {
                setGalleryProgress(self.progress);
                setGalleryVisible(self.isActive);
              }
            }
          });
        }, sectionRef);

        return () => ctx.revert();
      });
    }

    return () => {
      visibilityTrigger.kill();
      mm.revert();
      resetGalleryScene();
    };
  }, [reducedMotion, resetGalleryScene, setGalleryProgress, setGalleryVisible]);

  return (
    <SectionFrame
      className="min-h-screen [&>[data-section-kicker]]:opacity-0"
      eyebrow="Campaign Gallery"
      id="campaign-gallery"
      index="03"
      ref={sectionRef}
    >
      <div
        aria-hidden
        className="pointer-events-none mb-10 flex flex-col justify-between gap-6 opacity-0 md:flex-row md:items-end"
      >
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
        aria-hidden
        className="pointer-events-none flex flex-col gap-4 opacity-0 will-change-transform md:w-max md:flex-row"
        ref={trackRef}
      >
        {galleryItems.map((item) => (
          <div className="contents" key={item.index}>
            <div className="h-[73vh] min-h-[34rem] shrink-0 md:w-[27rem] lg:w-[31rem]" />
            <div
              aria-hidden
              className="hidden h-[73vh] min-h-[34rem] shrink-0 md:block md:w-[27rem] lg:w-[31rem]"
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
