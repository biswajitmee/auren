"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { theatreControls } from "@/components/three/TheatreControls";
import { aurenHeroPreset } from "@/lib/auren-hero-preset";
import { useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { useScrollProgress } from "@/lib/useScrollProgress";
import fragmentShader from "@/shaders/godray.frag";
import vertexShader from "@/shaders/godray.vert";

export function GodRayBeam() {
  const groupRef = useRef<THREE.Group>(null);
  const levaOverrides = useAurenSceneStore((state) => state.enableLevaOverrides);
  const beamControls = useAurenSceneStore((state) => state.beam);
  const environmentControls = useAurenSceneStore((state) => state.environment);
  const debugControls = useAurenSceneStore((state) => state.debug);

  const geometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 96, 36, true), []);
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1, 36), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(aurenHeroPreset.beam.beamColor) },
          uOpacity: { value: 0 },
          uIntensity: { value: 1 },
          uSoftness: { value: aurenHeroPreset.beam.beamSoftness },
          uTopWidth: { value: aurenHeroPreset.beam.beamTopWidth },
          uBottomWidth: { value: aurenHeroPreset.beam.beamBottomWidth },
          uFalloff: { value: aurenHeroPreset.beam.beamFalloff },
          uNoiseAmount: { value: aurenHeroPreset.beam.beamNoiseAmount }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      }),
    []
  );

  useFrame((state, delta) => {
    const progress = useScrollProgress.getState().progress;
    const theatreGodRay = theatreControls.godRayBeam.value;
    const theatreEnvironment = theatreControls.heroEnvironment.value;
    const preset = aurenHeroPreset.beam;
    const beam = levaOverrides
      ? beamControls
      : {
          ...preset,
          beamX: theatreGodRay.position.x,
          beamY: theatreGodRay.position.y,
          beamZ: theatreGodRay.position.z,
          beamScaleX: preset.beamScaleX * theatreGodRay.scale.x,
          beamScaleY: preset.beamScaleY * theatreGodRay.scale.y,
          beamScaleZ: preset.beamScaleZ * theatreGodRay.scale.z,
          beamHeight: preset.beamHeight * theatreGodRay.scale.y,
          beamOpacity: preset.beamOpacity * theatreGodRay.opacity,
          beamIntensity: preset.beamIntensity * theatreGodRay.colorIntensity
        };
    const environment = levaOverrides ? environmentControls : theatreEnvironment;
    const hero = 1 - THREE.MathUtils.smoothstep(progress, 0.14, 0.56);
    const film =
      THREE.MathUtils.smoothstep(progress, 0.7, 0.82) *
      (1 - THREE.MathUtils.smoothstep(progress, 0.88, 0.98));
    const timeScale = levaOverrides && debugControls.freezeAnimations ? 0 : 1;

    if (groupRef.current) {
      const normalizedHeightScale = beam.beamScaleY / Math.max(preset.beamScaleY, 0.001);
      groupRef.current.visible = beam.beamEnabled;
      groupRef.current.position.set(beam.beamX, beam.beamY, beam.beamZ);
      groupRef.current.scale.set(
        beam.beamScaleX,
        beam.beamHeight * normalizedHeightScale,
        beam.beamScaleZ
      );
    }

    material.uniforms.uTime.value = state.clock.elapsedTime * timeScale;
    material.uniforms.uColor.value.set(beam.beamColor);
    material.uniforms.uIntensity.value = beam.beamIntensity;
    material.uniforms.uSoftness.value = beam.beamSoftness;
    material.uniforms.uTopWidth.value = beam.beamTopWidth;
    material.uniforms.uBottomWidth.value = beam.beamBottomWidth;
    material.uniforms.uFalloff.value = beam.beamFalloff;
    material.uniforms.uNoiseAmount.value = beam.beamNoiseAmount;
    material.uniforms.uOpacity.value = THREE.MathUtils.damp(
      material.uniforms.uOpacity.value,
      (0.04 + hero * 0.48 + film * 0.12) * beam.beamOpacity * environment.godRayIntensity,
      2.5,
      delta
    );
  });

  return (
    <group ref={groupRef} position={[0, 1.76, -0.42]} scale={[2.15, 6.45, 1.45]}>
      <mesh geometry={geometry} material={material} renderOrder={1} />
      <mesh geometry={planeGeometry} material={material} renderOrder={2} />
      <mesh
        geometry={planeGeometry}
        material={material}
        renderOrder={2}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}
