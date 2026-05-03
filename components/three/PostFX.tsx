"use client";

import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette
} from "@react-three/postprocessing";
import { useEffect, useMemo, useState } from "react";
import { Vector2 } from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";

type PostFXProps = {
  tier: PerformanceTier;
};

export function PostFX({ tier }: PostFXProps) {
  const chromaOffset = useMemo(() => new Vector2(0.0002, 0.00028), []);
  const [bloomIntensity, setBloomIntensity] = useState(
    theatreControls.heroEnvironment.value.bloomIntensity
  );
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const postfx = useAurenSceneStore((state) => state.postfx);
  const environment = useAurenSceneStore((state) => state.environment);

  useEffect(() => {
    return theatreControls.heroEnvironment.onValuesChange((values) => {
      setBloomIntensity(values.bloomIntensity);
    });
  }, []);

  const finalBloomIntensity = levaOverrides
    ? (postfx.bloomEnabled ? postfx.bloomIntensity : 0) * environment.bloomIntensity
    : 0.66 * bloomIntensity;
  const finalThreshold = levaOverrides ? postfx.bloomThreshold : 0.34;
  const finalChromatic = levaOverrides
    ? postfx.chromaticAberrationEnabled
      ? postfx.chromaticOffset
      : 0
    : 0.00028;
  chromaOffset.set(finalChromatic * 0.72, finalChromatic);

  return (
    <EffectComposer multisampling={tier === "high" ? 4 : 0}>
      <Bloom intensity={finalBloomIntensity} luminanceThreshold={finalThreshold} mipmapBlur />
      {tier === "high" && (!levaOverrides || postfx.dofEnabled) ? (
        <DepthOfField bokehScale={0.85} focalLength={0.02} focusDistance={0.025} />
      ) : (
        <></>
      )}
      <ChromaticAberration
        modulationOffset={0}
        offset={chromaOffset}
        radialModulation={false}
      />
      <Noise opacity={levaOverrides ? postfx.grainOpacity : 0.022} />
      <Vignette
        darkness={levaOverrides ? postfx.vignetteDarkness : 0.84}
        offset={levaOverrides ? postfx.vignetteOffset : 0.2}
      />
    </EffectComposer>
  );
}
