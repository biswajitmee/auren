"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { aurenHeroPreset } from "@/lib/auren-hero-preset";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";
import fragmentShader from "@/shaders/smokeRibbon.frag";
import vertexShader from "@/shaders/smokeRibbon.vert";

type FragranceSmokeRibbonsProps = {
  tier: PerformanceTier;
};

type RibbonKind = "left" | "right" | "rear" | "lower" | "wisp";

type RibbonDescriptor = {
  key: string;
  kind: RibbonKind;
  points: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3];
  width: number;
  opacity: number;
  speed: number;
  seed: number;
  centerAvoidance: number;
  renderOrder: number;
};

type RibbonInstance = RibbonDescriptor & {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
};

const VIEW_NORMAL = new THREE.Vector3(0, 0, 1);

function vec(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z);
}

function shifted(
  points: RibbonDescriptor["points"],
  offset: [number, number, number]
): RibbonDescriptor["points"] {
  const delta = vec(offset[0], offset[1], offset[2]);
  return points.map((point) => point.clone().add(delta)) as RibbonDescriptor["points"];
}

function maxSecondaryWisps(tier: PerformanceTier) {
  if (tier === "high") {
    return 8;
  }

  if (tier === "medium") {
    return 5;
  }

  return 3;
}

function createRibbonGeometry(points: RibbonDescriptor["points"], width: number, segments: number) {
  const curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
  const positions: number[] = [];
  const uvs: number[] = [];
  const sideSigns: number[] = [];
  const sideDirs: number[] = [];
  const indices: number[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t).normalize();
    const side = new THREE.Vector3().crossVectors(tangent, VIEW_NORMAL);

    if (side.lengthSq() < 0.0001) {
      side.set(1, 0, 0);
    } else {
      side.normalize();
    }

    const taper = Math.sin(t * Math.PI);
    const widthAtPoint = width * (0.18 + taper * 0.82);
    const sideDir = side.multiplyScalar(widthAtPoint);

    positions.push(point.x, point.y, point.z, point.x, point.y, point.z);
    uvs.push(0, t, 1, t);
    sideSigns.push(-1, 1);
    sideDirs.push(sideDir.x, sideDir.y, sideDir.z, sideDir.x, sideDir.y, sideDir.z);

    if (index < segments) {
      const base = index * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aSideSign", new THREE.Float32BufferAttribute(sideSigns, 1));
  geometry.setAttribute("aSideDir", new THREE.Float32BufferAttribute(sideDirs, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();

  return geometry;
}

function createMaterial(seed: number, kind: RibbonKind) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uSpeed: { value: 1 },
      uNoiseScale: { value: aurenHeroPreset.smoke.smokeNoiseScale },
      uCurlStrength: { value: aurenHeroPreset.smoke.smokeCurlStrength },
      uDissolve: { value: aurenHeroPreset.smoke.smokeDissolve },
      uColor: { value: new THREE.Color(aurenHeroPreset.smoke.smokeColor) },
      uLightColor: { value: new THREE.Color("#F0C875") },
      uBeamCenter: {
        value: new THREE.Vector3(
          aurenHeroPreset.beam.beamX,
          aurenHeroPreset.beam.beamY,
          aurenHeroPreset.beam.beamZ
        )
      },
      uBeamRadius: { value: 1.2 },
      uBeamInfluence: { value: aurenHeroPreset.smoke.smokeLightInfluence },
      uWarmth: { value: aurenHeroPreset.smoke.smokeWarmthInBeam },
      uEdgeSoftness: { value: aurenHeroPreset.smoke.smokeEdgeSoftness },
      uRibbonWidth: { value: aurenHeroPreset.smoke.smokeRibbonWidth },
      uBrightness: { value: aurenHeroPreset.smoke.smokeBrightness },
      uSeed: { value: seed },
      uCenterClearRadius: { value: aurenHeroPreset.smoke.smokeCenterClearRadius },
      uCenterAvoidance: { value: kind === "rear" ? 0.28 : kind === "lower" ? 0.52 : 1 },
      uLowerMist: { value: kind === "lower" ? 1 : 0 }
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
}

function createRibbonDescriptors(tier: PerformanceTier): RibbonDescriptor[] {
  const leftBase: RibbonDescriptor["points"] = [
    vec(-1.55, -1.2, 0.24),
    vec(-0.94, -0.22, -0.2),
    vec(-1.46, 0.78, -0.48),
    vec(-0.88, 1.82, -0.34)
  ];
  const rightBase: RibbonDescriptor["points"] = [
    vec(1.12, -1.08, 0.22),
    vec(1.62, -0.08, -0.14),
    vec(0.98, 0.82, -0.54),
    vec(1.55, 1.92, -0.28)
  ];
  const rearBase: RibbonDescriptor["points"] = [
    vec(-1.4, -0.7, -1.8),
    vec(-0.3, 0.1, -2.0),
    vec(0.9, 0.8, -1.8),
    vec(1.6, 1.5, -2.1)
  ];
  const lowerBase: RibbonDescriptor["points"] = [
    vec(-1.52, -1.32, 0.12),
    vec(-0.78, -1.18, -0.48),
    vec(0.55, -1.26, -0.42),
    vec(1.36, -1.16, 0.1)
  ];

  const descriptors: RibbonDescriptor[] = [
    {
      key: "left-major",
      kind: "left",
      points: leftBase,
      width: 0.3,
      opacity: 1.55,
      speed: 0.86,
      seed: 0.13,
      centerAvoidance: 1,
      renderOrder: 5
    },
    {
      key: "left-soft-tail",
      kind: "left",
      points: shifted(leftBase, [-0.2, -0.08, -0.34]),
      width: 0.22,
      opacity: 0.92,
      speed: 0.72,
      seed: 1.37,
      centerAvoidance: 0.92,
      renderOrder: 4
    },
    {
      key: "right-major",
      kind: "right",
      points: rightBase,
      width: 0.28,
      opacity: 1.48,
      speed: 0.78,
      seed: 2.11,
      centerAvoidance: 1,
      renderOrder: 5
    },
    {
      key: "right-vertical-tail",
      kind: "right",
      points: shifted(rightBase, [0.24, 0.1, -0.24]),
      width: 0.2,
      opacity: 0.84,
      speed: 0.68,
      seed: 3.42,
      centerAvoidance: 0.95,
      renderOrder: 4
    },
    {
      key: "rear-depth",
      kind: "rear",
      points: rearBase,
      width: 0.34,
      opacity: 0.46,
      speed: 0.52,
      seed: 4.68,
      centerAvoidance: 0.22,
      renderOrder: 3
    },
    {
      key: "rear-high-wisp",
      kind: "rear",
      points: shifted(rearBase, [-0.28, 0.18, -0.26]),
      width: 0.2,
      opacity: 0.34,
      speed: 0.6,
      seed: 5.83,
      centerAvoidance: 0.18,
      renderOrder: 3
    },
    {
      key: "lower-mist",
      kind: "lower",
      points: lowerBase,
      width: 0.32,
      opacity: 0.48,
      speed: 0.42,
      seed: 6.19,
      centerAvoidance: 0.5,
      renderOrder: 6
    },
    {
      key: "lower-hotspot-wisp",
      kind: "lower",
      points: shifted(lowerBase, [0.18, 0.04, -0.2]),
      width: 0.24,
      opacity: 0.36,
      speed: 0.5,
      seed: 7.9,
      centerAvoidance: 0.42,
      renderOrder: 6
    }
  ];

  const secondaryCount = maxSecondaryWisps(tier);
  for (let index = 0; index < secondaryCount; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const heightOffset = (index % 3) * 0.18;
    const zOffset = -0.18 - (index % 4) * 0.12;

    descriptors.push({
      key: `side-wisp-${index}`,
      kind: "wisp",
      points: [
        vec(side * (1.12 + index * 0.025), -1.04 + heightOffset * 0.2, -0.18 + zOffset),
        vec(side * (1.58 + index * 0.03), -0.32 + heightOffset, -0.36 + zOffset),
        vec(side * (1.02 + index * 0.025), 0.42 + heightOffset, -0.18 + zOffset),
        vec(side * (1.46 + index * 0.02), 1.18 + heightOffset, -0.44 + zOffset)
      ],
      width: 0.1 + (index % 3) * 0.025,
      opacity: 0.26 + (index % 2) * 0.08,
      speed: 0.48 + (index % 4) * 0.08,
      seed: 8.31 + index * 1.71,
      centerAvoidance: 1,
      renderOrder: 4
    });
  }

  return descriptors;
}

export function FragranceSmokeRibbons({ tier }: FragranceSmokeRibbonsProps) {
  const progress = useScrollProgress((state) => state.progress);
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const smokeControls = useAurenSceneStore((state) => state.smoke);
  const beamControls = useAurenSceneStore((state) => state.beam);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const debugControls = useAurenSceneStore((state) => state.debug);

  const ribbons = useMemo<RibbonInstance[]>(() => {
    const segments = tier === "low" ? 34 : tier === "medium" ? 44 : 56;
    return createRibbonDescriptors(tier).map((descriptor) => ({
      ...descriptor,
      geometry: createRibbonGeometry(descriptor.points, descriptor.width, segments),
      material: createMaterial(descriptor.seed, descriptor.kind)
    }));
  }, [tier]);

  useFrame((state) => {
    const theatreSmoke = theatreControls.smokeAtmosphere.value;
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const theatreGodRay = theatreControls.godRayBeam.value;
    const smoke = levaOverrides
      ? smokeControls
      : {
          ...aurenHeroPreset.smoke,
          smokeOpacity:
            aurenHeroPreset.smoke.smokeOpacity * (0.45 + theatreSmoke.opacity * 0.55),
          smokeSpeed: theatreSmoke.speed,
          smokeSpread: aurenHeroPreset.smoke.smokeSpread * theatreSmoke.spread,
          smokeRiseSpeed: aurenHeroPreset.smoke.smokeRiseSpeed * theatreSmoke.verticalDrift,
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
          beamScaleZ: aurenHeroPreset.beam.beamScaleZ * theatreGodRay.scale.z,
          beamHeight: aurenHeroPreset.beam.beamHeight * theatreGodRay.scale.y
        };
    const heroPresence = 1 - THREE.MathUtils.smoothstep(progress, 0.2, 0.62);
    const timeScale = levaOverrides && debugControls.freezeAnimations ? 0 : 1;
    const time = state.clock.elapsedTime * timeScale;
    const environmentSmokeOpacity = levaOverrides
      ? environment.smokeOpacity
      : Math.max(environment.smokeOpacity, 0.55);
    const beamRadius =
      Math.max(beam.beamScaleX * beam.beamTopWidth, beam.beamScaleZ * beam.beamTopWidth) * 1.08;
    const visibleCount = Math.min(Math.round(smoke.smokeLayerCount), ribbons.length);

    ribbons.forEach((ribbon, index) => {
      const mesh = meshRefs.current[index];
      if (!mesh) {
        return;
      }

      const kindIntensity =
        ribbon.kind === "left"
          ? smoke.smokeLeftIntensity
          : ribbon.kind === "right"
            ? smoke.smokeRightIntensity
            : ribbon.kind === "rear"
              ? smoke.smokeRearIntensity
              : ribbon.kind === "lower"
                ? smoke.smokeLowerMistIntensity
                : Math.min(smoke.smokeLeftIntensity, smoke.smokeRightIntensity) * 0.58;
      const visible =
        smoke.smokeEnabled && heroPresence > 0.001 && kindIntensity > 0.001 && index < visibleCount;

      mesh.visible = visible;
      mesh.scale.set(smoke.smokeSpread, smoke.smokeHeight, smoke.smokeLayerDepth);

      ribbon.material.uniforms.uTime.value = time;
      ribbon.material.uniforms.uOpacity.value =
        ribbon.opacity *
        kindIntensity *
        smoke.smokeOpacity *
        environmentSmokeOpacity *
        heroPresence *
        (tier === "low" ? 0.82 : 1);
      ribbon.material.uniforms.uSpeed.value =
        smoke.smokeSpeed * Math.max(smoke.smokeRiseSpeed, 0.05) * ribbon.speed;
      ribbon.material.uniforms.uNoiseScale.value = smoke.smokeNoiseScale;
      ribbon.material.uniforms.uCurlStrength.value = smoke.smokeCurlStrength;
      ribbon.material.uniforms.uDissolve.value = smoke.smokeDissolve;
      ribbon.material.uniforms.uColor.value.set(smoke.smokeColor);
      ribbon.material.uniforms.uLightColor.value.set(beam.beamColor);
      ribbon.material.uniforms.uBeamCenter.value.set(beam.beamX, beam.beamY, beam.beamZ);
      ribbon.material.uniforms.uBeamRadius.value = beamRadius;
      ribbon.material.uniforms.uBeamInfluence.value = smoke.smokeLightInfluence;
      ribbon.material.uniforms.uWarmth.value = smoke.smokeWarmthInBeam;
      ribbon.material.uniforms.uEdgeSoftness.value = smoke.smokeEdgeSoftness;
      ribbon.material.uniforms.uRibbonWidth.value = smoke.smokeRibbonWidth;
      ribbon.material.uniforms.uBrightness.value = smoke.smokeBrightness;
      ribbon.material.uniforms.uCenterClearRadius.value = smoke.smokeCenterClearRadius;
      ribbon.material.uniforms.uCenterAvoidance.value = ribbon.centerAvoidance;
    });
  });

  return (
    <group>
      {ribbons.map((ribbon, index) => (
        <mesh
          geometry={ribbon.geometry}
          key={ribbon.key}
          material={ribbon.material}
          ref={(node) => {
            meshRefs.current[index] = node;
          }}
          renderOrder={ribbon.renderOrder}
        />
      ))}
    </group>
  );
}
