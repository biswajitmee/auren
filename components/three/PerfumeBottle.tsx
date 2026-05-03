"use client";

import { Text, useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { editable as e } from "@theatre/r3f";
import { Component, ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { ProceduralBottle } from "@/components/three/ProceduralBottle";
import { aurenHeroPreset } from "@/lib/auren-hero-preset";
import { aurenAssets } from "@/lib/auren-assets";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useScrollProgress } from "@/lib/useScrollProgress";

type PerfumeBottleProps = {
  active?: boolean;
  tier: PerformanceTier;
};

type ModelBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

class ModelBoundary extends Component<ModelBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function normalizeModel(scene: THREE.Group) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;

  return {
    center,
    scale: 2.35 / maxDimension
  };
}

function GLBBottle() {
  const gltf = useGLTF(aurenAssets.bottleModel);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const normalized = useMemo(() => normalizeModel(scene), [scene]);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const bottleControls = useAurenSceneStore((state) => state.bottle);

  useEffect(() => {
    const materialControls = levaOverrides ? bottleControls : aurenHeroPreset.bottle;

    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;

      if (!mesh.isMesh) {
        return;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const clonedMaterials = Array.isArray(mesh.material)
        ? mesh.material.map((material) => material.clone())
        : [mesh.material.clone()];

      clonedMaterials.forEach((material) => {
        const standard = material as THREE.MeshStandardMaterial;
        const enhanced = new THREE.MeshPhysicalMaterial({
          color: "#f4dcab",
          map: standard.map ?? null,
          metalness: materialControls.capMetalness,
          roughness: materialControls.glassRoughness,
          clearcoat: 1,
          clearcoatRoughness: Math.min(materialControls.capRoughness, 0.35),
          envMapIntensity: 4.2,
          emissive: "#2a1707",
          emissiveIntensity: 0.15 + materialControls.amberGlowIntensity * 0.28,
          ior: materialControls.glassIOR,
          opacity: materialControls.glassOpacity,
          reflectivity: 0.72,
          specularColor: "#f2d48a",
          specularIntensity: 1,
          transmission: materialControls.glassTransmission,
          thickness: materialControls.glassThickness,
          attenuationColor: "#b76a27",
          attenuationDistance: 1.1,
          transparent: materialControls.glassOpacity < 1
        });

        enhanced.normalMap = standard.normalMap ?? null;
        enhanced.aoMap = standard.aoMap ?? null;
        enhanced.needsUpdate = true;

        mesh.material = enhanced;
      });
    });
  }, [bottleControls, levaOverrides, scene]);

  return (
    <group scale={normalized.scale}>
      <primitive
        object={scene}
        position={[
          -normalized.center.x,
          -normalized.center.y - 0.08,
          -normalized.center.z
        ]}
      />
    </group>
  );
}

function AurenBottleLabel() {
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const amberGlowIntensity = useAurenSceneStore((state) => state.bottle.amberGlowIntensity);
  const amberOpacity = levaOverrides ? amberGlowIntensity : aurenHeroPreset.bottle.amberGlowIntensity;

  return (
    <group position={[0, -0.09, 0.78]} renderOrder={1000}>
      <mesh renderOrder={1000}>
        <planeGeometry args={[0.82, 0.68]} />
        <meshBasicMaterial
          color="#050403"
          depthTest={false}
          depthWrite={false}
          opacity={0.88}
          transparent
        />
      </mesh>
      <mesh position={[0, 0, 0.007]} renderOrder={1001}>
        <planeGeometry args={[0.7, 0.5]} />
        <meshBasicMaterial
          color="#C9A84C"
          depthTest={false}
          depthWrite={false}
          opacity={0.06}
          transparent
        />
      </mesh>
      <mesh position={[0, 0.345, 0.009]} renderOrder={1001}>
        <planeGeometry args={[0.74, 0.012]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#D8B65D"
          depthTest={false}
          depthWrite={false}
          opacity={0.28}
          transparent
        />
      </mesh>
      <mesh position={[0, -0.46, 0.01]} renderOrder={1001}>
        <planeGeometry args={[0.58, 0.18]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#A85B1E"
          depthTest={false}
          depthWrite={false}
          opacity={amberOpacity}
          transparent
        />
      </mesh>
      <Text
        anchorX="center"
        anchorY="middle"
        color="#D8B65D"
        fontSize={0.095}
        lineHeight={1.25}
        maxWidth={0.52}
        position={[0, -0.08, 0.012]}
        renderOrder={1002}
      >
        AUREN{"\n"}NOIR
      </Text>
      <Text
        anchorX="center"
        anchorY="middle"
        color="#D8B65D"
        fontSize={0.032}
        lineHeight={1.25}
        position={[0, -0.26, 0.014]}
        renderOrder={1002}
      >
        PARFUM{"\n"}100ML
      </Text>
    </group>
  );
}

function BottleGlassHighlights() {
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const glassOpacity = useAurenSceneStore((state) => state.bottle.glassOpacity);
  const stripMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: "#F0D08A",
        depthTest: false,
        depthWrite: false,
        opacity: 0.32,
        transparent: true
      }),
    []
  );

  useEffect(() => {
    stripMaterial.opacity = levaOverrides ? THREE.MathUtils.clamp(glassOpacity * 0.38, 0.08, 0.5) : 0.32;
  }, [glassOpacity, levaOverrides, stripMaterial]);

  return (
    <group renderOrder={999}>
      <mesh position={[-0.45, 0.03, 0.815]} rotation={[0, 0, 0.08]} renderOrder={999}>
        <planeGeometry args={[0.035, 1.36]} />
        <primitive attach="material" object={stripMaterial} />
      </mesh>
      <mesh position={[0.44, 0.08, 0.815]} rotation={[0, 0, -0.07]} renderOrder={999}>
        <planeGeometry args={[0.024, 1.24]} />
        <primitive attach="material" object={stripMaterial} />
      </mesh>
      <mesh position={[0, -0.63, 0.82]} renderOrder={999}>
        <planeGeometry args={[0.74, 0.018]} />
        <primitive attach="material" object={stripMaterial} />
      </mesh>
      <mesh position={[-0.02, 0.63, 0.82]} renderOrder={999}>
        <planeGeometry args={[0.72, 0.015]} />
        <primitive attach="material" object={stripMaterial} />
      </mesh>
    </group>
  );
}

