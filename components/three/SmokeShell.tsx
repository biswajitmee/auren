"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { aurenHeroPreset } from "@/lib/auren-hero-preset";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";
import fragmentShader from "@/shaders/smoke.frag";
import vertexShader from "@/shaders/smoke.vert";

type SmokeShellProps = {
  tier: PerformanceTier;
};

type SmokeRibbonDescriptor = {
  angleT: number;
  depthT: number;
  heightT: number;
  layer: number;
  sideSign: number;
  width: number;
  height: number;
  tilt: number;
  phase: number;
  seed: number;
  material: THREE.ShaderMaterial;
};

function randomFromSeed(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453123;
  return x - Math.floor(x);
}

function maxRibbonCount(tier: PerformanceTier) {
  if (tier === "high") {
    return 56;
  }

  if (tier === "medium") {
    return 42;
  }

  return 26;
}

export function SmokeShell({ tier }: SmokeShellProps) {
  const count = maxRibbonCount(tier);
  const progress = useScrollProgress((state) => state.progress);
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);
  const scaffoldRef = useRef<THREE.Mesh>(null);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const smokeControls = useAurenSceneStore((state) => state.smoke);
  const beamControls = useAurenSceneStore((state) => state.beam);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const debugControls = useAurenSceneStore((state) => state.debug);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 64, 14), []);
  const ribbons = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const seed = randomFromSeed(index + 1.618);
      const heightSeed = randomFromSeed(index + 8.31);
      const depthSeed = randomFromSeed(index + 4.73);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: 1 },
          uRiseSpeed: { value: 1 },
          uCurlStrength: { value: 1 },
          uLayerSeed: { value: seed },
          uColor: { value: new THREE.Color(aurenHeroPreset.smoke.smokeColor) },
          uWarmColor: { value: new THREE.Color("#F0C875") },
          uBeamPosition: {
            value: new THREE.Vector3(
              aurenHeroPreset.beam.beamX,
              aurenHeroPreset.beam.beamY,
              aurenHeroPreset.beam.beamZ
            )
          },
          uOpacity: { value: 0 },
          uBrightness: { value: 1 },
          uNoiseScale: { value: 2.5 },
          uDissolve: { value: 0.42 },
          uLightResponse: { value: 1 },
          uBeamInfluence: { value: 1 },
          uWarmthInBeam: { value: 0.8 },
          uShadowDensity: { value: 0.7 },
          uBeamRadius: { value: 1.2 },
          uBeamHeight: { value: aurenHeroPreset.beam.beamHeight },
          uBeamTopWidth: { value: aurenHeroPreset.beam.beamTopWidth },
          uBeamBottomWidth: { value: aurenHeroPreset.beam.beamBottomWidth },
          uBeamFalloff: { value: aurenHeroPreset.beam.beamFalloff },
          uDriftX: { value: aurenHeroPreset.smoke.smokeDriftX },
          uDriftZ: { value: aurenHeroPreset.smoke.smokeDriftZ },
          uDepthStrength: { value: aurenHeroPreset.smoke.smokeDepthStrength },
          uLowerDensity: { value: aurenHeroPreset.smoke.smokeLowerDensity },
          uUpperFade: { value: aurenHeroPreset.smoke.smokeUpperFade },
          uLayerOpacity: { value: 1 },
          uFloorHotspotStrength: { value: aurenHeroPreset.floor.floorHotspotStrength },
          uFloorHotspotRadius: { value: aurenHeroPreset.floor.floorHotspotRadius }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide
      });

      return {
        angleT: (index + seed * 0.72) / count,
        depthT: depthSeed,
        heightT: Math.pow(heightSeed, 1.55),
        layer: index % 3,
        sideSign: randomFromSeed(index + 31.4) > 0.5 ? 1 : -1,
        width: 2.2 + randomFromSeed(index + 10.2) * 3.35,
        height: 0.72 + randomFromSeed(index + 16.4) * 1.75,
        tilt: THREE.MathUtils.lerp(-0.42, 0.42, randomFromSeed(index + 2.9)),
        phase: randomFromSeed(index + 20.7) * Math.PI * 2,
        seed,
        material
      };
    });
  }, [count]);

  useFrame((state) => {
    const theatreSmoke = theatreControls.smokeAtmosphere.value;
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const theatreGodRay = theatreControls.godRayBeam.value;
    const smoke = levaOverrides
      ? smokeControls
      : {
          ...aurenHeroPreset.smoke,
          smokeOpacity: aurenHeroPreset.smoke.smokeOpacity * theatreSmoke.opacity,
          smokeSpeed: theatreSmoke.speed,
          smokeRiseSpeed: aurenHeroPreset.smoke.smokeRiseSpeed * theatreSmoke.verticalDrift,
          smokeSpread: aurenHeroPreset.smoke.smokeSpread * theatreSmoke.spread,
          smokeBrightness:
            aurenHeroPreset.smoke.smokeBrightness * theatreSmoke.colorIntensity
        };
    const environment = levaOverrides ? environmentControls : theatreEnvironment;
    const beam = levaOverrides
      ? beamControls
      : {
          ...aurenHeroPreset.beam,
          beamX: theatreGodRay.position.x,
          beamY: theatreGodRay.position.y,
          beamZ: theatreGodRay.position.z,
          beamScaleX: aurenHeroPreset.beam.beamScaleX * theatreGodRay.scale.x,
          beamScaleY: aurenHeroPreset.beam.beamScaleY * theatreGodRay.scale.y,
          beamScaleZ: aurenHeroPreset.beam.beamScaleZ * theatreGodRay.scale.z
        };
    const floor = useAurenSceneStore.getState().floor;
    const timeScale = levaOverrides && debugControls.freezeAnimations ? 0 : 1;
    const time = state.clock.elapsedTime * timeScale;
    const heroPresence = 1 - THREE.MathUtils.smoothstep(progress, 0.2, 0.62);
    const openAngle = THREE.MathUtils.degToRad(
      THREE.MathUtils.clamp(smoke.smokeOpenFrontAngle, 70, 150)
    );
    const availableAngle = Math.PI * 2 - openAngle;
    const visibleLayerCount = Math.min(Math.round(smoke.smokeLayerCount), count);
    const beamRadius =
      Math.max(beam.beamScaleX * beam.beamTopWidth, beam.beamScaleZ * beam.beamTopWidth) * 0.42;
    const beamHeight = beam.beamHeight ?? aurenHeroPreset.beam.beamHeight;
    const beamTopWidth = beam.beamTopWidth ?? aurenHeroPreset.beam.beamTopWidth;
    const beamBottomWidth = beam.beamBottomWidth ?? aurenHeroPreset.beam.beamBottomWidth;
    const beamFalloff = beam.beamFalloff ?? aurenHeroPreset.beam.beamFalloff;
    const hotspotStrength = levaOverrides
      ? floor.floorHotspotStrength
      : aurenHeroPreset.floor.floorHotspotStrength;
    const hotspotRadius = levaOverrides
      ? floor.floorHotspotRadius
      : aurenHeroPreset.floor.floorHotspotRadius;

    if (scaffoldRef.current) {
      scaffoldRef.current.scale.set(
        smoke.smokeShellRadius,
        smoke.smokeShellHeight * 0.5,
        smoke.smokeShellRadius
      );
    }

    ribbons.forEach((ribbon, index) => {
      const mesh = meshRefs.current[index];

      if (!mesh) {
        return;
      }

      const visible = smoke.smokeEnabled && index < visibleLayerCount && heroPresence > 0.001;
      mesh.visible = visible;

      const driftAngle =
        Math.sin(time * 0.08 + ribbon.phase) * 0.065 * smoke.smokeCurlStrength;
      const frontEdgeAngle =
        ribbon.sideSign *
        (openAngle * 0.38 + ribbon.angleT * openAngle * 0.16 + 0.08);
      const chamberAngle = openAngle * 0.5 + ribbon.angleT * availableAngle;
      const angle = (ribbon.layer === 0 ? frontEdgeAngle : chamberAngle) + driftAngle;
      const layerDepth = ribbon.layer === 0 ? 0.78 : ribbon.layer === 1 ? 1.0 : 1.28;
      const layerOpacity =
        ribbon.layer === 0
          ? smoke.smokeFrontLayerOpacity
          : ribbon.layer === 1
            ? smoke.smokeMidLayerOpacity
            : smoke.smokeRearLayerOpacity;
      const radius =
        smoke.smokeShellRadius *
        smoke.smokeSpawnRadius *
        smoke.smokeSpread *
        THREE.MathUtils.lerp(0.68, 1.18, ribbon.depthT) *
        layerDepth;
      const lowerWeight = 1 - ribbon.heightT;
      const y =
        -1.24 +
        ribbon.heightT * smoke.smokeShellHeight +
        Math.sin(time * 0.16 + ribbon.phase) * 0.08 * smoke.smokeCurlStrength;

      mesh.position.set(
        Math.sin(angle) * radius,
        y,
        Math.cos(angle) * radius * smoke.smokeLayerDepth - 0.14
      );
      mesh.rotation.set(
        ribbon.layer === 0 ? -0.08 * ribbon.sideSign : 0,
        angle + Math.PI,
        ribbon.tilt + Math.sin(time * 0.11 + ribbon.phase) * 0.08
      );
      mesh.scale.set(
        ribbon.width *
          smoke.smokeScale *
          (0.62 + lowerWeight * smoke.smokeSpawnStrength * 0.16),
        ribbon.height *
          smoke.smokeHeight *
          (0.56 + lowerWeight * smoke.smokeLowerDensity * 0.24) *
          (ribbon.layer === 2 ? 1.22 : 1),
        1
      );

      ribbon.material.uniforms.uTime.value = time;
      ribbon.material.uniforms.uSpeed.value = smoke.smokeSpeed;
      ribbon.material.uniforms.uRiseSpeed.value = smoke.smokeRiseSpeed;
      ribbon.material.uniforms.uDriftX.value = smoke.smokeDriftX;
      ribbon.material.uniforms.uDriftZ.value = smoke.smokeDriftZ;
      ribbon.material.uniforms.uCurlStrength.value = smoke.smokeCurlStrength;
      ribbon.material.uniforms.uOpacity.value =
        (tier === "low" ? 0.038 : 0.068) *
        heroPresence *
        smoke.smokeOpacity *
        environment.smokeOpacity *
        (0.72 + lowerWeight * smoke.smokeSpawnStrength * 0.18);
      ribbon.material.uniforms.uBrightness.value = smoke.smokeBrightness;
      ribbon.material.uniforms.uNoiseScale.value = smoke.smokeNoiseScale;
      ribbon.material.uniforms.uDissolve.value = smoke.smokeDissolve;
      ribbon.material.uniforms.uLightResponse.value = smoke.smokeLightResponse;
      ribbon.material.uniforms.uBeamInfluence.value = smoke.smokeBeamInfluence;
      ribbon.material.uniforms.uWarmthInBeam.value = smoke.smokeWarmthInBeam;
      ribbon.material.uniforms.uShadowDensity.value = smoke.smokeShadowDensity;
      ribbon.material.uniforms.uBeamRadius.value = beamRadius;
      ribbon.material.uniforms.uBeamHeight.value = beamHeight;
      ribbon.material.uniforms.uBeamTopWidth.value = beamTopWidth;
      ribbon.material.uniforms.uBeamBottomWidth.value = beamBottomWidth;
      ribbon.material.uniforms.uBeamFalloff.value = beamFalloff;
      ribbon.material.uniforms.uDepthStrength.value = smoke.smokeDepthStrength;
      ribbon.material.uniforms.uLowerDensity.value = smoke.smokeLowerDensity;
      ribbon.material.uniforms.uUpperFade.value = smoke.smokeUpperFade;
      ribbon.material.uniforms.uLayerOpacity.value = layerOpacity;
      ribbon.material.uniforms.uFloorHotspotStrength.value = hotspotStrength;
      ribbon.material.uniforms.uFloorHotspotRadius.value = hotspotRadius;
      ribbon.material.uniforms.uColor.value.set(smoke.smokeColor);
      ribbon.material.uniforms.uBeamPosition.value.set(beam.beamX, beam.beamY, beam.beamZ);
    });
  });

  return (
    <group>
      <mesh ref={scaffoldRef} visible={false}>
        <sphereGeometry args={[1, 48, 24]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {ribbons.map((ribbon, index) => (
        <mesh
          geometry={geometry}
          key={index}
          material={ribbon.material}
          ref={(node) => {
            meshRefs.current[index] = node;
          }}
          renderOrder={4}
        />
      ))}
    </group>
  );
}
