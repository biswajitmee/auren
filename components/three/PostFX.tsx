"use client";

import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette
} from "@react-three/postprocessing";
import { useThree } from "@react-three/fiber";
import { Component, useEffect, useMemo, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Vector2 } from "three";
import type { WebGLRenderer } from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";

type PostFXProps = {
  tier: PerformanceTier;
};

type PostFXRuntimeBoundaryProps = {
  children: ReactNode;
  resetKey: number;
};

type PostFXRuntimeBoundaryState = {
  disabled: boolean;
};

function hasUsableWebGLContext(gl: WebGLRenderer) {
  const context = gl.getContext();

  if (!context || context.isContextLost()) {
    return false;
  }

  return context.getContextAttributes() !== null;
}

class PostFXRuntimeBoundary extends Component<
  PostFXRuntimeBoundaryProps,
  PostFXRuntimeBoundaryState
> {
  state: PostFXRuntimeBoundaryState = {
    disabled: false
  };

  static getDerivedStateFromError(): PostFXRuntimeBoundaryState {
    return { disabled: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Post-processing disabled after a WebGL composer error.", error, info);
    }
  }

  componentDidUpdate(prevProps: PostFXRuntimeBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.disabled) {
      this.setState({ disabled: false });
    }
  }

  render() {
    if (this.state.disabled) {
      return null;
    }

    return this.props.children;
  }
}

export function PostFX({ tier }: PostFXProps) {
  const gl = useThree((state) => state.gl);
  const chromaOffset = useMemo(() => new Vector2(0.0002, 0.00028), []);
  const [contextReady, setContextReady] = useState(() => hasUsableWebGLContext(gl));
  const [composerResetKey, setComposerResetKey] = useState(0);
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

  useEffect(() => {
    const canvas = gl.domElement;
    const syncContextState = () => setContextReady(hasUsableWebGLContext(gl));

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setContextReady(false);
    };

    const handleContextRestored = () => {
      syncContextState();
      setComposerResetKey((key) => key + 1);
    };

    syncContextState();
    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored, false);
    };
  }, [gl]);

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

  if (!contextReady || !hasUsableWebGLContext(gl)) {
    return null;
  }

  return (
    <PostFXRuntimeBoundary resetKey={composerResetKey}>
      <EffectComposer
        key={composerResetKey}
        multisampling={tier === "high" ? 2 : 0}
      >
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
    </PostFXRuntimeBoundary>
  );
}
