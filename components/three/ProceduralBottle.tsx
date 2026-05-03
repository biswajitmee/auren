"use client";

import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import amberFragment from "@/shaders/amberLiquid.frag";
import amberVertex from "@/shaders/amberLiquid.vert";
import glassFragment from "@/shaders/glass.frag";
import glassVertex from "@/shaders/glass.vert";

type ProceduralBottleProps = {
  reducedMotion?: boolean;
};

export function ProceduralBottle({ reducedMotion = false }: ProceduralBottleProps) {
  const glassMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: glassVertex,
        fragmentShader: glassFragment,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#211915") },
          uOpacity: { value: 0.26 }
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  );

  const liquidMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: amberVertex,
        fragmentShader: amberFragment,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#8B4513") }
        },
        transparent: true,
        depthWrite: false
      }),
    []
  );

  useFrame((_, delta) => {
    if (reducedMotion) {
      return;
    }

    glassMaterial.uniforms.uTime.value += delta;
    liquidMaterial.uniforms.uTime.value += delta;
  });

  useEffect(
    () => () => {
      glassMaterial.dispose();
      liquidMaterial.dispose();
    },
    [glassMaterial, liquidMaterial]
  );

  return (
    <group>
      <RoundedBox args={[1.12, 2.2, 0.56]} radius={0.075} smoothness={6}>
        <primitive attach="material" object={glassMaterial} />
      </RoundedBox>

      <mesh position={[0, -0.42, 0.01]} scale={[0.9, 0.78, 0.42]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive attach="material" object={liquidMaterial} />
      </mesh>

      <mesh position={[0, -0.12, 0.302]}>
        <planeGeometry args={[0.64, 0.72]} />
        <meshStandardMaterial
          color="#050403"
          emissive="#150d08"
          metalness={0.2}
          roughness={0.58}
        />
      </mesh>

      <Text
        anchorX="center"
        anchorY="middle"
        color="#F5F0E8"
        fontSize={0.12}
        lineHeight={1.3}
        position={[0, -0.12, 0.315]}
      >
        AUREN{"\n"}NOIR
      </Text>

      <mesh position={[0, 1.28, 0]} castShadow>
        <cylinderGeometry args={[0.43, 0.48, 0.42, 56]} />
        <meshStandardMaterial
          color="#C9A84C"
          emissive="#3c2810"
          metalness={0.86}
          roughness={0.24}
        />
      </mesh>

      <mesh position={[0, 1.03, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.25, 0.22, 48]} />
        <meshStandardMaterial color="#11100d" metalness={0.6} roughness={0.32} />
      </mesh>

      <pointLight color="#8B4513" intensity={0.85} position={[0, -0.3, 0.45]} />
    </group>
  );
}
