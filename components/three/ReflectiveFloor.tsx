"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import type { MeshReflectorMaterial as MeshReflectorMaterialImpl } from "@react-three/drei/materials/MeshReflectorMaterial";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { aurenHeroPreset } from "@/lib/auren-hero-preset";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";
import { useScrollProgress } from "@/lib/useScrollProgress";
import fragmentShader from "@/shaders/floor.frag";
import vertexShader from "@/shaders/floor.vert";

type ReflectiveFloorProps = {
  active?: boolean;
  tier: PerformanceTier;
};

export function ReflectiveFloor({ active = true, tier }: ReflectiveFloorProps) {
  const gallerySceneReduced = useDesireGalleryScene((state) => state.sceneReduced);
  const groupRef = useRef<THREE.Group>(null);
  const reflectorRef = useRef<MeshReflectorMaterialImpl>(null);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const floorControls = useAurenSceneStore((state) => state.floor);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const veinMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: tier === "low" ? 0.18 : 0.34 },
          uVeinIntensity: { value: 1 },
          uVeinScale: { value: 1 },
          uHotspotStrength: { value: 1 },
          uHotspotRadius: { value: 0.42 },
          uAtmosphereReflection: { value: 1 },
          uBaseColor: { value: new THREE.Color("#090705") },
          uVeinColor: { value: new THREE.Color("#E49E38") }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }),
    [tier]
  );

  useFrame((state) => {
    if (!active) {
      if (groupRef.current) {
        groupRef.current.visible = false;
      }

      return;
    }

    const progress = useScrollProgress.getState().progress;
    const theatreFloor = theatreControls.reflectiveFloor.value;
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const environment = levaOverrides ? environmentControls : theatreEnvironment;
    const floor = levaOverrides
      ? {
          position: {
            x: theatreFloor.position.x,
            y: floorControls.floorY,
            z: theatreFloor.position.z
          },
          rotation: theatreFloor.rotation,
          scale: theatreFloor.scale,
          roughness: floorControls.floorRoughness,
          reflectionIntensity: floorControls.floorReflectivity,
          veinOpacity: floorControls.floorVeinIntensity,
          veinScale: floorControls.floorVeinScale,
          metalness: floorControls.floorMetalness,
          blur: floorControls.floorBlur,
          color: floorControls.floorBaseColor,
          veinColor: floorControls.floorVeinColor,
          hotspotStrength: floorControls.floorHotspotStrength,
          hotspotRadius: floorControls.floorHotspotRadius,
          atmosphereReflection: floorControls.floorAtmosphereReflection,
          reflectionStrength: floorControls.reflectionStrength,
          enabled: floorControls.floorEnabled
        }
      : {
          ...theatreFloor,
          metalness: 0.74,
          blur: 0.92,
          color: "#050403",
          veinColor: "#E6A33E",
          veinOpacity: aurenHeroPreset.floor.floorVeinIntensity * theatreFloor.veinOpacity,
          veinScale: aurenHeroPreset.floor.floorVeinScale,
          hotspotStrength: 1.2,
          hotspotRadius: 0.42,
          atmosphereReflection: 1.18,
          reflectionStrength: 1.12,
          enabled: true
        };
    const hero = 1 - THREE.MathUtils.smoothstep(progress, 0.16, 0.54);

    if (groupRef.current) {
      groupRef.current.visible = floor.enabled;
      groupRef.current.position.set(floor.position.x, floor.position.y, floor.position.z);
      groupRef.current.rotation.set(floor.rotation.x, floor.rotation.y, floor.rotation.z);
      groupRef.current.scale.set(floor.scale.x, floor.scale.y, floor.scale.z);
    }

    if (reflectorRef.current) {
      reflectorRef.current.roughness = floor.roughness;
      reflectorRef.current.metalness = floor.metalness;
      reflectorRef.current.color.set(floor.color);
      reflectorRef.current.mixBlur = floor.blur;
      reflectorRef.current.mixStrength =
        (tier === "high" ? 2.15 : 1.18) *
        floor.reflectionIntensity *
        floor.reflectionStrength *
        environment.floorReflection *
        floor.atmosphereReflection;
      reflectorRef.current.mirror = 0.58 * floor.reflectionIntensity * floor.reflectionStrength;
    }

    veinMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    veinMaterial.uniforms.uOpacity.value =
      (tier === "low" ? 0.12 : 0.28) * hero * floor.veinOpacity;
    veinMaterial.uniforms.uVeinIntensity.value = floor.veinOpacity;
    veinMaterial.uniforms.uVeinScale.value = floor.veinScale;
    veinMaterial.uniforms.uHotspotStrength.value = floor.hotspotStrength;
    veinMaterial.uniforms.uHotspotRadius.value = floor.hotspotRadius;
    veinMaterial.uniforms.uAtmosphereReflection.value = floor.atmosphereReflection;
    veinMaterial.uniforms.uBaseColor.value.set(floor.color);
    veinMaterial.uniforms.uVeinColor.value.set(floor.veinColor);
  });

  return (
    <group position={[0, -1.42, 0]} ref={groupRef} rotation={[-Math.PI / 2, 0, 0]} visible={active}>
      <mesh receiveShadow>
        <planeGeometry args={[22, 22]} />
        {tier === "low" || gallerySceneReduced ? (
          <meshStandardMaterial
            color={levaOverrides ? floorControls.floorBaseColor : "#080604"}
            metalness={levaOverrides ? floorControls.floorMetalness : 0.58}
            roughness={levaOverrides ? floorControls.floorRoughness : 0.36}
          />
        ) : (
          <MeshReflectorMaterial
            blur={[320, 150]}
            color={levaOverrides ? floorControls.floorBaseColor : "#050403"}
            depthScale={0.78}
            metalness={0.74}
            mirror={0.68}
            mixBlur={0.92}
            mixStrength={tier === "high" ? 2.15 : 1.18}
            ref={reflectorRef}
            resolution={tier === "high" ? 768 : 384}
            roughness={0.18}
          />
        )}
      </mesh>
      <mesh position={[0, 0, 0.006]} renderOrder={2}>
        <planeGeometry args={[13, 13]} />
        <primitive attach="material" object={veinMaterial} />
      </mesh>
    </group>
  );
}
