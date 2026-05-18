"use client";

import { types as t, val } from "@theatre/core";
import type { ISheetObject } from "@theatre/core";
import { PerspectiveCamera } from "@theatre/r3f";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type HeroCameraValues = {
  far?: number;
  fov?: number;
  near?: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  target?: {
    x: number;
    y: number;
    z: number;
  };
  roll?: number;
  zoom?: number;
};

const heroCameraAdditionalProps = {
  target: {
    x: t.number(0),
    y: t.number(0.04),
    z: t.number(0)
  },
  roll: t.number(0)
};

const DEFAULT_CAMERA_POSITION = { x: 0, y: 0.12, z: 7.2 };
const DEFAULT_CAMERA_TARGET = { x: 0, y: 0.04, z: 0 };
const DEFAULT_CAMERA_FOV = 34;
const DEFAULT_CAMERA_NEAR = 0.1;
const DEFAULT_CAMERA_FAR = 100;
const DEFAULT_CAMERA_ZOOM = 1;

function finiteOrDefault(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const heroCameraObjectRef = useRef<ISheetObject | null>(null);
  const lookAt = useMemo(
    () =>
      new THREE.Vector3(
        DEFAULT_CAMERA_TARGET.x,
        DEFAULT_CAMERA_TARGET.y,
        DEFAULT_CAMERA_TARGET.z
      ),
    []
  );

  useFrame(() => {
    const camera = cameraRef.current;
    const heroCameraObject = heroCameraObjectRef.current;

    if (!camera || !heroCameraObject) {
      return;
    }

    const cameraValues = val(heroCameraObject.props) as HeroCameraValues;
    const position = cameraValues.position ?? DEFAULT_CAMERA_POSITION;
    const target = cameraValues.target ?? DEFAULT_CAMERA_TARGET;
    const nextNear = finiteOrDefault(cameraValues.near, DEFAULT_CAMERA_NEAR);
    const nextFar = finiteOrDefault(cameraValues.far, DEFAULT_CAMERA_FAR);
    const nextFov = finiteOrDefault(cameraValues.fov, DEFAULT_CAMERA_FOV);
    const nextZoom = finiteOrDefault(cameraValues.zoom, DEFAULT_CAMERA_ZOOM);

    camera.position.set(position.x, position.y, position.z);
    camera.near = nextNear;
    camera.far = Math.max(nextNear + 0.001, nextFar);
    camera.fov = Math.max(1, Math.min(120, nextFov));
    camera.zoom = Math.max(0.001, nextZoom);

    lookAt.set(
      target.x,
      target.y,
      target.z
    );
    camera.lookAt(lookAt);
    camera.rotateZ(cameraValues.roll ?? 0);
    camera.updateProjectionMatrix();
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      additionalProps={heroCameraAdditionalProps}
      far={100}
      fov={34}
      makeDefault
      near={0.1}
      objRef={(sheetObject: ISheetObject) => {
        heroCameraObjectRef.current = sheetObject;
      }}
      position={[0, 0.12, 7.2]}
      theatreKey="Hero Camera"
      zoom={1}
    />
  );
}
