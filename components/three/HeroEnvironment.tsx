"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";

const beamVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragment = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uSoftness;

  varying vec2 vUv;

  void main() {
    float x = abs(vUv.x - 0.5);
    float coneWidth = mix(0.11, 0.5, vUv.y);
    float cone = 1.0 - smoothstep(coneWidth * 0.62 * uSoftness, coneWidth * uSoftness, x);
    float core = 1.0 - smoothstep(0.018, coneWidth * 0.22, x);
    float vertical = smoothstep(0.02, 0.24, vUv.y) * smoothstep(1.0, 0.34, vUv.y);
    float topGlow = mix(0.52, 1.35, vUv.y);
    float alpha = (cone * 0.46 + core * 0.72) * vertical * topGlow * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

const floorGlowFragment = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * vec2(1.0, 2.35);
    float d = length(uv);
    float core = 1.0 - smoothstep(0.0, 0.18, d);
    float halo = 1.0 - smoothstep(0.05, 0.5, d);
    float alpha = (core * 0.55 + halo * 0.45) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function HeroEnvironment() {
  const beamMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: beamVertex,
        fragmentShader: beamFragment,
        uniforms: {
          uColor: { value: new THREE.Color("#E7C66E") },
          uOpacity: { value: 0.42 },
          uSoftness: { value: 1 }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      }),
    []
  );
  const floorGlowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: beamVertex,
        fragmentShader: floorGlowFragment,
        uniforms: {
          uColor: { value: new THREE.Color("#E4A94D") },
          uOpacity: { value: 0.42 }
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
  const beamGroupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const frontGlowRef = useRef<THREE.PointLight>(null);
  const progress = useScrollProgress((state) => state.progress);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const spotlightControls = useAurenSceneStore((state) => state.spotlight);
  const rimControls = useAurenSceneStore((state) => state.rim);
  const beamControls = useAurenSceneStore((state) => state.beam);
  const floorControls = useAurenSceneStore((state) => state.floor);

  useFrame((_, delta) => {
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const theatreSpotlight = theatreControls.heroSpotlight.value;
    const theatreRim = theatreControls.rimLight.value;
    const theatreGodRay = theatreControls.godRayBeam.value;
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
    const godRayPosition = levaOverrides
      ? { x: beamControls.beamX, y: beamControls.beamY, z: beamControls.beamZ }
      : theatreGodRay.position;
    const godRayScale = levaOverrides
      ? { x: beamControls.beamScaleX, y: beamControls.beamScaleY, z: beamControls.beamScaleZ }
      : theatreGodRay.scale;
    const godRayOpacity = levaOverrides ? beamControls.beamOpacity : theatreGodRay.opacity;
    const godRayIntensity = levaOverrides ? beamControls.beamIntensity : theatreGodRay.colorIntensity;
    const godRayColor = levaOverrides
      ? new THREE.Color(beamControls.beamColor)
      : spotlightColor.clone().multiplyScalar(godRayIntensity);
    const hero = 1 - THREE.MathUtils.smoothstep(progress, 0.12, 0.42);
    const film =
      THREE.MathUtils.smoothstep(progress, 0.7, 0.82) *
      (1 - THREE.MathUtils.smoothstep(progress, 0.88, 0.98));
    const ritual =
      THREE.MathUtils.smoothstep(progress, 0.48, 0.62) *
      (1 - THREE.MathUtils.smoothstep(progress, 0.68, 0.76));

    beamMaterial.uniforms.uColor.value.copy(godRayColor).multiplyScalar(godRayIntensity);
    beamMaterial.uniforms.uSoftness.value = levaOverrides ? beamControls.beamSoftness : 1;
    beamMaterial.uniforms.uOpacity.value = THREE.MathUtils.damp(
      beamMaterial.uniforms.uOpacity.value,
      (0.12 + hero * 0.74 + film * 0.2) * godRayOpacity * environment.godRayIntensity,
      2.4,
      delta
    );

    floorGlowMaterial.uniforms.uOpacity.value = THREE.MathUtils.damp(
      floorGlowMaterial.uniforms.uOpacity.value,
      (0.08 + hero * 0.48 + film * 0.16) *
        environment.amberGlow *
        (levaOverrides ? floorControls.floorGlowIntensity : 1),
      2.4,
      delta
    );

    if (heroSpotlightRef.current) {
      heroSpotlightRef.current.position.set(
        spotlightPosition.x,
        spotlightPosition.y,
        spotlightPosition.z
      );
      heroSpotlightRef.current.intensity = spotlightIntensity * environment.amberGlow;
      heroSpotlightRef.current.angle = spotlightAngle;
      heroSpotlightRef.current.penumbra = spotlightPenumbra;
      heroSpotlightRef.current.distance = spotlightDistance;
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

    if (beamGroupRef.current) {
      beamGroupRef.current.visible = !levaOverrides || beamControls.beamEnabled;
      beamGroupRef.current.position.set(
        godRayPosition.x,
        godRayPosition.y,
        godRayPosition.z
      );
      beamGroupRef.current.scale.set(godRayScale.x, godRayScale.y, godRayScale.z);
    }

    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.damp(
        glowRef.current.intensity,
        (1.05 + hero * 1.75 + ritual * 0.3 + film * 1.1) * environment.amberGlow,
        2.4,
        delta
      );
    }

    if (frontGlowRef.current) {
      frontGlowRef.current.intensity = THREE.MathUtils.damp(
        frontGlowRef.current.intensity,
        (0.85 + hero * 1.95) * environment.amberGlow,
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

      <group position={[0, 1.64, -1.08]} ref={beamGroupRef}>
        <mesh scale={[2.75, 6.55, 1]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <primitive attach="material" object={beamMaterial} />
        </mesh>
        <mesh scale={[2.35, 6.55, 1]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1, 1]} />
          <primitive attach="material" object={beamMaterial} />
        </mesh>
      </group>

      <mesh position={[0, -1.238, 0.18]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.52, 0.52, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive attach="material" object={floorGlowMaterial} />
      </mesh>
    </>
  );
}
