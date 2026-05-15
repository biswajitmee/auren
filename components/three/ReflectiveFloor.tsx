"use client";

import { MeshReflectorMaterial, useGLTF } from "@react-three/drei";
import type { MeshReflectorMaterial as MeshReflectorMaterialImpl } from "@react-three/drei/materials/MeshReflectorMaterial";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { theatreControls } from "@/components/three/TheatreControls";
import { aurenHeroPreset } from "@/lib/auren-hero-preset";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";
import { useScrollProgress } from "@/lib/useScrollProgress";

const FLOOR_MODEL_PATH = "/models/auren_fractured_floor.glb";
const BOTTLE_MODEL_PATH = "/models/auren-bottle-2.glb";
const REFLECTIVE_SURFACE_Y = 0.018;
const REFLECTIVE_SURFACE_SIZE: [number, number] = [10.6, 6.4];
const REFLECTOR_TINT = "#2A1C0B";
const HERO_BOTTLE_WORLD_POSITION = { x: 0, y: -0.69, z: 1.24 };
const HERO_BOTTLE_ROTATION: [number, number, number] = [0.51, 0.48, -0.16];

const projectedReflectionVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const projectedReflectionFragment = `
  uniform float uOpacity;
  uniform vec3 uGoldColor;
  uniform vec3 uShadowColor;

  varying vec2 vUv;

  float softBox(vec2 uv, vec2 center, vec2 halfSize, vec2 softness) {
    vec2 d = abs(uv - center) - halfSize;
    vec2 edge = 1.0 - smoothstep(vec2(0.0), softness, max(d, 0.0));
    return edge.x * edge.y;
  }

  void main() {
    vec2 uv = vUv;
    float center = abs(uv.x - 0.5);
    float floorFade = smoothstep(0.12, 0.66, uv.y);
    float rearFade = 1.0 - smoothstep(0.93, 1.0, uv.y);
    float distanceFade = floorFade * rearFade;

    float body = softBox(uv, vec2(0.5, 0.56), vec2(0.2, 0.25), vec2(0.18, 0.18));
    float neck = softBox(uv, vec2(0.5, 0.78), vec2(0.075, 0.09), vec2(0.1, 0.1));
    float cap = softBox(uv, vec2(0.5, 0.88), vec2(0.18, 0.065), vec2(0.13, 0.085));
    float centerStreak = exp(-center * center * 72.0) * floorFade * rearFade;
    float baseFlash = exp(-pow((uv.y - 0.66) * 7.2, 2.0)) * exp(-center * center * 24.0);
    float edgeGlint = smoothstep(0.22, 0.03, abs(center - 0.23)) * body * 0.42;
    float silhouette = body * 0.38 + neck * 0.24 + cap * 0.28;
    float glow = centerStreak * 0.42 + baseFlash * 0.5 + edgeGlint;
    float alpha = (silhouette + glow) * distanceFade * uOpacity;
    vec3 color = mix(uShadowColor, uGoldColor, clamp(glow + edgeGlint * 1.4, 0.0, 1.0));

    gl_FragColor = vec4(color, alpha);
  }
`;

type ReflectiveFloorProps = {
  active?: boolean;
  tier: PerformanceTier;
};

type BottleGLTFResult = GLTF & {
  nodes: {
    textd: THREE.Mesh;
    Plane: THREE.Mesh;
    Cube_Material001_0: THREE.Mesh;
  };
};

function isMesh(object: THREE.Object3D): object is THREE.Mesh {
  return (object as THREE.Mesh).isMesh;
}

function isCrackMaterial(material: THREE.Material) {
  const name = material.name.toLowerCase();
  return name.includes("crack") || name.includes("gold") || name.includes("edge");
}

