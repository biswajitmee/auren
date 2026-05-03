"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { VideoCard } from "@/components/ui/VideoCard";
import { aurenAssets } from "@/lib/auren-assets";

export function FilmSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-film-card]", {
        scale: 0.94,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
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
      className="flex min-h-screen items-center"
      eyebrow="The Film"
      id="film"
      index="07"
      ref={sectionRef}
    >
      <div className="w-full" data-film-card>
        <VideoCard
          caption="The Campaign Film — 2026"
          image={aurenAssets.images.film}
          title="The Campaign Film"
        />
      </div>
    </SectionFrame>
  );
}
