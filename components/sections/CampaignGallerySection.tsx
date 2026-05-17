"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { galleryItems } from "@/lib/auren-data";
import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const DESKTOP_QUERY = "(min-width: 900px)";
const MOBILE_QUERY = "(max-width: 899px)";
const DESKTOP_SCROLL_VH = Math.max(360, galleryItems.length * 86);
const GALLERY_REVEAL_DELAY_MS = 0;
const GALLERY_VISIBILITY_START = "top 96%";

export function CampaignGallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealDelayRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const setGalleryProgress = useDesireGalleryScene((state) => state.setProgress);
  const setGallerySceneReduced = useDesireGalleryScene((state) => state.setSceneReduced);
  const setGalleryVisible = useDesireGalleryScene((state) => state.setVisible);
  const resetGalleryScene = useDesireGalleryScene((state) => state.reset);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const clearGalleryRevealDelay = () => {
      if (revealDelayRef.current !== null) {
        window.clearTimeout(revealDelayRef.current);
        revealDelayRef.current = null;
      }
    };

    const showGallery = () => {
      clearGalleryRevealDelay();
      if (GALLERY_REVEAL_DELAY_MS === 0) {
        setGallerySceneReduced(true);
        setGalleryVisible(true);
        return;
      }

      revealDelayRef.current = window.setTimeout(() => {
        setGallerySceneReduced(true);
        setGalleryVisible(true);
        revealDelayRef.current = null;
      }, GALLERY_REVEAL_DELAY_MS);
    };
    const hideGalleryBeforeSection = () => {
      clearGalleryRevealDelay();
      setGalleryVisible(false);
      setGallerySceneReduced(false);
    };
    const hideGalleryAfterSection = () => {
      clearGalleryRevealDelay();
      setGalleryVisible(false);
      setGallerySceneReduced(true);
    };

    if (reducedMotion) {
      const visibilityTrigger = ScrollTrigger.create({
        trigger: section,
        start: GALLERY_VISIBILITY_START,
        end: "bottom 12%",
        onEnter: showGallery,
        onEnterBack: showGallery,
        onLeave: hideGalleryAfterSection,
        onLeaveBack: hideGalleryBeforeSection,
        onUpdate: (self) => setGalleryProgress(self.progress)
      });

      return () => {
        clearGalleryRevealDelay();
        visibilityTrigger.kill();
        resetGalleryScene();
      };
    }

    const mm = gsap.matchMedia();

    mm.add(DESKTOP_QUERY, () => {
      const visibilityTrigger = ScrollTrigger.create({
        trigger: section,
        start: GALLERY_VISIBILITY_START,
        end: "bottom top",
        onEnter: showGallery,
        onEnterBack: showGallery,
        onLeave: hideGalleryAfterSection,
        onLeaveBack: hideGalleryBeforeSection
      });

      const galleryTrigger = ScrollTrigger.create({
        trigger: section,
        invalidateOnRefresh: true,
        start: "top top",
        end: "bottom top",
        onLeave: () => setGalleryProgress(1),
        onLeaveBack: () => {
          setGalleryProgress(0);
        },
        onUpdate: (self) => setGalleryProgress(self.progress)
      });

      return () => {
        clearGalleryRevealDelay();
        visibilityTrigger.kill();
        galleryTrigger.kill();
        setGalleryVisible(false);
      };
    });

    mm.add(MOBILE_QUERY, () => {
      const visibilityTrigger = ScrollTrigger.create({
        trigger: section,
        start: GALLERY_VISIBILITY_START,
        end: "bottom 12%",
        onEnter: showGallery,
        onEnterBack: showGallery,
        onLeave: hideGalleryAfterSection,
        onLeaveBack: hideGalleryBeforeSection,
        onUpdate: (self) => setGalleryProgress(self.progress)
      });

      return () => {
        clearGalleryRevealDelay();
        visibilityTrigger.kill();
      };
    });

    return () => {
      clearGalleryRevealDelay();
      mm.revert();
      resetGalleryScene();
    };
  }, [
    reducedMotion,
    resetGalleryScene,
    setGalleryProgress,
    setGallerySceneReduced,
    setGalleryVisible
  ]);

  return (
    <SectionFrame
      className="min-h-screen [&>[data-section-kicker]]:opacity-0"
      data-clear-section-layer
      eyebrow="Campaign Gallery"
      id="campaign-gallery"
      index="03"
      ref={sectionRef}
      style={{ minHeight: `${DESKTOP_SCROLL_VH}vh` }}
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
    </SectionFrame>
  );
}
