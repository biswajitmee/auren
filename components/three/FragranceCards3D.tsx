"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { fragranceNotes } from "@/lib/auren-data";
import { useScrollProgress } from "@/lib/useScrollProgress";

export function FragranceCards3D() {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useScrollProgress((state) => state.progress);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    const inView =
      THREE.MathUtils.smoothstep(progress, 0.34, 0.42) *
      (1 - THREE.MathUtils.smoothstep(progress, 0.54, 0.62));

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      inView > 0 ? 0 : -0.35,
      3,
      delta
    );
    groupRef.current.visible = inView > 0.02;

    groupRef.current.traverse((object) => {
      const mesh = object as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial | undefined;

      if (material && "opacity" in material) {
        material.opacity = THREE.MathUtils.damp(material.opacity, inView * 0.22, 4, delta);
      }
    });
  });

  return (
    <group position={[1.35, 0, -0.8]} ref={groupRef} visible={false}>
      {fragranceNotes.map((note, index) => (
        <group
          key={note.title}
          position={[-1.1 + index * 1.1, 0.16 - index * 0.04, -0.1 * index]}
          rotation={[0, -0.18 + index * 0.18, 0]}
        >
          <mesh>
            <planeGeometry args={[0.82, 1.08]} />
            <meshBasicMaterial color="#C9A84C" opacity={0.12} transparent />
          </mesh>
          <Text
            anchorX="center"
            anchorY="middle"
            color="#F5F0E8"
            fontSize={0.065}
            maxWidth={0.62}
            position={[0, 0.05, 0.02]}
          >
            {note.title}
          </Text>
        </group>
      ))}
    </group>
  );
}
