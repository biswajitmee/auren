"use client";

import { Text, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";
import imageFragmentShader from "@/shaders/desireImage.frag";
import imageVertexShader from "@/shaders/desireImage.vert";
import ringFragmentShader from "@/shaders/desireRing.frag";
import ringVertexShader from "@/shaders/desireRing.vert";

const CARD_SHELL_PATH = "/models/luxury_gallery_card_shell.glb";
const CARD_SPACING = 2.14;
const MOBILE_HORIZONTAL_SCROLL_SPEED = 3;
const SHELL_DISPLAY_SCALE = 0.60;
const SHELL_DEPTH_SCALE = 0.82;
const SHELL_FRONT_Z = 0.16 * SHELL_DEPTH_SCALE * 0.5;
const CONTENT_Z = SHELL_FRONT_Z + 0.026;
const TEXT_Z = SHELL_FRONT_Z + 0.034;
const HIT_PLANE_Z = SHELL_FRONT_Z + 0.07;
const GLOW_PLANE_Z = -SHELL_FRONT_Z - 0.03;
const CLICK_MOVE_TOLERANCE = 8;
const DETAIL_TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever";

const galleryCards = [
  {
    title: "TOP NOTES",
    index: "01",
    sideLabel: "SAFFRON",
    bottomLabel: "BRIGHT \u00b7 SPICE \u00b7 LUMINOUS",
    image: "/desire-gallery/saffron-crocus.png",
    imageSize: [1.72, 1.18] as const,
    imagePosition: [-0.04, -0.18] as const,
    imageRotation: -0.12,
    detailNotes: [
      "A bright saffron spark opens the ritual with polished spice.",
      "Solar citrus keeps the first impression sharp and luminous.",
      "Thin gold facets frame the image before the heart unfolds.",
      DETAIL_TEXT
    ],
    accent: "#E7B45A"
  },
  {
    title: "HEART NOTES",
    index: "02",
    sideLabel: "MIDNIGHT ROSE",
    bottomLabel: "FLORAL \u00b7 RICH \u00b7 MYSTERIOUS",
    image: "/desire-gallery/black-rose.png",
    imageSize: [1.82, 1.62] as const,
    imagePosition: [0, -0.12] as const,
    imageRotation: 0.03,
    detailNotes: [
      "Midnight rose moves through the center with velvet density.",
      "Dark petals sit close to the skin, rich but never sweet.",
      "The floral heart is cut by smoke and soft mineral shadow.",
      DETAIL_TEXT
    ],
    accent: "#D3A15A"
  },
  {
    title: "BASE NOTES",
    index: "03",
    sideLabel: "VETIVER",
    bottomLabel: "WOODY \u00b7 EARTHY \u00b7 ENDURING",
    image: "/desire-gallery/taproot.png",
    imageSize: [1.38, 1.92] as const,
    imagePosition: [0.02, -0.16] as const,
    imageRotation: 0.08,
    detailNotes: [
      DETAIL_TEXT,
      DETAIL_TEXT,
      DETAIL_TEXT,
      DETAIL_TEXT
    ],
    accent: "#C99547"
  },
  {
    title: "RESIN NOTES",
    index: "04",
    sideLabel: "LABDANUM",
    bottomLabel: "LABDANUM \u00b7 BENZOIN \u00b7 AMBER SMOKE",
    image: "/desire-gallery/black-rose.png",
    imageSize: [1.36, 1.22] as const,
    imagePosition: [-0.04, -0.12] as const,
    imageRotation: -0.1,
    detailNotes: [
      "Labdanum folds the composition into amber smoke.",
      "Benzoin gives the resin accord a slow, balsamic warmth.",
      "The surface stays dark and glossy, like varnished wood.",
      DETAIL_TEXT
    ],
    accent: "#E5A44A"
  },
  {
    title: "OUD NOTES",
    index: "05",
    sideLabel: "OUD WOOD",
    bottomLabel: "OUD WOOD \u00b7 BLACK TEA \u00b7 MINERAL ASH",
    image: "/desire-gallery/taproot.png",
    imageSize: [1.22, 1.76] as const,
    imagePosition: [0.03, -0.14] as const,
    imageRotation: -0.14,
    detailNotes: [
      "Oud wood deepens the finish with a dry ceremonial edge.",
      "Black tea and ash give the base a mineral restraint.",
      "The final trail is smoky, textured, and deliberately close.",
      DETAIL_TEXT
    ],
    accent: "#D9AF67"
  }
] as const;

type LuxuryGalleryCardProps = {
  title: string;
  index: string;
  sideLabel: string;
  bottomLabel: string;
  image: string;
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: number;
  isCenter: boolean;
  accent?: string;
  imageSize?: readonly [number, number];
  imagePosition?: readonly [number, number];
  imageRotation?: number;
  detailNotes: readonly string[];
  trackIndex?: number;
};

function cloneAndTuneShell(scene: THREE.Group) {
  const clone = scene.clone(true);

  clone.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) {
      return;
    }

    object.castShadow = true;
    object.receiveShadow = true;
    object.frustumCulled = false;
    const objectSignature = object.name.toLowerCase();
    object.renderOrder =
      objectSignature.includes("ornament") || objectSignature.includes("border")
        ? 8
        : objectSignature.includes("frame")
          ? 7
          : objectSignature.includes("back")
            ? 3
            : 4;

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    const tunedMaterials = materials.map((sourceMaterial) => {
      const material = sourceMaterial.clone();
      const signature = `${object.name} ${material.name}`.toLowerCase();

      if (
        material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhysicalMaterial
      ) {
        material.side = THREE.FrontSide;
        material.toneMapped = true;

        if (
          signature.includes("gold") ||
          signature.includes("frame") ||
          signature.includes("border") ||
          signature.includes("ornament") ||
          signature.includes("linework")
        ) {
          const isFineLine =
            signature.includes("border") ||
            signature.includes("ornament") ||
            signature.includes("linework");

          material.color.set(isFineLine ? "#D4B46E" : "#C7A365");
          material.metalness = isFineLine ? 0.82 : 0.9;
          material.roughness = isFineLine ? 0.36 : 0.42;
          material.envMapIntensity = isFineLine ? 0.36 : 0.48;
          material.emissive.set("#000000");
          material.emissiveIntensity = isFineLine ? 0.018 : 0;
          material.opacity = 1;
          material.transparent = true;
          material.depthWrite = true;
          material.userData.baseOpacity = 1;
        } else if (signature.includes("back") || signature.includes("plate")) {
          material.color.set("#060504");
          material.metalness = 0;
          material.roughness = 0.52;
          material.envMapIntensity = 0.12;
          material.opacity = 0.82;
          material.transparent = true;
          material.depthWrite = true;
          material.userData.baseOpacity = 0.82;
        } else {
          material.color.set("#090705");
          material.metalness = 0;
          material.roughness = 0.42;
          material.envMapIntensity = 0.18;
          material.opacity = 0.54;
          material.transparent = true;
          material.depthWrite = false;
          material.userData.baseOpacity = 0.54;

          if (material instanceof THREE.MeshPhysicalMaterial) {
            material.transmission = 0.02;
            material.ior = 1.48;
            material.thickness = 0.12;
            material.clearcoat = 0.22;
            material.clearcoatRoughness = 0.38;
          }
        }

        material.needsUpdate = true;
      }

      return material;
    });

    object.material = Array.isArray(object.material) ? tunedMaterials : tunedMaterials[0];
  });

  return clone;
}

