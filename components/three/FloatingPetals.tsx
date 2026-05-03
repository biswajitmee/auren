"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function FloatingPetals() {
  const groupRef = useRef<THREE.Group>(null);
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        key: index,
        position: [
          (Math.random() - 0.5) * 5,
          -0.5 + Math.random() * 2.6,
          -1.6 + Math.random() * 1.2
        ] as [number, number, number],
        scale: 0.035 + Math.random() * 0.055,
        speed: 0.35 + Math.random() * 0.5
      })),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
    groupRef.current.children.forEach((child, index) => {
      child.position.y += Math.sin(state.clock.elapsedTime * petals[index].speed) * 0.0008;
      child.rotation.z += 0.002 + index * 0.00005;
    });
  });

  return (
    <group ref={groupRef}>
      {petals.map((petal) => (
        <mesh key={petal.key} position={petal.position} scale={petal.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#7B3F5E"
            emissive="#24101b"
            metalness={0.1}
            roughness={0.72}
          />
        </mesh>
      ))}
    </group>
  );
}
