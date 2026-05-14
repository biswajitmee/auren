"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { ByteLoader } from "@/components/loader/ByteLoader";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Header } from "@/components/layout/Header";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { CampaignGallerySection } from "@/components/sections/CampaignGallerySection";
import { EditionsSection } from "@/components/sections/EditionsSection";
import { FilmSection } from "@/components/sections/FilmSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { FragranceNotesSection } from "@/components/sections/FragranceNotesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductRevealSection } from "@/components/sections/ProductRevealSection";
import { RitualGuideSection } from "@/components/sections/RitualGuideSection";
import { RitualStorySection } from "@/components/sections/RitualStorySection";
import { criticalAssets } from "@/lib/auren-assets";
import { cn } from "@/lib/cn";

const AurenCanvas = dynamic(() => import("@/components/three/AurenCanvas"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-obsidian" />
});

const LevaPanel = dynamic(
  () => import("@/components/debug/LevaPanel").then((mod) => mod.LevaPanel),
  { ssr: false }
);

export default function Home() {
  const [experienceReady, setExperienceReady] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    setShowDebug(window.location.search.includes("debug=1"));
  }, []);

  return (
    <SmoothScrollProvider enabled={experienceReady}>
      <AurenCanvas active={experienceReady} />
      {showDebug ? <LevaPanel /> : null}
      <CustomCursor />
      <Header />
      <ByteLoader
        assets={criticalAssets}
        onComplete={() => setExperienceReady(true)}
      />
      <main
        className={cn(
          "relative z-10 transition-opacity duration-700",
          experienceReady ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <HeroSection />
        <ProductRevealSection />
        <CampaignGallerySection />
        <FragranceNotesSection />
        <RitualStorySection />
        <FilmSection />
        <EditionsSection />
        <RitualGuideSection />
        <FooterSection />
      </main>
    </SmoothScrollProvider>
  );
}
