"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { GodRayBeam } from "@/components/three/GodRayBeam";
import { theatreControls } from "@/components/three/TheatreControls";
import { aurenHeroPreset } from "@/lib/auren-hero-preset";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";

const beamVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const floorGlowFragment = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uHotspotRadius;

  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * vec2(1.0, 2.35);
    float d = length(uv);
    float core = 1.0 - smoothstep(0.0, uHotspotRadius * 0.42, d);
    float halo = 1.0 - smoothstep(uHotspotRadius * 0.08, uHotspotRadius, d);
    float alpha = (core * 0.55 + halo * 0.45) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function HeroEnvironment() {
  const floorGlowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: beamVertex,
        fragmentShader: floorGlowFragment,
        uniforms: {
          uColor: { value: new THREE.Color("#E4A94D") },
          uOpacity: { value: 0.42 },
          uHotspotRadius: { value: aurenHeroPreset.floor.floorHotspotRadius }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      }),
    []
  );
  const heroSpotlightRef = useRef<THREE.SpotLight>(null);
  const rimLeftRef = useRef<THREE.DirectionalLight>(null);
  const rimRightRef = useRef<THREE.DirectionalLight>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const frontGlowRef = useRef<THREE.PointLight>(null);
  const progress = useScrollProgress((state) => state.progress);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const spotlightControls = useAurenSceneStore((state) => state.spotlight);
  const rimControls = useAurenSceneStore((state) => state.rim);
  const floorControls = useAurenSceneStore((state) => state.floor);

  useFrame((_, delta) => {
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const theatreSpotlight = theatreControls.heroSpotlight.value;
    const theatreRim = theatreControls.rimLight.value;
    const environment = levaOverrides ? environmentControls : theatreEnvironment;
    const spotlightPosition = levaOverrides
      ? {
          x: spotlightControls.spotlightX,
          y: spotlightControls.spotlightY,
          z: spotlightControls.spotlightZ
        }
      : theatreSpotlight.position;
    const spotlightIntensity = levaOverrides
      ? spotlightControls.spotlightIntensity
      : theatreSpotlight.intensity;
    const spotlightAngle = levaOverrides ? spotlightControls.spotlightAngle : theatreSpotlight.angle;
    const spotlightPenumbra = levaOverrides
      ? spotlightControls.spotlightPenumbra
      : theatreSpotlight.penumbra;
    const spotlightDistance = levaOverrides ? spotlightControls.spotlightDistance : 0;
    const spotlightDecay = levaOverrides
      ? spotlightControls.spotlightDecay
      : aurenHeroPreset.spotlight.spotlightDecay;
    const spotlightColor = levaOverrides
      ? new THREE.Color(spotlightControls.spotlightColor)
      : new THREE.Color(theatreSpotlight.color.r, theatreSpotlight.color.g, theatreSpotlight.color.b);
    const rimLeftPosition = levaOverrides
      ? { x: rimControls.rimX, y: rimControls.rimY, z: rimControls.rimZ }
      : theatreRim.leftPosition;
    const rimRightPosition = levaOverrides
      ? { x: Math.abs(rimControls.rimX), y: rimControls.rimY * 0.75, z: rimControls.rimZ * 0.78 }
      : theatreRim.rightPosition;
    const rimIntensity = levaOverrides ? rimControls.rimIntensity : theatreRim.leftIntensity;
    const rimRightIntensity = levaOverrides ? rimControls.rimIntensity * 0.52 : theatreRim.rightIntensity;
    const rimColor = levaOverrides
      ? new THREE.Color(rimControls.rimColor)
      : new THREE.Color(theatreRim.color.r, theatreRim.color.g, theatreRim.color.b);
    const hero = 1 - THREE.MathUtils.smoothstep(progress, 0.12, 0.42);
    const film =
      THREE.MathUtils.smoothstep(progress, 0.7, 0.82) *
      (1 - THREE.MathUtils.smoothstep(progress, 0.88, 0.98));
    const ritual =
      THREE.MathUtils.smoothstep(progress, 0.48, 0.62) *
      (1 - THREE.MathUtils.smoothstep(progress, 0.68, 0.76));

    floorGlowMaterial.uniforms.uHotspotRadius.value = levaOverrides
      ? floorControls.floorHotspotRadius
      : aurenHeroPreset.floor.floorHotspotRadius;
    floorGlowMaterial.uniforms.uOpacity.value = THREE.MathUtils.damp(
      floorGlowMaterial.uniforms.uOpacity.value,
      (0.08 + hero * 0.48 + film * 0.16) *
        environment.amberGlow *
        (levaOverrides ? floorControls.floorGlowIntensity * floorControls.floorHotspotStrength : 1.62),
      2.4,
      delta
    );

    if (heroSpotlightRef.current) {
      heroSpotlightRef.current.position.set(
        spotlightPosition.x,
        spotlightPosition.y,
        spotlightPosition.z
      );
      heroSpotlightRef.current.intensity = spotlightIntensity * environment.amberGlow * 1.18;
      heroSpotlightRef.current.angle = spotlightAngle;
      heroSpotlightRef.current.penumbra = spotlightPenumbra;
      heroSpotlightRef.current.distance = spotlightDistance;
      heroSpotlightRef.current.decay = spotlightDecay;
      heroSpotlightRef.current.color.copy(spotlightColor);
    }

    if (rimLeftRef.current) {
      rimLeftRef.current.position.set(
        rimLeftPosition.x,
        rimLeftPosition.y,
        rimLeftPosition.z
      );
      rimLeftRef.current.intensity = rimIntensity;
      rimLeftRef.current.color.copy(rimColor);
    }

    if (rimRightRef.current) {
      rimRightRef.current.position.set(
        rimRightPosition.x,
        rimRightPosition.y,
        rimRightPosition.z
      );
      rimRightRef.current.intensity = rimRightIntensity;
      rimRightRef.current.color.copy(rimColor).multiplyScalar(0.78);
    }

    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.damp(
        glowRef.current.intensity,
        (1.2 + hero * 2.15 + ritual * 0.36 + film * 1.16) * environment.amberGlow,
        2.4,
        delta
      );
    }

    if (frontGlowRef.current) {
      frontGlowRef.current.intensity = THREE.MathUtils.damp(
        frontGlowRef.current.intensity,
        (1.05 + hero * 2.35) * environment.amberGlow,
        2.4,
        delta
      );
    }
  });

  return (
    <>
      <hemisphereLight args={["#17120d", "#050403", 0.18]} />
      <spotLight
        angle={0.18}
        castShadow
        color="#F0D08A"
        intensity={7.2}
        penumbra={0.92}
        position={[0.05, 8.9, 1.35]}
        ref={heroSpotlightRef}
      />
      <spotLight
        angle={0.28}
        color="#C99748"
        intensity={1.35}
        penumbra={0.9}
        position={[0, 2.2, 3.25]}
      />
      <directionalLight
        color="#E6BF64"
        intensity={0.92}
        position={[-2.6, 2.2, 2.7]}
        ref={rimLeftRef}
      />
      <directionalLight
        color="#A66C34"
        intensity={0.48}
        position={[2.6, 1.65, 2.1]}
        ref={rimRightRef}
      />
      <directionalLight color="#7B3F5E" intensity={0.24} position={[3, 1.8, -2]} />
      <pointLight color="#B66A25" intensity={1.5} position={[0, -1.2, 1.05]} ref={glowRef} />
      <pointLight color="#F0D08A" intensity={1} position={[0, 0.32, 2.65]} ref={frontGlowRef} />
      <pointLight color="#F4D28B" intensity={0.58} position={[-0.9, 0.45, 1.9]} />
      <pointLight color="#D59745" intensity={0.42} position={[1.0, -0.05, 1.8]} />

      <GodRayBeam />

      <mesh position={[0, -1.236, 0.18]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.86, 0.68, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive attach="material" object={floorGlowMaterial} />
      </mesh>
    </>
  );
}
