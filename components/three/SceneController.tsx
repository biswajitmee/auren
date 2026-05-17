"use client";

import { Suspense } from "react";

import { CameraRig } from "@/components/three/CameraRig";
import { BottleGoldenHelix } from "@/components/three/BottleGoldenHelix";
import { DesireGlassGallery } from "@/components/three/DesireGlassGallery";
import { GoldParticles } from "@/components/three/GoldParticles";
import { HeroEnvironment } from "@/components/three/HeroEnvironment";
import { PerfumeBottle } from "@/components/three/PerfumeBottle";
import { PostFX } from "@/components/three/PostFX";
import { ReflectiveFloor } from "@/components/three/ReflectiveFloor";
import { SmokeShell } from "@/components/three/SmokeShell";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";

type SceneControllerProps = {
  active?: boolean;
  reducedMotion?: boolean;
  tier: PerformanceTier;
};

export function SceneController({
  active = true,
  reducedMotion = false,
  tier
}: SceneControllerProps) {
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const debugControls = useAurenSceneStore((state) => state.debug);
  const gallerySceneReduced = useDesireGalleryScene((state) => state.sceneReduced);
  const effectiveTier = levaOverrides ? debugControls.performanceMode : tier;

  return (
    <>
      <CameraRig />
      <HeroEnvironment />
      <PerfumeBottle active={active && !gallerySceneReduced} tier={effectiveTier} />
      <BottleGoldenHelix active={active && !gallerySceneReduced} tier={effectiveTier} />
      <BottleGoldenHelix
        active={active && !gallerySceneReduced}
        position={[-0.04, 0.14, 0.12]}
        tier={effectiveTier}
        theatreKey="Bottle Golden Helix 2"
      />
      <ReflectiveFloor active={!gallerySceneReduced} tier={effectiveTier} />
      <GoldParticles tier={effectiveTier} />
      <SmokeShell active={!gallerySceneReduced} tier={effectiveTier} />
      <Suspense fallback={null}>
        <DesireGlassGallery />
      </Suspense>
      {levaOverrides && debugControls.showAxes ? <axesHelper args={[3]} /> : null}
      {levaOverrides && debugControls.showHelpers ? (
        <gridHelper args={[12, 24, "#C9A84C", "#3A2A16"]} position={[0, -1.4, 0]} />
      ) : null}
      {effectiveTier !== "low" && !reducedMotion ? <PostFX tier={effectiveTier} /> : null}
    </>
  );
}
