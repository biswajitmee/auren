"use client";

import { editable as e } from "@theatre/r3f";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";
import fragmentShader from "@/shaders/goldenHelixParticles.frag";
import vertexShader from "@/shaders/goldenHelixParticles.vert";

type BottleGoldenHelixProps = {
  active?: boolean;
  tier: PerformanceTier;
};

function maxParticleCount(tier: PerformanceTier) {
  if (tier === "high") {
    return 2400;
  }

  if (tier === "medium") {
    return 1500;
  }

  return 760;
}

export function BottleGoldenHelix({ active = true, tier }: BottleGoldenHelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const helixControls = useAurenSceneStore((state) => state.goldHelix);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const debugControls = useAurenSceneStore((state) => state.debug);
  const maxCount = maxParticleCount(tier);

  const particleAttributes = useMemo(() => {
    const progress = new Float32Array(maxCount);
    const pipeAngles = new Float32Array(maxCount);
    const pipeRadii = new Float32Array(maxCount);
    const scales = new Float32Array(maxCount);
    const phases = new Float32Array(maxCount);

    for (let index = 0; index < maxCount; index += 1) {
      progress[index] = Math.random();
      pipeAngles[index] = Math.random() * Math.PI * 2;
      pipeRadii[index] = Math.sqrt(Math.random());
      scales[index] = 0.42 + Math.random() * 0.92;
      phases[index] = Math.random();
    }

    return { progress, pipeAngles, pipeRadii, scales, phases };
  }, [maxCount]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uRadius: { value: 0.18 },
          uHeight: { value: 1.18 },
          uTurns: { value: 3.15 },
          uTubeRadius: { value: 0.058 },
          uSize: { value: tier === "low" ? 17 : 23 },
          uSpeed: { value: 0.82 },
          uNoiseStrength: { value: 0.68 },
          uSmokeCurl: { value: 0.86 },
          uColor: { value: new THREE.Color("#D8B65D") },
          uOpacity: { value: 0 },
          uColorIntensity: { value: 1.14 }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }),
    [tier]
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const progress = useScrollProgress.getState().progress;
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const environment = levaOverrides ? environmentControls : theatreEnvironment;
    const heroPresence = 1 - THREE.MathUtils.smoothstep(progress, 0.2, 0.66);
    const enabled = active && helixControls.helixEnabled && heroPresence > 0.001;
    const opacity = enabled
      ? helixControls.helixParticleOpacity * environment.particleIntensity * heroPresence
      : 0;
    const visibleCount = Math.max(
      0,
      Math.min(maxCount, Math.round(helixControls.helixParticleCount))
    );
    const timeScale = levaOverrides && debugControls.freezeAnimations ? 0 : 1;

    if (groupRef.current) {
      groupRef.current.visible = enabled;
    }

    if (geometryRef.current) {
      geometryRef.current.setDrawRange(0, visibleCount);
    }

    material.uniforms.uTime.value = state.clock.elapsedTime * timeScale;
    material.uniforms.uRadius.value = helixControls.helixRadius;
    material.uniforms.uHeight.value = helixControls.helixHeight;
    material.uniforms.uTurns.value = helixControls.helixTurns;
    material.uniforms.uTubeRadius.value = helixControls.helixTubeRadius;
    material.uniforms.uSize.value = (tier === "low" ? 17 : 23) * helixControls.helixParticleSize;
    material.uniforms.uSpeed.value = helixControls.helixParticleSpeed;
    material.uniforms.uNoiseStrength.value = helixControls.helixNoiseStrength;
    material.uniforms.uSmokeCurl.value = helixControls.helixSmokeCurl;
    material.uniforms.uOpacity.value = opacity;
    material.uniforms.uColorIntensity.value = helixControls.helixColorIntensity;
    material.uniforms.uColor.value.set(helixControls.helixParticleColor);
  });

  return (
    <e.group
      position={[0.04, 0.14, 0.12]}
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
      theatreKey="Bottle Golden Helix"
    >
      <group ref={groupRef} visible={active && helixControls.helixEnabled}>
        <points frustumCulled={false} renderOrder={8}>
          <bufferGeometry ref={geometryRef}>
            <bufferAttribute
              attach="attributes-aProgress"
              array={particleAttributes.progress}
              count={maxCount}
              itemSize={1}
            />
            <bufferAttribute
              attach="attributes-aPipeAngle"
              array={particleAttributes.pipeAngles}
              count={maxCount}
              itemSize={1}
            />
            <bufferAttribute
              attach="attributes-aPipeRadius"
              array={particleAttributes.pipeRadii}
              count={maxCount}
              itemSize={1}
            />
            <bufferAttribute
              attach="attributes-aScale"
              array={particleAttributes.scales}
              count={maxCount}
              itemSize={1}
            />
            <bufferAttribute
              attach="attributes-aPhase"
              array={particleAttributes.phases}
              count={maxCount}
              itemSize={1}
            />
          </bufferGeometry>
          <primitive attach="material" object={material} />
        </points>
      </group>
    </e.group>
  );
}
