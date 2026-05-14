"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";
import fragmentShader from "@/shaders/smoke.frag";
import vertexShader from "@/shaders/smoke.vert";

type SmokeParticlesProps = {
  tier: PerformanceTier;
};

export function SmokeParticles({ tier }: SmokeParticlesProps) {
  const count = tier === "high" ? 86 : tier === "medium" ? 54 : 32;
  const groupRef = useRef<THREE.Group>(null);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const smokeControls = useAurenSceneStore((state) => state.smoke);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const debugControls = useAurenSceneStore((state) => state.debug);

  const { positions, scales, phases } = useMemo(() => {
    const positionArray = new Float32Array(count * 3);
    const scaleArray = new Float32Array(count);
    const phaseArray = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const side = Math.random() > 0.5 ? 1 : -1;
      positionArray[i * 3] = side * (0.55 + Math.random() * 2.55);
      positionArray[i * 3 + 1] = -1.05 + Math.random() * 3.1;
      positionArray[i * 3 + 2] = -1.9 + Math.random() * 2.2;
      scaleArray[i] = 0.32 + Math.random() * 1.08;
      phaseArray[i] = Math.random() * Math.PI * 2;
    }

    return { positions: positionArray, scales: scaleArray, phases: phaseArray };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: tier === "low" ? 92 : 132 },
          uScroll: { value: 0 },
          uColor: { value: new THREE.Color("#E8D3AA") },
          uOpacity: { value: 0.08 },
          uVerticalDrift: { value: 1 },
          uColorIntensity: { value: 1 },
          uCurlStrength: { value: 1 }
        },
        transparent: true,
        depthWrite: false
      }),
    [tier]
  );

  useFrame((state) => {
    const progress = useScrollProgress.getState().progress;
    const theatreSmoke = theatreControls.smokeAtmosphere.value;
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const smoke = levaOverrides
      ? {
          opacity: smokeControls.smokeEnabled ? smokeControls.smokeOpacity : 0,
          speed: smokeControls.smokeSpeed,
          spread: smokeControls.smokeSpread,
          verticalDrift: smokeControls.smokeScale,
          colorIntensity: 1,
          curlStrength: smokeControls.smokeCurlStrength,
          layerDepth: smokeControls.smokeLayerDepth,
          color: smokeControls.smokeColor
        }
      : {
          ...theatreSmoke,
          curlStrength: 1,
          layerDepth: 1,
          color: "#E8D3AA"
        };
    const environment = levaOverrides ? environmentControls : theatreEnvironment;
    const ritualLift = THREE.MathUtils.smoothstep(progress, 0.48, 0.62);
    const endFade = 1 - THREE.MathUtils.smoothstep(progress, 0.85, 1);
    const timeScale = levaOverrides && debugControls.freezeAnimations ? 0 : smoke.speed;
    const smokeScale = levaOverrides ? smokeControls.smokeScale : 1;

    if (groupRef.current) {
      groupRef.current.scale.set(smoke.spread, smokeScale, smoke.spread * smoke.layerDepth);
    }

    material.uniforms.uTime.value = state.clock.elapsedTime * timeScale;
    material.uniforms.uScroll.value = progress;
    material.uniforms.uOpacity.value =
      (0.028 + ritualLift * 0.16) * endFade * smoke.opacity * environment.smokeOpacity;
    material.uniforms.uVerticalDrift.value = smoke.verticalDrift;
    material.uniforms.uColorIntensity.value = smoke.colorIntensity;
    material.uniforms.uCurlStrength.value = smoke.curlStrength;
    material.uniforms.uColor.value.set(smoke.color);
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={count}
            itemSize={3}
          />
          <bufferAttribute attach="attributes-aScale" array={scales} count={count} itemSize={1} />
          <bufferAttribute attach="attributes-aPhase" array={phases} count={count} itemSize={1} />
        </bufferGeometry>
        <primitive attach="material" object={material} />
      </points>
    </group>
  );
}