function setShellOpacity(shell: THREE.Group, opacity: number, focus: number) {
  const focusBoost = 0.62 + focus * 0.38;

  shell.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) {
      return;
    }

    const materials = Array.isArray(object.material) ? object.material : [object.material];

    materials.forEach((material) => {
      if (
        material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhysicalMaterial
      ) {
        material.opacity = (material.userData.baseOpacity ?? 1) * opacity * focusBoost;
      }
    });
  });
}

function CardLine({
  position,
  size,
  opacity = 0.48
}: {
  position: [number, number, number];
  size: [number, number];
  opacity?: number;
}) {
  return (
    <mesh position={position} renderOrder={15}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        blending={THREE.NormalBlending}
        color="#D9B86E"
        depthTest={false}
        depthWrite={false}
        opacity={opacity}
        transparent
      />
    </mesh>
  );
}

function AnimatedLineSegment({
  delay = 0,
  end,
  opacity = 0.78,
  progress,
  start,
  thickness = 0.01,
  z = TEXT_Z + 0.06
}: {
  delay?: number;
  end: readonly [number, number];
  opacity?: number;
  progress: number;
  start: readonly [number, number];
  thickness?: number;
  z?: number;
}) {
  const draw = THREE.MathUtils.smoothstep(progress, delay, delay + 0.22);
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.max(0.001, Math.hypot(dx, dy));

  if (draw <= 0.002) {
    return null;
  }

  return (
    <mesh
      position={[start[0] + dx * draw * 0.5, start[1] + dy * draw * 0.5, z]}
      renderOrder={31}
      rotation={[0, 0, Math.atan2(dy, dx)]}
      scale={[length * draw, thickness, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        blending={THREE.NormalBlending}
        color="#F5F0E8"
        depthTest={false}
        depthWrite={false}
        opacity={opacity * draw}
        transparent
      />
    </mesh>
  );
}

function TypedCalloutText({
  anchorX = "left",
  delay,
  maxWidth = 1.22,
  position,
  progress,
  text
}: {
  anchorX?: "center" | "left" | "right";
  delay: number;
  maxWidth?: number;
  position: readonly [number, number, number];
  progress: number;
  text: string;
}) {
  const reveal = THREE.MathUtils.smoothstep(progress, delay, delay + 0.46);
  const typedText = text.slice(0, Math.floor(text.length * reveal));

  return (
    <Text
      anchorX={anchorX}
      anchorY="top"
      color="#F5F0E8"
      fontSize={0.118}
      lineHeight={1.08}
      material-depthTest={false}
      material-depthWrite={false}
      material-opacity={Math.min(1, reveal * 1.25)}
      material-transparent
      maxWidth={maxWidth}
      position={position}
      renderOrder={34}
    >
      {typedText}
    </Text>
  );
}

function CardDetailOverlay({
  active,
  closeHitRef,
  notes
}: {
  active: boolean;
  closeHitRef: MutableRefObject<THREE.Mesh | null>;
  notes: readonly string[];
}) {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const z = TEXT_Z + 0.07;
  const calloutNotes =
    notes.length >= 4 ? notes : [DETAIL_TEXT, DETAIL_TEXT, DETAIL_TEXT, DETAIL_TEXT];

  useFrame((_, delta) => {
    const nextProgress = THREE.MathUtils.damp(progressRef.current, active ? 1 : 0, 5.2, delta);

    progressRef.current = nextProgress;
    setProgress((currentProgress) =>
      Math.abs(currentProgress - nextProgress) > 0.018 ? nextProgress : currentProgress
    );
  });

  if (!active && progress < 0.02) {
    return null;
  }

  return (
    <group>
      <mesh ref={closeHitRef} position={[1.28, 1.84, z + 0.02]} renderOrder={42} visible={active}>
        <planeGeometry args={[0.54, 0.54]} />
        <meshBasicMaterial
          color="#000000"
          depthTest={false}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>

      <mesh position={[1.28, 1.84, z + 0.01]} renderOrder={41} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.31, 0.016]} />
        <meshBasicMaterial
          color="#F3D58A"
          depthTest={false}
          depthWrite={false}
          opacity={THREE.MathUtils.smoothstep(progress, 0.1, 0.32)}
          transparent
        />
      </mesh>
      <mesh position={[1.28, 1.84, z + 0.01]} renderOrder={41} rotation={[0, 0, -Math.PI / 4]}>
        <planeGeometry args={[0.31, 0.016]} />
        <meshBasicMaterial
          color="#F3D58A"
          depthTest={false}
          depthWrite={false}
          opacity={THREE.MathUtils.smoothstep(progress, 0.14, 0.36)}
          transparent
        />
      </mesh>

      <AnimatedLineSegment
        delay={0.04}
        end={[1.04, 1.43]}
        opacity={0.7}
        progress={progress}
        start={[-1.04, 1.43]}
        thickness={0.012}
        z={z}
      />
      <AnimatedLineSegment
        delay={0.08}
        end={[-2.04, 0.95]}
        progress={progress}
        start={[-1.1, 0.95]}
        z={z}
      />
      <AnimatedLineSegment
        delay={0.16}
        end={[-2.72, 1.15]}
        progress={progress}
        start={[-2.04, 0.95]}
        z={z}
      />
      <AnimatedLineSegment
        delay={0.18}
        end={[-1.54, -1.28]}
        progress={progress}
        start={[-0.52, -0.52]}
        z={z}
      />
      <AnimatedLineSegment
        delay={0.26}
        end={[-2.72, -1.28]}
        progress={progress}
        start={[-1.54, -1.28]}
        z={z}
      />
      <AnimatedLineSegment
        delay={0.22}
        end={[1.72, 1.74]}
        progress={progress}
        start={[0.84, 0.76]}
        z={z}
      />
      <AnimatedLineSegment
        delay={0.3}
        end={[2.58, 1.74]}
        progress={progress}
        start={[1.72, 1.74]}
        z={z}
      />
      <AnimatedLineSegment
        delay={0.28}
        end={[1.82, -1.04]}
        progress={progress}
        start={[0.42, -0.1]}
        z={z}
      />
      <AnimatedLineSegment
        delay={0.36}
        end={[2.58, -1.04]}
        progress={progress}
        start={[1.82, -1.04]}
        z={z}
      />

      <TypedCalloutText
        delay={0.34}
        maxWidth={1.34}
        position={[-3.5, 1.36, z + 0.01]}
        progress={progress}
        text={calloutNotes[0]}
      />
      <TypedCalloutText
        delay={0.46}
        maxWidth={1.34}
        position={[-3.5, -1.08, z + 0.01]}
        progress={progress}
        text={calloutNotes[1]}
      />
      <TypedCalloutText
        delay={0.58}
        maxWidth={1.34}
        position={[2.74, 1.98, z + 0.01]}
        progress={progress}
        text={calloutNotes[2]}
      />
      <TypedCalloutText
        delay={0.7}
        maxWidth={1.34}
        position={[2.74, -0.78, z + 0.01]}
        progress={progress}
        text={calloutNotes[3]}
      />
    </group>
  );
}