export function ReflectiveFloor({ active = true, tier }: ReflectiveFloorProps) {
  const { scene } = useGLTF(FLOOR_MODEL_PATH) as GLTF;
  const { nodes: bottleNodes } = useGLTF(BOTTLE_MODEL_PATH) as unknown as BottleGLTFResult;
  const gallerySceneReduced = useDesireGalleryScene((state) => state.sceneReduced);
  const groupRef = useRef<THREE.Group>(null);
  const reflectionMirrorRef = useRef<THREE.Group>(null);
  const reflectedBottleRef = useRef<THREE.Group>(null);
  const projectedReflectionRef = useRef<THREE.Mesh>(null);
  const reflectorRef = useRef<MeshReflectorMaterialImpl>(null);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const floorControls = useAurenSceneStore((state) => state.floor);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const reflectionMaterials = useMemo(
    () => ({
      body: new THREE.MeshBasicMaterial({
        color: "#D3A455",
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        toneMapped: false
      }),
      detail: new THREE.MeshBasicMaterial({
        color: "#F0CF82",
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        toneMapped: false
      }),
      shadow: new THREE.MeshBasicMaterial({
        color: "#2B1608",
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
        toneMapped: false
      })
    }),
    []
  );
  const projectedReflectionMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: projectedReflectionVertex,
        fragmentShader: projectedReflectionFragment,
        uniforms: {
          uOpacity: { value: 0.9 },
          uGoldColor: { value: new THREE.Color("#F0BD62") },
          uShadowColor: { value: new THREE.Color("#2A1608") }
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      }),
    []
  );
  const floorMaterials = useMemo(
    () => ({
      crackEdge: new THREE.MeshPhysicalMaterial({
        color: "#5F3B14",
        emissive: "#D99A3A",
        emissiveIntensity: 0.18,
        metalness: 0.18,
        roughness: 0.34,
        clearcoat: 0.72,
        clearcoatRoughness: 0.18,
        envMapIntensity: 1.35
      }),
      slab: new THREE.MeshPhysicalMaterial({
        color: "#050403",
        metalness: 0.24,
        roughness: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.055,
        reflectivity: 1,
        specularColor: "#E6BF64",
        specularIntensity: 1.18,
        envMapIntensity: 1.72
      })
    }),
    []
  );
  const floorScene = useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.traverse((object) => {
      if (!isMesh(object)) {
        return;
      }

      object.castShadow = false;
      object.receiveShadow = true;
      object.renderOrder = 1;
      object.frustumCulled = false;

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) =>
          isCrackMaterial(material) ? floorMaterials.crackEdge : floorMaterials.slab
        );
        return;
      }

      object.material = isCrackMaterial(object.material)
        ? floorMaterials.crackEdge
        : floorMaterials.slab;
    });

    return clonedScene;
  }, [floorMaterials, scene]);

  const floorReflector = useMemo(
    () => ({
      blur: tier === "high" ? ([260, 90] as [number, number]) : ([180, 70] as [number, number]),
      resolution: tier === "high" ? 768 : 384
    }),
    [tier]
  );

  useFrame(() => {
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
          metalness: aurenHeroPreset.floor.floorMetalness,
          blur: aurenHeroPreset.floor.floorBlur,
          color: aurenHeroPreset.floor.floorBaseColor,
          veinColor: aurenHeroPreset.floor.floorVeinColor,
          veinOpacity: aurenHeroPreset.floor.floorVeinIntensity * theatreFloor.veinOpacity,
          hotspotStrength: aurenHeroPreset.floor.floorHotspotStrength,
          hotspotRadius: aurenHeroPreset.floor.floorHotspotRadius,
          atmosphereReflection: aurenHeroPreset.floor.floorAtmosphereReflection,
          reflectionStrength: aurenHeroPreset.floor.reflectionStrength,
          enabled: aurenHeroPreset.floor.floorEnabled
        };
    const hero = 1 - THREE.MathUtils.smoothstep(progress, 0.16, 0.54);

    if (groupRef.current) {
      groupRef.current.visible = floor.enabled;
      groupRef.current.position.set(floor.position.x, floor.position.y, floor.position.z);
      groupRef.current.rotation.set(floor.rotation.x, floor.rotation.y, floor.rotation.z);
      groupRef.current.scale.set(floor.scale.x, floor.scale.y, floor.scale.z);
    }

    if (reflectionMirrorRef.current && reflectedBottleRef.current) {
      reflectionMirrorRef.current.visible = floor.enabled && !gallerySceneReduced;
      reflectionMirrorRef.current.scale.set(
        1 / Math.max(0.001, Math.abs(floor.scale.x)),
        -0.66 / Math.max(0.001, Math.abs(floor.scale.y)),
        1 / Math.max(0.001, Math.abs(floor.scale.z))
      );
      reflectedBottleRef.current.position.set(
        HERO_BOTTLE_WORLD_POSITION.x - floor.position.x,
        HERO_BOTTLE_WORLD_POSITION.y - floor.position.y,
        HERO_BOTTLE_WORLD_POSITION.z - floor.position.z
      );
    }

    if (projectedReflectionRef.current) {
      projectedReflectionRef.current.visible = floor.enabled && !gallerySceneReduced;
      projectedReflectionRef.current.position.set(
        (HERO_BOTTLE_WORLD_POSITION.x - floor.position.x) /
          Math.max(0.001, Math.abs(floor.scale.x)),
        0.24,
        (HERO_BOTTLE_WORLD_POSITION.z + 0.08 - floor.position.z) /
          Math.max(0.001, Math.abs(floor.scale.z))
      );
      projectedReflectionRef.current.scale.set(
        1 / Math.max(0.001, Math.abs(floor.scale.x)),
        1 / Math.max(0.001, Math.abs(floor.scale.z)),
        1
      );
    }

    if (reflectorRef.current) {
      reflectorRef.current.roughness = Math.max(0.035, floor.roughness * 0.42);
      reflectorRef.current.metalness = floor.metalness;
      reflectorRef.current.color.set(REFLECTOR_TINT);
      reflectorRef.current.mixBlur = Math.max(0.08, floor.blur * 0.32);
      reflectorRef.current.mixStrength =
        (tier === "high" ? 5.2 : 3.4) *
        floor.reflectionIntensity *
        floor.reflectionStrength *
        environment.floorReflection *
        floor.atmosphereReflection;
      reflectorRef.current.mirror = THREE.MathUtils.clamp(
        0.94 * floor.reflectionIntensity * floor.reflectionStrength,
        0,
        1
      );
      reflectorRef.current.opacity = THREE.MathUtils.clamp(
        0.46 + floor.reflectionIntensity * 0.12,
        0.42,
        0.7
      );
    }

    const reflectedBottleStrength = THREE.MathUtils.clamp(
      hero * floor.reflectionIntensity * floor.reflectionStrength * environment.floorReflection,
      0,
      2.2
    );
    reflectionMaterials.shadow.opacity = 0.12 * reflectedBottleStrength;
    reflectionMaterials.body.opacity = 0.16 * reflectedBottleStrength;
    reflectionMaterials.detail.opacity = 0.2 * reflectedBottleStrength;
    projectedReflectionMaterial.uniforms.uOpacity.value = THREE.MathUtils.clamp(
      0.42 * reflectedBottleStrength,
      0,
      0.9
    );

    floorMaterials.slab.color.set(floor.color);
    floorMaterials.slab.roughness = Math.max(0.055, floor.roughness * 0.78);
    floorMaterials.slab.metalness = Math.min(0.52, floor.metalness * 0.56);
    floorMaterials.slab.clearcoatRoughness = Math.max(0.035, floor.roughness * 0.32);
    floorMaterials.slab.envMapIntensity =
      (1.28 + floor.reflectionIntensity * 0.42) * environment.floorReflection;

    tempColor.set(floor.veinColor);
    floorMaterials.crackEdge.color.copy(tempColor).multiplyScalar(0.44);
    floorMaterials.crackEdge.emissive.copy(tempColor);
    floorMaterials.crackEdge.emissiveIntensity =
      (tier === "low" ? 0.08 : 0.16) +
      hero * floor.veinOpacity * floor.hotspotStrength * environment.amberGlow * 0.18;
    floorMaterials.crackEdge.roughness = Math.max(0.18, floor.roughness * 1.15);
    floorMaterials.crackEdge.envMapIntensity = 1.08 + floor.atmosphereReflection * 0.38;
  });

  return (
    <group position={[0, -1.42, 0]} ref={groupRef} visible={active}>
      <primitive object={floorScene} />
      <group ref={reflectionMirrorRef} renderOrder={2}>
        <group ref={reflectedBottleRef} rotation={HERO_BOTTLE_ROTATION}>
          <mesh
            geometry={bottleNodes.textd.geometry}
            material={reflectionMaterials.detail}
            position={[0.414, 0.875, 0.314]}
            renderOrder={2}
            rotation={[1.527, 0.009, 0.011]}
            scale={0.073}
          />
          <mesh
            geometry={bottleNodes.Plane.geometry}
            material={reflectionMaterials.detail}
            position={[0.401, 0.835, 0.242]}
            renderOrder={2}
            rotation={[1.572, -0.007, 0.02]}
            scale={[0.446, 2.464, 0.323]}
          />
          <group scale={0.01}>
            <group
              position={[0, 121.172, 0]}
              rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
              scale={25.346}
            >
              <mesh
                geometry={bottleNodes.Cube_Material001_0.geometry}
                material={reflectionMaterials.shadow}
                position={[0.06, 1.631, -0.881]}
                renderOrder={2}
              />
              <mesh
                geometry={bottleNodes.Cube_Material001_0.geometry}
                material={reflectionMaterials.body}
                position={[0.06, 1.631, -0.881]}
                renderOrder={2}
                scale={[1.035, 1, 1.035]}
              />
            </group>
          </group>
        </group>
      </group>
      <mesh
        ref={projectedReflectionRef}
        renderOrder={4}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.75, 2.25]} />
        <primitive attach="material" object={projectedReflectionMaterial} />
      </mesh>
      {tier === "low" || gallerySceneReduced ? null : (
        <mesh
          position={[0, REFLECTIVE_SURFACE_Y, 0]}
          receiveShadow
          renderOrder={3}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={REFLECTIVE_SURFACE_SIZE} />
          <MeshReflectorMaterial
            blur={floorReflector.blur}
            color={REFLECTOR_TINT}
            depthScale={0}
            depthToBlurRatioBias={0}
            metalness={aurenHeroPreset.floor.floorMetalness}
            mirror={0.96}
            mixBlur={0.18}
            mixStrength={tier === "high" ? 5.2 : 3.4}
            opacity={0.58}
            ref={reflectorRef}
            resolution={floorReflector.resolution}
            roughness={aurenHeroPreset.floor.floorRoughness}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload(FLOOR_MODEL_PATH);
useGLTF.preload(BOTTLE_MODEL_PATH);
