"use client";

import { Text, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";
import glassFragmentShader from "@/shaders/desireGlass.frag";
import glassVertexShader from "@/shaders/desireGlass.vert";
import imageFragmentShader from "@/shaders/desireImage.frag";
import imageVertexShader from "@/shaders/desireImage.vert";
import ringFragmentShader from "@/shaders/desireRing.frag";
import ringVertexShader from "@/shaders/desireRing.vert";

const CARD_WIDTH = 1.68;
const CARD_HEIGHT = 2.42;
const CARD_DEPTH = 0.09;
const CARD_RADIUS = 0.13;
const CARD_SPACING = 2.14;

const desireCards = [
  {
    title: "TOP NOTES",
    code: "01",
    image: "/desire-gallery/saffron-crocus.png",
    imageSize: [1.05, 0.74] as const,
    imagePosition: [-0.04, 0.12] as const,
    imageRotation: -0.17,
    accent: "#E7B45A",
    notes: ["BLACK SAFFRON", "SMOKED OUD", "BERGAMOT NOIR"]
  },
  {
    title: "HEART NOTES",
    code: "02",
    image: "/desire-gallery/black-rose.png",
    imageSize: [1.06, 0.94] as const,
    imagePosition: [0.02, 0.08] as const,
    imageRotation: 0.08,
    accent: "#D3A15A",
    notes: ["MIDNIGHT ROSE", "AMBER RESIN", "DARK JASMINE"]
  },
  {
    title: "BASE NOTES",
    code: "03",
    image: "/desire-gallery/taproot.png",
    imageSize: [0.88, 1.22] as const,
    imagePosition: [0.0, 0.05] as const,
    imageRotation: 0.16,
    accent: "#C99547",
    notes: ["VETIVER ROOTS", "SANDALWOOD", "MUSK ABSOLUTE"]
  },
  {
    title: "RESIN NOTES",
    code: "04",
    image: "/desire-gallery/black-rose.png",
    imageSize: [0.86, 0.78] as const,
    imagePosition: [-0.05, 0.08] as const,
    imageRotation: -0.1,
    accent: "#E5A44A",
    notes: ["LABDANUM", "BENZOIN", "AMBER SMOKE"]
  },
  {
    title: "OUD NOTES",
    code: "05",
    image: "/desire-gallery/taproot.png",
    imageSize: [0.78, 1.15] as const,
    imagePosition: [0.05, 0.06] as const,
    imageRotation: -0.2,
    accent: "#D9AF67",
    notes: ["OUD WOOD", "BLACK TEA", "MINERAL ASH"]
  }
] as const;

function roundedPanelGeometry(width: number, height: number, depth: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 8,
    bevelSize: 0.034,
    bevelThickness: 0.038,
    curveSegments: 20,
    steps: 1
  });

  geometry.center();
  geometry.computeVertexNormals();

  return geometry;
}

function GoldStrip({
  position,
  size,
  opacity = 0.52
}: {
  position: [number, number, number];
  size: [number, number];
  opacity?: number;
}) {
  return (
    <mesh position={position} renderOrder={9}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        blending={THREE.AdditiveBlending}
        color="#F0C975"
        depthTest={false}
        depthWrite={false}
        opacity={opacity}
        transparent
      />
    </mesh>
  );
}

