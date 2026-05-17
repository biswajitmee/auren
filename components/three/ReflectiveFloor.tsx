"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Reflector, type GLTF } from "three-stdlib";

import { theatreControls } from "@/components/three/TheatreControls";
import { aurenHeroPreset } from "@/lib/auren-hero-preset";
import { PerformanceTier } from "@/lib/detectPerformanceTier";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";
import { useScrollProgress } from "@/lib/useScrollProgress";

const FLOOR_MODEL_PATH = "/models/auren_fractured_floor.glb";
const REFLECTIVE_SURFACE_Y = 0.052;
const REFLECTIVE_SURFACE_SIZE: [number, number] = [11.8, 7.2];
const REFLECTOR_TINT = "#6F491D";

const realReflectionShader = {
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    uOpacity: { value: 0.72 },
    uIntensity: { value: 1.55 }
  },
  vertexShader: `
    uniform mat4 textureMatrix;

    varying vec2 vSurfaceUv;
    varying vec4 vReflectionUv;

    void main() {
      vSurfaceUv = uv;
      vReflectionUv = textureMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 color;
    uniform float uOpacity;
    uniform float uIntensity;

    varying vec2 vSurfaceUv;
    varying vec4 vReflectionUv;

    void main() {
      vec4 reflected = texture2DProj(tDiffuse, vReflectionUv);
      float luma = dot(reflected.rgb, vec3(0.2126, 0.7152, 0.0722));
      float sideFade = smoothstep(0.0, 0.08, vSurfaceUv.x) * smoothstep(1.0, 0.92, vSurfaceUv.x);
      float nearFade = smoothstep(0.02, 0.18, vSurfaceUv.y);
      float farFade = 1.0 - smoothstep(0.86, 1.0, vSurfaceUv.y);
      float reflectionMask = sideFade * nearFade * farFade;
      vec3 liftedReflection = pow(max(reflected.rgb, vec3(0.0)), vec3(0.74));
      float presence = smoothstep(0.008, 0.18, max(max(reflected.r, reflected.g), reflected.b));
      vec3 warmReflection = mix(
        liftedReflection + color * (0.018 + luma * 0.34),
        liftedReflection * color * 1.82 + color * luma * 0.42,
        0.38
      );
      float alpha = reflectionMask * uOpacity * clamp(0.1 + presence * 0.28 + luma * 1.36, 0.0, 0.92);

      gl_FragColor = vec4(warmReflection * uIntensity, alpha);
    }
  `
};

type ReflectiveFloorProps = {
  active?: boolean;
  tier: PerformanceTier;
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
  const gallerySceneReduced = useDesireGalleryScene((state) => state.sceneReduced);
  const groupRef = useRef<THREE.Group>(null);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const floorControls = useAurenSceneStore((state) => state.floor);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const tempColor = useMemo(() => new THREE.Color(), []);
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
      resolution: tier === "high" ? 1024 : tier === "medium" ? 640 : 384
    }),
    [tier]
  );
  const realReflector = useMemo(() => {
    const reflector = new Reflector(
      new THREE.PlaneGeometry(REFLECTIVE_SURFACE_SIZE[0], REFLECTIVE_SURFACE_SIZE[1]),
      {
        clipBias: 0.003,
        color: REFLECTOR_TINT,
        multisample: tier === "high" ? 4 : 0,
        shader: realReflectionShader,
        textureHeight: floorReflector.resolution,
        textureWidth: floorReflector.resolution
      }
    );
    const material = reflector.material as THREE.ShaderMaterial;

    reflector.position.set(0, REFLECTIVE_SURFACE_Y, 0);
    reflector.rotation.set(-Math.PI / 2, 0, 0);
    reflector.renderOrder = 6;
    reflector.receiveShadow = true;
    material.transparent = true;
    material.depthWrite = false;
    material.depthTest = true;
    material.blending = THREE.NormalBlending;
    material.side = THREE.DoubleSide;

    return reflector;
  }, [floorReflector.resolution, tier]);

  useEffect(
    () => () => {
      realReflector.geometry.dispose();
      realReflector.dispose();
    },
    [realReflector]
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

    realReflector.visible = floor.enabled && !gallerySceneReduced;
    realReflector.position.set(0, REFLECTIVE_SURFACE_Y, 0);
    realReflector.scale.setScalar(1);

    const realReflectionMaterial = realReflector.material as THREE.ShaderMaterial;
    realReflectionMaterial.uniforms.color.value.set(REFLECTOR_TINT);
    realReflectionMaterial.uniforms.uOpacity.value = THREE.MathUtils.clamp(
      0.78 *
        floor.reflectionIntensity *
        floor.reflectionStrength *
        environment.floorReflection *
        floor.atmosphereReflection,
      0,
      0.96
    );
    realReflectionMaterial.uniforms.uIntensity.value = THREE.MathUtils.clamp(
      1.62 + floor.reflectionIntensity * floor.reflectionStrength * 0.56,
      1,
      2.45
    );

    floorMaterials.slab.color.set(floor.color);
    floorMaterials.slab.roughness = Math.max(0.032, floor.roughness * 0.5);
    floorMaterials.slab.metalness = Math.min(0.62, floor.metalness * 0.7);
    floorMaterials.slab.clearcoatRoughness = Math.max(0.018, floor.roughness * 0.16);
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
      {gallerySceneReduced ? null : <primitive object={realReflector} />}
    </group>
  );
}

useGLTF.preload(FLOOR_MODEL_PATH);