export function LuxuryGalleryCard({
  title,
  index,
  sideLabel,
  bottomLabel,
  image,
  position,
  rotation,
  scale,
  isCenter,
  accent = "#D9A950",
  imageSize = [1.6, 1.4],
  imagePosition = [0, -0.12],
  imageRotation = 0,
  detailNotes,
  trackIndex = 0
}: LuxuryGalleryCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hitPlaneRef = useRef<THREE.Mesh>(null);
  const closeHitPlaneRef = useRef<THREE.Mesh>(null);
  const imageMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const pendingPointerActionRef = useRef<{
    kind: "card" | "close";
    x: number;
    y: number;
  } | null>(null);
  const hoverTiltRef = useRef(0);
  const hoverTargetRef = useRef(0);
  const interactionRotationRef = useRef(0);
  const opacityRef = useRef(0);
  const progressRef = useRef(0);
  const scaleRef = useRef(0.92);
  const detailCardIndex = useDesireGalleryScene((state) => state.detailCardIndex);
  const isDetailSelected = detailCardIndex === trackIndex;
  const { camera, size } = useThree();
  const { scene } = useGLTF(CARD_SHELL_PATH) as GLTF;
  const texture = useTexture(image) as THREE.Texture;
  const pointerNdc = useMemo(() => new THREE.Vector2(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const shell = useMemo(() => cloneAndTuneShell(scene), [scene]);
  const imageUniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uOpacity: { value: 0 },
      uTint: { value: new THREE.Color(accent) }
    }),
    [accent, texture]
  );

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 2;
    texture.needsUpdate = true;
  }, [texture]);

  useEffect(() => {
    const getMeshHit = (event: PointerEvent, mesh: THREE.Mesh | null) => {
      const { visible } = useDesireGalleryScene.getState();

      if (!mesh || !visible || opacityRef.current < 0.08) {
        return null;
      }

      pointerNdc.set(
        (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1,
        -(event.clientY / Math.max(1, window.innerHeight)) * 2 + 1
      );
      raycaster.setFromCamera(pointerNdc, camera);

      return raycaster.intersectObject(mesh, false)[0] ?? null;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      const { detailCardIndex: activeDetailIndex } = useDesireGalleryScene.getState();
      const closeHit =
        activeDetailIndex === trackIndex ? getMeshHit(event, closeHitPlaneRef.current) : null;

      if (closeHit) {
        pendingPointerActionRef.current = {
          kind: "close",
          x: event.clientX,
          y: event.clientY
        };
        event.preventDefault();
        return;
      }

      if (activeDetailIndex !== null) {
        return;
      }

      const cardHit = getMeshHit(event, hitPlaneRef.current);

      if (!cardHit) {
        return;
      }

      pendingPointerActionRef.current = {
        kind: "card",
        x: event.clientX,
        y: event.clientY
      };
      hoverTargetRef.current = 0;
      event.preventDefault();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      if (useDesireGalleryScene.getState().detailCardIndex !== null) {
        hoverTargetRef.current = 0;
        return;
      }

      const hit = getMeshHit(event, hitPlaneRef.current);

      if (!hit) {
        hoverTargetRef.current = 0;
        return;
      }

      const hoverX = hit.uv ? hit.uv.x - 0.5 : 0;
      hoverTargetRef.current = THREE.MathUtils.clamp(-hoverX * 0.28, -0.14, 0.14);
    };

    const handlePointerUp = (event: PointerEvent) => {
      const pendingAction = pendingPointerActionRef.current;

      if (!pendingAction) {
        return;
      }

      pendingPointerActionRef.current = null;

      if (
        Math.hypot(event.clientX - pendingAction.x, event.clientY - pendingAction.y) >
        CLICK_MOVE_TOLERANCE
      ) {
        return;
      }

      const galleryState = useDesireGalleryScene.getState();

      if (pendingAction.kind === "close") {
        galleryState.closeDetail();
        event.preventDefault();
        return;
      }

      if (galleryState.detailCardIndex === null && galleryState.visible) {
        galleryState.openDetail(trackIndex);
        event.preventDefault();
      }
    };

    const clearPendingAction = () => {
      pendingPointerActionRef.current = null;
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: false });
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { passive: false });
    window.addEventListener("pointercancel", clearPendingAction);
    window.addEventListener("blur", clearPendingAction);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", clearPendingAction);
      window.removeEventListener("blur", clearPendingAction);
    };
  }, [camera, pointerNdc, raycaster, trackIndex]);

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const { detailCardIndex: activeDetailIndex, progress, visible } = useDesireGalleryScene.getState();
    const detailOpen = activeDetailIndex !== null;
    const isActiveDetail = activeDetailIndex === trackIndex;

    if (!detailOpen) {
      progressRef.current = THREE.MathUtils.damp(progressRef.current, progress, 7.2, delta);
    }

    const sceneProgress =
      size.width < 760
        ? THREE.MathUtils.clamp(progressRef.current * MOBILE_HORIZONTAL_SCROLL_SPEED, 0, 1)
        : progressRef.current;
    const trackSpan = Math.max(0, galleryCards.length - 3) * CARD_SPACING;
    const galleryTargetX =
      position[0] + (trackIndex - 1) * CARD_SPACING - sceneProgress * trackSpan;
    const targetX =
      detailOpen && activeDetailIndex !== null
        ? isActiveDetail
          ? 0
          : (trackIndex - activeDetailIndex) * CARD_SPACING * 1.72
        : galleryTargetX;
    const centerDistance = Math.abs(targetX);
    const focus = detailOpen && isActiveDetail ? 1 : 1 - Math.min(1, centerDistance / (CARD_SPACING * 1.6));
    const rangeFade = 1 - THREE.MathUtils.smoothstep(centerDistance, 3.05, 3.86);
    const targetOpacity = visible
      ? detailOpen
        ? isActiveDetail
          ? 1
          : 0
        : rangeFade * (0.42 + focus * 0.58)
      : 0;
    const targetScale = detailOpen
      ? scale * (isActiveDetail ? 1.22 : 0.74)
      : scale * THREE.MathUtils.lerp(0.79, 0.88, focus);
    hoverTiltRef.current = THREE.MathUtils.damp(
      hoverTiltRef.current,
      visible && !detailOpen ? hoverTargetRef.current : 0,
      8,
      delta
    );

    interactionRotationRef.current = THREE.MathUtils.damp(
      interactionRotationRef.current,
      visible && !detailOpen ? hoverTiltRef.current : 0,
      7,
      delta
    );

    const targetRotationY =
      detailOpen && isActiveDetail
        ? 0
        : rotation[1] +
          THREE.MathUtils.clamp(-targetX * 0.045, -0.16, 0.16) +
          interactionRotationRef.current;
    const targetRotationZ = detailOpen && isActiveDetail ? 0 : rotation[2] + targetX * 0.012;
    const hover =
      detailOpen && isActiveDetail
        ? 0
        : Math.sin(state.clock.elapsedTime * 0.46 + trackIndex * 1.3) * 0.026;

    opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 4.8, delta);
    scaleRef.current = THREE.MathUtils.damp(scaleRef.current, targetScale, 4.2, delta);
    group.visible = opacityRef.current > 0.012;

    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 5.8, delta);
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      position[1] + THREE.MathUtils.lerp(-0.03, detailOpen && isActiveDetail ? -0.04 : 0.05, focus) + hover,
      3.8,
      delta
    );
    group.position.z = THREE.MathUtils.damp(
      group.position.z,
      position[2] + (detailOpen && isActiveDetail ? 0.76 : THREE.MathUtils.lerp(-0.1, 0.1, focus)),
      detailOpen && isActiveDetail ? 5.8 : 4,
      delta
    );
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, rotation[0], 4.4, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetRotationY, 4.4, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, targetRotationZ, 4.2, delta);
    group.scale.setScalar(scaleRef.current);

    setShellOpacity(shell, opacityRef.current, detailOpen && isActiveDetail ? 1 : focus);

    if (imageMaterialRef.current) {
      imageMaterialRef.current.uniforms.uOpacity.value = opacityRef.current * (0.78 + focus * 0.22);
    }

    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity =
        opacityRef.current * focus * (detailOpen && isActiveDetail ? 0.12 : isCenter ? 0.055 : 0.036);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <group scale={SHELL_DISPLAY_SCALE}>
        <mesh ref={hitPlaneRef} position={[0, 0, HIT_PLANE_Z]} renderOrder={20}>
          <planeGeometry args={[3.12, 4.46]} />
          <meshBasicMaterial
            color="#000000"
            depthTest={false}
            depthWrite={false}
            opacity={0}
            transparent
          />
        </mesh>

        <mesh position={[0, 0.02, GLOW_PLANE_Z]} renderOrder={2}>
          <planeGeometry args={[2.48, 3.46]} />
          <meshBasicMaterial
            ref={glowMaterialRef}
            blending={THREE.AdditiveBlending}
            color="#B77A32"
            depthTest={false}
            depthWrite={false}
            opacity={0}
            transparent
          />
        </mesh>

        <primitive object={shell} scale={[1, 1, SHELL_DEPTH_SCALE]} />

        <mesh
          position={[imagePosition[0], imagePosition[1], CONTENT_Z]}
          renderOrder={12}
          rotation={[0, 0, imageRotation]}
        >
          <planeGeometry args={[imageSize[0], imageSize[1]]} />
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

        <CardLine position={[0, 1.48, CONTENT_Z + 0.006]} size={[0.94, 0.004]} opacity={0.2} />
        <CardLine position={[0, -1.55, CONTENT_Z + 0.006]} size={[1.02, 0.004]} opacity={0.16} />

        <Text
          anchorX="left"
          anchorY="middle"
          color="#E3BE6B"
          fontSize={0.12}
          material-depthTest={false}
          material-depthWrite={false}
          material-transparent
          position={[-1.18, 1.63, TEXT_Z]}
          renderOrder={16}
        >
          {index}
        </Text>
        <Text
          anchorX="center"
          anchorY="middle"
          color="#E7C16A"
          fontSize={0.14}
          material-depthTest={false}
          material-depthWrite={false}
          material-transparent
          position={[0, 1.63, TEXT_Z]}
          renderOrder={16}
        >
          {title}
        </Text>
        <Text
          anchorX="center"
          anchorY="middle"
          color="#CAA45C"
          fontSize={0.082}
          material-depthTest={false}
          material-depthWrite={false}
          material-transparent
          position={[0, -1.73, TEXT_Z]}
          renderOrder={16}
        >
          {bottomLabel}
        </Text>
        <Text
          anchorX="center"
          anchorY="middle"
          color="#B8944E"
          fontSize={0.072}
          material-depthTest={false}
          material-depthWrite={false}
          material-transparent
          position={[1.27, 0, TEXT_Z]}
          renderOrder={16}
          rotation={[0, 0, -Math.PI / 2]}
        >
          {sideLabel}
        </Text>

        <CardDetailOverlay
          active={isDetailSelected}
          closeHitRef={closeHitPlaneRef}
          notes={detailNotes}
        />
      </group>
    </group>
  );
}

function DesireGalleryRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const opacityRef = useRef(0);
  const progressRef = useRef(0);
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

    const { detailCardIndex, progress, visible } = useDesireGalleryScene.getState();
    const targetOpacity = visible ? (detailCardIndex === null ? 1 : 0.18) : 0;

    progressRef.current = THREE.MathUtils.damp(progressRef.current, progress, 6.8, delta);
    opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 3.2, delta);
    mesh.visible = opacityRef.current > 0.015;
    mesh.rotation.z = state.clock.elapsedTime * 0.035;
    material.uniforms.uOpacity.value = opacityRef.current;
    material.uniforms.uProgress.value = progressRef.current;
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

function GalleryDetailBackdrop() {
  const shadeMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    const detailOpen = useDesireGalleryScene.getState().detailCardIndex !== null;

    opacityRef.current = THREE.MathUtils.damp(opacityRef.current, detailOpen ? 1 : 0, 4.4, delta);

    if (shadeMaterialRef.current) {
      shadeMaterialRef.current.opacity = opacityRef.current * 0.58;
    }

    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = opacityRef.current * 0.22;
    }
  });

  return (
    <group position={[0, 0, -0.72]} renderOrder={0}>
      <mesh renderOrder={0}>
        <planeGeometry args={[8.8, 5.45]} />
        <meshBasicMaterial
          ref={shadeMaterialRef}
          color="#030201"
          depthTest={false}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
      <mesh position={[0, -1.62, 0.01]} renderOrder={1}>
        <planeGeometry args={[4.2, 1.05]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          blending={THREE.AdditiveBlending}
          color="#B77A32"
          depthTest={false}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
    </group>
  );
}