export function PerfumeBottle({ active = true, tier }: PerfumeBottleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();
  const pointer = useThree((state) => state.pointer);
  const progress = useScrollProgress((state) => state.progress);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const bottleControls = useAurenSceneStore((state) => state.bottle);
  const debugControls = useAurenSceneStore((state) => state.debug);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    const group = groupRef.current;
    const bottle = levaOverrides ? bottleControls : aurenHeroPreset.bottle;
    const animationsFrozen = levaOverrides && debugControls.freezeAnimations;
    const cursorTilt = !reducedMotion && (!levaOverrides || bottle.cursorTiltEnabled);
    const scrollRotation = THREE.MathUtils.lerp(0, Math.PI * 1.75, progress);
    const idleY =
      !reducedMotion && levaOverrides && !animationsFrozen
        ? Math.sin(state.clock.elapsedTime * bottle.idleRotationSpeed) * 0.035
        : 0;
    const targetY =
      bottle.bottleRotY + (reducedMotion ? 0 : scrollRotation) + idleY + (cursorTilt ? pointer.x * bottle.cursorTiltAmount : 0);
    const targetX = bottle.bottleRotX + (cursorTilt ? pointer.y * bottle.cursorTiltAmount * 0.56 : 0);
    const float =
      reducedMotion || animationsFrozen
        ? 0
        : Math.sin(state.clock.elapsedTime * bottle.idleFloatSpeed) * bottle.idleFloatAmount;
    const heroPresence = 1 - THREE.MathUtils.smoothstep(progress, 0.08, 0.2);
    let prominence = 0.72 + heroPresence * 0.025;

    if (progress > 0.08 && progress <= 0.22) {
      prominence = THREE.MathUtils.mapLinear(progress, 0.08, 0.22, 0.74, 0.96);
    } else if (progress > 0.22 && progress <= 0.52) {
      prominence = THREE.MathUtils.mapLinear(progress, 0.22, 0.52, 0.88, 0.66);
    } else if (progress > 0.52 && progress <= 0.64) {
      prominence = 0.78;
    } else if (progress > 0.64 && progress <= 0.74) {
      prominence = 0.58;
    } else if (progress > 0.74 && progress <= 0.84) {
      prominence = 0.88;
    } else if (progress > 0.84) {
      prominence = THREE.MathUtils.mapLinear(progress, 0.84, 1, 0.72, 0.42);
    }

    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetY, 3.2, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, 3.2, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, bottle.bottleRotZ, 3.2, delta);
    group.position.x = THREE.MathUtils.damp(group.position.x, bottle.bottleX, 3, delta);
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      bottle.bottleY - 0.08 + heroPresence * 0.2 + float,
      3,
      delta
    );
    group.position.z = THREE.MathUtils.damp(group.position.z, bottle.bottleZ, 3, delta);
    group.scale.setScalar(
      THREE.MathUtils.damp(group.scale.x, active ? prominence * bottle.bottleScale : 0.82, 2.5, delta)
    );
  });

  const fallback = <ProceduralBottle reducedMotion={reducedMotion || tier === "low"} />;

  return (
    <e.group theatreKey="Hero Bottle" position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
      <group
        ref={groupRef}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => event.stopPropagation()}
      >
      <ModelBoundary fallback={fallback}>
        <Suspense fallback={fallback}>
          <GLBBottle />
          <BottleGlassHighlights />
          <AurenBottleLabel />
        </Suspense>
      </ModelBoundary>
      </group>
    </e.group>
  );
}

useGLTF.preload(aurenAssets.bottleModel);
