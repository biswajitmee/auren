"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";

type CameraRigProps = {
  reducedMotion?: boolean;
};

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const clamped = THREE.MathUtils.clamp((value - inMin) / (inMax - inMin), 0, 1);
  return THREE.MathUtils.lerp(outMin, outMax, clamped);
}

export function CameraRig({ reducedMotion = false }: CameraRigProps) {
  const progress = useScrollProgress((state) => state.progress);
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const cameraControls = useAurenSceneStore((state) => state.camera);
  const debugControls = useAurenSceneStore((state) => state.debug);

  useFrame(({ camera }, delta) => {
    const cameraValues = theatreControls.heroCamera.value;
    const basePosition = levaOverrides
      ? {
          x: cameraControls.cameraX,
          y: cameraControls.cameraY,
          z: cameraControls.cameraZ
        }
      : cameraValues.position;
    const baseTarget = levaOverrides
      ? {
          x: cameraControls.targetX,
          y: cameraControls.targetY,
          z: cameraControls.targetZ
        }
      : cameraValues.target;
    const baseFov = levaOverrides ? cameraControls.cameraFov : cameraValues.fov;
    const heroZoom = levaOverrides ? 2 : cameraValues.heroZoom;
    const targetFov = progress < 0.12 ? mapRange(progress, 0, 0.12, baseFov, 42) : 45;
    const breathing =
      levaOverrides &&
      cameraControls.enableHeroBreathing &&
      !debugControls.freezeAnimations &&
      progress < 0.1
        ? Math.sin(performance.now() * 0.00045) * cameraControls.breathingAmount
        : 0;

    if (reducedMotion) {
      target.set(basePosition.x, basePosition.y, basePosition.z);
      lookAt.set(baseTarget.x, baseTarget.y, baseTarget.z);
    } else if (progress < 0.1) {
      target.set(
        basePosition.x,
        basePosition.y + breathing,
        mapRange(progress, 0, 0.1, basePosition.z, basePosition.z - heroZoom)
      );
      lookAt.set(baseTarget.x, baseTarget.y, baseTarget.z);
    } else if (progress < 0.22) {
      target.set(0, 0.05, mapRange(progress, 0.1, 0.22, 5, 3.15));
      lookAt.set(0, 0, 0);
    } else if (progress < 0.38) {
      const angle = mapRange(progress, 0.22, 0.38, -0.38, 0.78);
      target.set(Math.sin(angle) * 2.15, 0.28, Math.cos(angle) * 3.45);
      lookAt.set(0, 0.05, 0);
    } else if (progress < 0.52) {
      target.set(mapRange(progress, 0.38, 0.52, 0.3, -1.2), 0.58, 4.7);
      lookAt.set(-0.35, 0.2, 0);
    } else if (progress < 0.64) {
      target.set(0, mapRange(progress, 0.52, 0.64, 0.4, 1), 6.05);
      lookAt.set(0, 0.12, 0);
    } else if (progress < 0.74) {
      target.set(0.95, 0.45, 5.8);
      lookAt.set(0.25, 0, 0);
    } else if (progress < 0.83) {
      target.set(0, 0.18, 4.25);
      lookAt.set(0, 0, 0);
    } else if (progress < 0.93) {
      target.set(0.62, 0.3, 4.95);
      lookAt.set(0.12, 0, 0);
    } else {
      target.set(0, 0.4, mapRange(progress, 0.93, 1, 4.95, 6.25));
      lookAt.set(0, 0.1, 0);
    }

    const damping = 1 - Math.exp(-delta * (levaOverrides ? cameraControls.cameraDamping : 2.4));
    camera.position.lerp(target, damping);
    if ("fov" in camera) {
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 2.6, delta);
      camera.updateProjectionMatrix();
    }
    currentLookAt.lerp(lookAt, damping);
    camera.lookAt(currentLookAt);
  });

  return null;
}
