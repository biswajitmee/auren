"use client";

import { SheetProvider } from "@theatre/r3f";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

import { SceneController } from "@/components/three/SceneController";
import { usePerformanceTier } from "@/lib/detectPerformanceTier";
import { initializeTheatreStudio, mainSheet } from "@/lib/theatre";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type AurenCanvasProps = {
  active?: boolean;
};

export default function AurenCanvas({ active = true }: AurenCanvasProps) {
  const tier = usePerformanceTier();
  const reducedMotion = usePrefersReducedMotion();
  const dpr: [number, number] = tier === "high" ? [1, 2] : [1, 1.5];
  const preserveDrawingBuffer =
    typeof window !== "undefined" &&
    window.location.search.includes("verifyCanvas=1");

  useEffect(() => {
    void initializeTheatreStudio();
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-obsidian" aria-hidden>
      <Canvas
        camera={{ fov: 34, position: [0, 0.12, 7.2] }}
        dpr={dpr}
        eventPrefix="client"
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        gl={{
          alpha: false,
          antialias: tier !== "low",
          powerPreference: tier === "high" ? "high-performance" : "default",
          preserveDrawingBuffer
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        shadows={tier !== "low"}
      >
        <SheetProvider sheet={mainSheet}>
          <color args={["#0A0806"]} attach="background" />
          <fog args={["#0A0806", 4, 12]} attach="fog" />
          <SceneController
            active={active}
            reducedMotion={reducedMotion}
            tier={tier}
          />
        </SheetProvider>
      </Canvas>
    </div>
  );
}
