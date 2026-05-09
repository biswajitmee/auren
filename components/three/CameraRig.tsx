"use client";

import { types as t, val } from "@theatre/core";
import type { ISheetObject } from "@theatre/core";
import { PerspectiveCamera } from "@theatre/r3f";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type HeroCameraValues = {
  target?: {
    x: number;
    y: number;
    z: number;
  };
  roll?: number;
};

const heroCameraAdditionalProps = {
  target: {
    x: t.number(0),
    y: t.number(0.04),
    z: t.number(0)
  },
  roll: t.number(0)
};

export function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const heroCameraObjectRef = useRef<ISheetObject | null>(null);
  const lookAt = useMemo(() => new THREE.Vector3(0, 0.04, 0), []);

  useFrame(() => {
    const camera = cameraRef.current;
    const heroCameraObject = heroCameraObjectRef.current;

    if (!camera || !heroCameraObject) {
      return;
    }

    const cameraValues = val(heroCameraObject.props) as HeroCameraValues;
    const target = cameraValues.target ?? { x: 0, y: 0.04, z: 0 };

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
