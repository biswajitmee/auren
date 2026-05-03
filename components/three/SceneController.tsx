"use client";

import { CameraRig } from "@/components/three/CameraRig";
import { GoldParticles } from "@/components/three/GoldParticles";
import { HeroEnvironment } from "@/components/three/HeroEnvironment";
import { PerfumeBottle } from "@/components/three/PerfumeBottle";
import { PostFX } from "@/components/three/PostFX";
import { ReflectiveFloor } from "@/components/three/ReflectiveFloor";
import { SmokeParticles } from "@/components/three/SmokeParticles";
import { SmokeRibbons } from "@/components/three/SmokeRibbons";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";

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
  const effectiveTier = levaOverrides ? debugControls.performanceMode : tier;

  return (
    <>
      <CameraRig reducedMotion={reducedMotion} />
      <HeroEnvironment />
      <PerfumeBottle active={active} tier={effectiveTier} />
      <ReflectiveFloor tier={effectiveTier} />
      <GoldParticles tier={effectiveTier} />
      <SmokeParticles tier={effectiveTier} />
      <SmokeRibbons tier={effectiveTier} />
      {levaOverrides && debugControls.showAxes ? <axesHelper args={[3]} /> : null}
      {levaOverrides && debugControls.showHelpers ? (
        <gridHelper args={[12, 24, "#C9A84C", "#3A2A16"]} position={[0, -1.4, 0]} />
      ) : null}
      {effectiveTier !== "low" && !reducedMotion ? <PostFX tier={effectiveTier} /> : null}
    </>
  );
}
