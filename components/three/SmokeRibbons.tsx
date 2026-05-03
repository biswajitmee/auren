"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";
import fragmentShader from "@/shaders/ribbon.frag";
import vertexShader from "@/shaders/ribbon.vert";

type SmokeRibbonsProps = {
  tier: PerformanceTier;
};

export function SmokeRibbons({ tier }: SmokeRibbonsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useScrollProgress((state) => state.progress);
  const ribbonCount = tier === "high" ? 12 : tier === "medium" ? 8 : 5;
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const smokeControls = useAurenSceneStore((state) => state.smoke);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const debugControls = useAurenSceneStore((state) => state.debug);

  const ribbons = useMemo(() => {
    return Array.from({ length: ribbonCount }, (_, index) => {
      const side = index % 2 === 0 ? 1 : -1;
      const depth = index % 3;
      const lift = -0.82 + (index / ribbonCount) * 2.95;
      const geometry = new THREE.PlaneGeometry(1, 1, 36, 8);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uOpacity: { value: tier === "low" ? 0.04 : 0.075 },
          uColor: { value: new THREE.Color(index % 3 === 0 ? "#E2C184" : "#B98A4A") },
          uColorIntensity: { value: 1 },
          uCurlStrength: { value: 1 }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });

      return {
        geometry,
        material,
        position: [
          side * (0.9 + (index % 4) * 0.28),
          lift,
          -0.95 - depth * 0.16
        ] as [number, number, number],
        rotation: [
          0,
          side * (0.22 + depth * 0.05),
          side * (0.36 - (index % 5) * 0.065)
        ] as [
          number,
          number,
          number
        ],
        scale: [
          1.65 + depth * 0.38 + Math.random() * 0.28,
          0.34 + Math.random() * 0.16,
          1
        ] as [number, number, number]
      };
    });
  }, [ribbonCount, tier]);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    const theatreSmoke = theatreControls.smokeAtmosphere.value;
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const smoke = levaOverrides
      ? {
          opacity: smokeControls.smokeEnabled ? smokeControls.smokeOpacity : 0,
          speed: smokeControls.smokeSpeed,
          spread: smokeControls.smokeSpread,
          colorIntensity: 1,
          curlStrength: smokeControls.smokeCurlStrength,
          layerDepth: smokeControls.smokeLayerDepth,
          color: smokeControls.smokeColor,
          scale: smokeControls.smokeScale
        }
      : {
          ...theatreSmoke,
          curlStrength: 1,
          layerDepth: 1,
          color: "#E2C184",
          scale: 1
        };
    const environment = levaOverrides ? environmentControls : theatreEnvironment;
    const heroPresence = 1 - THREE.MathUtils.smoothstep(progress, 0.7, 0.96);
    const timeScale = levaOverrides && debugControls.freezeAnimations ? 0 : smoke.speed;
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      Math.sin(state.clock.elapsedTime * 0.08 * timeScale) * 0.08,
      2,
      delta
    );
    const ribbonScale = THREE.MathUtils.damp(
      groupRef.current.scale.x,
      (0.88 + heroPresence * 0.14) * smoke.spread * smoke.scale,
      2,
      delta
    );
    groupRef.current.scale.set(ribbonScale, ribbonScale, ribbonScale * smoke.layerDepth);

    ribbons.forEach((ribbon, index) => {
      ribbon.material.uniforms.uTime.value = state.clock.elapsedTime * timeScale + index * 0.6;
      ribbon.material.uniforms.uScroll.value = progress;
      ribbon.material.uniforms.uOpacity.value =
        (tier === "low" ? 0.034 : 0.07) *
        heroPresence *
        smoke.opacity *
        environment.smokeOpacity;
      ribbon.material.uniforms.uColorIntensity.value = smoke.colorIntensity;
      ribbon.material.uniforms.uCurlStrength.value = smoke.curlStrength;
      ribbon.material.uniforms.uColor.value.set(smoke.color);
    });
  });

  return (
    <group ref={groupRef}>
      {ribbons.map((ribbon, index) => (
        <mesh
          geometry={ribbon.geometry}
          key={index}
          material={ribbon.material}
          position={ribbon.position}
          rotation={ribbon.rotation}
          scale={ribbon.scale}
        />
      ))}
    </group>
  );
}