export function DesireGlassGallery() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const forward = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        useDesireGalleryScene.getState().closeDetail();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const detailOpen = useDesireGalleryScene.getState().detailCardIndex !== null;
    const distance = detailOpen ? (size.width < 760 ? 4.78 : 4.72) : size.width < 760 ? 6.18 : 5.92;

    camera.getWorldDirection(forward);
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    target.copy(camera.position).addScaledVector(forward, distance).addScaledVector(up, 0.02);

    group.position.lerp(target, 1 - Math.exp(-delta * 10));
    group.quaternion.slerp(camera.quaternion, 1 - Math.exp(-delta * 12));

    const fov = THREE.MathUtils.degToRad(perspectiveCamera.fov);
    const viewHeight = (2 * Math.tan(fov / 2) * distance) / Math.max(0.001, perspectiveCamera.zoom);
    const viewWidth = viewHeight * (size.width / Math.max(1, size.height));
    const targetScale = detailOpen
      ? size.width < 760
        ? Math.max(0.44, Math.min(0.58, viewWidth / 4.2))
        : Math.max(0.68, Math.min(0.78, viewWidth / 7))
      : size.width < 760
        ? Math.max(0.5, Math.min(0.72, viewWidth / 3.1))
        : Math.max(0.82, Math.min(1, viewWidth / 6.05));

    group.scale.setScalar(THREE.MathUtils.damp(group.scale.x, targetScale, 5.5, delta));
  });

  return (
    <group ref={groupRef}>
      <GalleryDetailBackdrop />
      <DesireGalleryRing />
      {galleryCards.map((card, trackIndex) => (
        <LuxuryGalleryCard
          accent={card.accent}
          bottomLabel={card.bottomLabel}
          detailNotes={card.detailNotes}
          image={card.image}
          imagePosition={card.imagePosition}
          imageRotation={card.imageRotation}
          imageSize={card.imageSize}
          index={card.index}
          isCenter={trackIndex === 1}
          key={card.index}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={1}
          sideLabel={card.sideLabel}
          title={card.title}
          trackIndex={trackIndex}
        />
      ))}
    </group>
  );
}

galleryCards.forEach((card) => useTexture.preload(card.image));
useGLTF.preload(CARD_SHELL_PATH);