function GlassPane({
  accent,
  opacityRef
}: {
  accent: string;
  opacityRef: MutableRefObject<number>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uAccent: { value: new THREE.Color(accent) },
      uOpacity: { value: 0 },
      uTime: { value: 0 }
    }),
    [accent]
  );

  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uOpacity.value = opacityRef.current * 0.72;
  });

  return (
    <mesh position={[0, 0, 0.062]} renderOrder={5}>
      <planeGeometry args={[CARD_WIDTH - 0.16, CARD_HEIGHT - 0.18, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        blending={THREE.NormalBlending}
        depthTest={false}
        depthWrite={false}
        fragmentShader={glassFragmentShader}
        side={THREE.DoubleSide}
        transparent
        uniforms={uniforms}
        vertexShader={glassVertexShader}
      />
    </mesh>
  );
}

function GlassShell({
  materialRef
}: {
  materialRef: MutableRefObject<THREE.MeshPhysicalMaterial | null>;
}) {
  const geometry = useMemo(
    () => roundedPanelGeometry(CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH, CARD_RADIUS),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh frustumCulled={false} renderOrder={3}>
      <primitive attach="geometry" object={geometry} />
      <meshPhysicalMaterial
        ref={materialRef}
        clearcoat={1}
        clearcoatRoughness={0.08}
        color="#F7D991"
        depthTest={false}
        depthWrite={false}
        emissive="#C48132"
        emissiveIntensity={0}
        envMapIntensity={1.8}
        metalness={0.18}
        opacity={0}
        roughness={0.08}
        side={THREE.DoubleSide}
        thickness={0.42}
        transmission={0.42}
        transparent
      />
    </mesh>
  );
}

function CardText({
  card
}: {
  card: (typeof desireCards)[number];
}) {
  return (
    <>
      <Text
        anchorX="center"
        anchorY="middle"
        color="#DDBE75"
        fontSize={0.064}
        letterSpacing={0.14}
        material-depthTest={false}
        material-transparent
        position={[0, 0.94, 0.125]}
        renderOrder={12}
      >
        {card.title}
      </Text>
      <Text
        anchorX="center"
        anchorY="middle"
        color="#CFAE69"
        fontSize={0.052}
        material-depthTest={false}
        material-transparent
        position={[-0.54, 0.94, 0.126]}
        renderOrder={12}
      >
        {card.code}
      </Text>
      {card.notes.map((note, noteIndex) => (
        <Text
          anchorX="left"
          anchorY="middle"
          color="#E6D6B0"
          fontSize={0.046}
          key={note}
          letterSpacing={0.08}
          material-depthTest={false}
          material-transparent
          position={[-0.52, -0.78 - noteIndex * 0.12, 0.125]}
          renderOrder={12}
        >
          {note}
        </Text>
      ))}
    </>
  );
}

function DesireCard({
  card,
  index,
  texture
}: {
  card: (typeof desireCards)[number];
  index: number;
  texture: THREE.Texture;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shellMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const imageMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const opacityRef = useRef(0);
  const scaleRef = useRef(0.92);
  const imageUniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uOpacity: { value: 0 },
      uTint: { value: new THREE.Color(card.accent) }
    }),
    [card.accent, texture]
  );

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const { progress, visible } = useDesireGalleryScene.getState();
    const trackSpan = Math.max(0, desireCards.length - 3) * CARD_SPACING;
    const targetX = (index - 1) * CARD_SPACING - progress * trackSpan;
    const centerDistance = Math.abs(targetX);
    const focus = 1 - Math.min(1, centerDistance / (CARD_SPACING * 1.6));
    const rangeFade = 1 - THREE.MathUtils.smoothstep(centerDistance, 2.9, 3.72);
    const targetOpacity = visible ? rangeFade * (0.42 + focus * 0.58) : 0;

    opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 4.8, delta);
    scaleRef.current = THREE.MathUtils.damp(scaleRef.current, 0.9 + focus * 0.12, 4.2, delta);
    group.visible = opacityRef.current > 0.012;

    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 5.8, delta);
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      Math.sin(state.clock.elapsedTime * 0.46 + index * 1.3) * 0.026,
      3.8,
      delta
    );
    group.position.z = THREE.MathUtils.damp(group.position.z, -centerDistance * 0.045, 4, delta);
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      THREE.MathUtils.clamp(-targetX * 0.12, -0.26, 0.26),
      4.4,
      delta
    );
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, targetX * 0.018, 4.2, delta);
    group.scale.setScalar(scaleRef.current);

    if (shellMaterialRef.current) {
      shellMaterialRef.current.opacity = opacityRef.current * (0.09 + focus * 0.12);
      shellMaterialRef.current.emissiveIntensity = opacityRef.current * (0.12 + focus * 0.18);
    }

    if (imageMaterialRef.current) {
      imageMaterialRef.current.uniforms.uOpacity.value = opacityRef.current * (0.78 + focus * 0.22);
    }

    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = opacityRef.current * (0.035 + focus * 0.08);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <GlassShell materialRef={shellMaterialRef} />
      <GlassPane accent={card.accent} opacityRef={opacityRef} />

      <mesh position={[0, 0.06, 0.074]} renderOrder={6}>
        <planeGeometry args={[CARD_WIDTH - 0.42, CARD_HEIGHT - 0.62]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          blending={THREE.AdditiveBlending}
          color={card.accent}
          depthTest={false}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>

      <mesh
        position={[card.imagePosition[0], card.imagePosition[1], 0.118]}
        renderOrder={11}
        rotation={[0, 0, card.imageRotation]}
      >
        <planeGeometry args={[card.imageSize[0], card.imageSize[1]]} />
        <shaderMaterial
          ref={imageMaterialRef}
          blending={THREE.NormalBlending}
          depthTest={false}
          depthWrite={false}
          fragmentShader={imageFragmentShader}
          side={THREE.DoubleSide}
          transparent
          uniforms={imageUniforms}
          vertexShader={imageVertexShader}
        />
      </mesh>

      <GoldStrip position={[0, CARD_HEIGHT / 2 - 0.18, 0.128]} size={[CARD_WIDTH - 0.46, 0.006]} />
      <GoldStrip position={[0, -CARD_HEIGHT / 2 + 0.22, 0.128]} size={[CARD_WIDTH - 0.5, 0.006]} />
      <GoldStrip
        opacity={0.36}
        position={[-CARD_WIDTH / 2 + 0.18, 0, 0.128]}
        size={[0.006, CARD_HEIGHT - 0.54]}
      />
      <GoldStrip
        opacity={0.36}
        position={[CARD_WIDTH / 2 - 0.18, 0, 0.128]}
        size={[0.006, CARD_HEIGHT - 0.54]}
      />
      <GoldStrip position={[0, CARD_HEIGHT / 2 + 0.018, 0.13]} size={[0.38, 0.012]} opacity={0.82} />
      <GoldStrip position={[0, -CARD_HEIGHT / 2 - 0.018, 0.13]} size={[0.34, 0.012]} opacity={0.66} />

      <CardText card={card} />
    </group>
  );
}

function DesireGalleryRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const opacityRef = useRef(0);
  const uniforms = useMemo(
    () => ({
      uAccent: { value: new THREE.Color("#D9A950") },
      uOpacity: { value: 0 },
      uProgress: { value: 0 },
      uTime: { value: 0 }
    }),
    []
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;

    if (!mesh || !material) {
      return;
    }

    const { progress, visible } = useDesireGalleryScene.getState();

    opacityRef.current = THREE.MathUtils.damp(opacityRef.current, visible ? 1 : 0, 3.2, delta);
    mesh.visible = opacityRef.current > 0.015;
    mesh.rotation.z = state.clock.elapsedTime * 0.035;
    material.uniforms.uOpacity.value = opacityRef.current;
    material.uniforms.uProgress.value = progress;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, -1.42, -0.42]}
      renderOrder={1}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    >
      <ringGeometry args={[1.35, 2.62, 192, 1]} />
      <shaderMaterial
        ref={materialRef}
        blending={THREE.AdditiveBlending}
        depthTest={false}
        depthWrite={false}
        fragmentShader={ringFragmentShader}
        side={THREE.DoubleSide}
        transparent
        uniforms={uniforms}
        vertexShader={ringVertexShader}
      />
    </mesh>
  );
}

export function DesireGlassGallery() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const forward = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const textures = useTexture(desireCards.map((card) => card.image)) as THREE.Texture[];

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    });
  }, [textures]);

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const distance = size.width < 760 ? 6.18 : 5.92;

    camera.getWorldDirection(forward);
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    target.copy(camera.position).addScaledVector(forward, distance).addScaledVector(up, 0.02);

    group.position.lerp(target, 1 - Math.exp(-delta * 10));
    group.quaternion.slerp(camera.quaternion, 1 - Math.exp(-delta * 12));

    const fov = THREE.MathUtils.degToRad(perspectiveCamera.fov);
    const viewHeight = (2 * Math.tan(fov / 2) * distance) / Math.max(0.001, perspectiveCamera.zoom);
    const viewWidth = viewHeight * (size.width / Math.max(1, size.height));
    const targetScale =
      size.width < 760
        ? Math.max(0.5, Math.min(0.72, viewWidth / 3.1))
        : Math.max(0.82, Math.min(1, viewWidth / 6.05));

    group.scale.setScalar(THREE.MathUtils.damp(group.scale.x, targetScale, 5.5, delta));
  });

  return (
    <group ref={groupRef}>
      <DesireGalleryRing />
      {desireCards.map((card, index) => (
        <DesireCard card={card} index={index} key={card.code} texture={textures[index]} />
      ))}
    </group>
  );
}

desireCards.forEach((card) => useTexture.preload(card.image));
