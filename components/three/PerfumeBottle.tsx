"use client";

import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { editable as e } from "@theatre/r3f";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import type { PerformanceTier } from "@/lib/detectPerformanceTier";

const MODEL_PATH = "/models/auren-bottle-2.glb";

type GLTFResult = GLTF & {
  nodes: {
    textd: THREE.Mesh;
    Plane: THREE.Mesh;
    Cube_Material001_0: THREE.Mesh;
  };
  materials: {
    "Material.001": THREE.Material;
    "Material.003": THREE.Material;
    "Material.005": THREE.Material;
  };
};

type PerfumeBottleProps = ThreeElements["group"] & {
  active?: boolean;
  tier?: PerformanceTier;
};

export function PerfumeBottle({
  active: _active,
  tier: _tier,
  ...props
}: PerfumeBottleProps) {
  const { nodes, materials } = useGLTF(MODEL_PATH) as GLTFResult;

  return (
    <e.group theatreKey="Hero Bottle" position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
      <group {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.textd.geometry}
          material={materials["Material.003"]}
          position={[0.414, 0.875, 0.314]}
          rotation={[1.527, 0.009, 0.011]}
          scale={0.073}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane.geometry}
          material={materials["Material.005"]}
          position={[0.401, 0.835, 0.242]}
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
              castShadow
              receiveShadow
              geometry={nodes.Cube_Material001_0.geometry}
              material={materials["Material.001"]}
              position={[0.06, 1.631, -0.881]}
            />
          </group>
        </group>
      </group>
    </e.group>
  );
}

useGLTF.preload(MODEL_PATH);
