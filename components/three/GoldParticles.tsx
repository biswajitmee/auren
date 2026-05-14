"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";
import fragmentShader from "@/shaders/particles.frag";
import vertexShader from "@/shaders/particles.vert";

type GoldParticlesProps = {
  tier: PerformanceTier;
};

export function GoldParticles({ tier }: GoldParticlesProps) {
  const count = tier === "high" ? 1200 : tier === "medium" ? 820 : 420;
  const groupRef = useRef<THREE.Group>(null);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const particleControls = useAurenSceneStore((state) => state.particles);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const debugControls = useAurenSceneStore((state) => state.debug);

  const { positions, scales, phases } = useMemo(() => {
    const positionArray = new Float32Array(count * 3);
    const scaleArray = new Float32Array(count);
    const phaseArray = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const central = i < count * 0.76;
      const beam = i < count * 0.34;
      const radius = beam
        ? Math.pow(Math.random(), 1.95) * 0.92
        : central
          ? 0.42 + Math.random() * 2.25
          : 2.35 + Math.random() * 4.35;
      const angle = Math.random() * Math.PI * 2;

      positionArray[i * 3] = Math.cos(angle) * radius;
      positionArray[i * 3 + 1] = beam
        ? -1.18 + Math.random() * 4.9
        : central
          ? -1.3 + Math.random() * 4.15
          : -1.95 + Math.random() * 5.65;
      positionArray[i * 3 + 2] = Math.sin(angle) * radius - (beam ? 0.4 : central ? 0.72 : 1.8);
      scaleArray[i] = beam
        ? 0.08 + Math.random() * 0.42
        : central
          ? 0.06 + Math.random() * 0.48
          : 0.05 + Math.random() * 0.28;
      phaseArray[i] = Math.random();
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
          uSize: { value: tier === "low" ? 11 : 15.5 },
          uScroll: { value: 0 },
          uColor: { value: new THREE.Color("#D8B65D") },
          uOpacity: { value: 1 },
          uColorIntensity: { value: 1 },
          uTwinkle: { value: 1 },
          uBeamDensity: { value: 1 },
          uUpwardFlow: { value: 1 },
          uDepthStrength: { value: 1 }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }),
    [tier]
  );

  useFrame((state) => {
    const progress = useScrollProgress.getState().progress;
    const theatreParticles = theatreControls.goldParticles.value;
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const particles = levaOverrides
      ? {
          opacity: particleControls.particlesEnabled ? particleControls.particleOpacity : 0,
          speed: particleControls.particleSpeed,
          sizeMultiplier: particleControls.particleSize,
          spread: particleControls.particleSpread,
          colorIntensity: particleControls.particleDensity,
          twinkle: particleControls.particleTwinkle,
          beamDensity: particleControls.particleBeamDensity,
          color: particleControls.particleColor,
          upwardFlow: particleControls.particleUpwardFlow,
          depthStrength: particleControls.particleDepthStrength
        }
      : {
          ...theatreParticles,
          twinkle: 1,
          beamDensity: 1.65,
          color: "#D8B65D",
          upwardFlow: 0.72,
          depthStrength: 1.24
        };
    const environment = levaOverrides ? environmentControls : theatreEnvironment;
    const timeScale = levaOverrides && debugControls.freezeAnimations ? 0 : particles.speed;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(particles.spread);
    }

    material.uniforms.uTime.value = state.clock.elapsedTime * timeScale;
    material.uniforms.uSize.value = (tier === "low" ? 11 : 15.5) * particles.sizeMultiplier;
    material.uniforms.uScroll.value = progress;
    material.uniforms.uOpacity.value = particles.opacity * environment.particleIntensity;
    material.uniforms.uColorIntensity.value = particles.colorIntensity;
    material.uniforms.uTwinkle.value = particles.twinkle;
    material.uniforms.uBeamDensity.value = particles.beamDensity;
    material.uniforms.uUpwardFlow.value = particles.upwardFlow;
    material.uniforms.uDepthStrength.value = particles.depthStrength;
    material.uniforms.uColor.value.set(particles.color);
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
