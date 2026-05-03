"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import type { MeshReflectorMaterial as MeshReflectorMaterialImpl } from "@react-three/drei/materials/MeshReflectorMaterial";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";
import fragmentShader from "@/shaders/floor.frag";
import vertexShader from "@/shaders/floor.vert";

type ReflectiveFloorProps = {
  tier: PerformanceTier;
};

export function ReflectiveFloor({ tier }: ReflectiveFloorProps) {
  const progress = useScrollProgress((state) => state.progress);
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
          metalness: floorControls.floorMetalness,
          blur: floorControls.floorBlur,
          color: floorControls.floorColor,
          veinColor: floorControls.veinColor,
          enabled: floorControls.floorEnabled
        }
      : {
          ...theatreFloor,
          metalness: 0.68,
          blur: 0.78,
          color: "#090705",
          veinColor: "#E49E38",
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
        (tier === "high" ? 1.95 : 1.02) * floor.reflectionIntensity * environment.floorReflection;
      reflectorRef.current.mirror = 0.62 * floor.reflectionIntensity;
    }

    veinMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    veinMaterial.uniforms.uOpacity.value =
      (tier === "low" ? 0.14 : 0.34) * hero * floor.veinOpacity;
    veinMaterial.uniforms.uBaseColor.value.set(floor.color);
    veinMaterial.uniforms.uVeinColor.value.set(floor.veinColor);
  });

  return (
    <group position={[0, -1.42, 0]} ref={groupRef} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh receiveShadow>
        <planeGeometry args={[22, 22]} />
        {tier === "low" ? (
          <meshStandardMaterial
            color={levaOverrides ? floorControls.floorColor : "#080604"}
            metalness={levaOverrides ? floorControls.floorMetalness : 0.58}
            roughness={levaOverrides ? floorControls.floorRoughness : 0.36}
          />
        ) : (
          <MeshReflectorMaterial
            blur={[320, 150]}
            color={levaOverrides ? floorControls.floorColor : "#090705"}
            depthScale={0.56}
            metalness={0.68}
            mirror={0.62}
            mixBlur={0.78}
            mixStrength={tier === "high" ? 1.95 : 1.02}
            ref={reflectorRef}
            resolution={tier === "high" ? 768 : 384}
            roughness={0.22}
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
