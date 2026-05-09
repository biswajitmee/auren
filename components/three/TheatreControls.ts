"use client";

import { types as t } from "@theatre/core";

import { mainSheet } from "@/lib/theatre";

export type TheatreRgba = {
  r: number;
  g: number;
  b: number;
  a: number;
};

function vector3(x: number, y: number, z: number, range: [number, number] = [-10, 10]) {
  return {
    x: t.number(x, { range }),
    y: t.number(y, { range }),
    z: t.number(z, { range })
  };
}

export const theatreControls = {
  heroEnvironment: mainSheet.object(
    "Hero Environment Controls",
    {
      particleIntensity: t.number(1, { range: [0, 2.5] }),
      smokeOpacity: t.number(1, { range: [0, 2.5] }),
      godRayIntensity: t.number(1, { range: [0, 2.5] }),
      floorReflection: t.number(1, { range: [0, 2] }),
      amberGlow: t.number(1, { range: [0, 2.5] }),
      bloomIntensity: t.number(1, { range: [0, 2] })
    },
    { reconfigure: true }
  ),
  heroSpotlight: mainSheet.object(
    "Hero Spotlight",
    {
      position: vector3(0.05, 8.9, 1.35, [-12, 12]),
      intensity: t.number(7.2, { range: [0, 14] }),
      angle: t.number(0.18, { range: [0.05, 0.8] }),
      penumbra: t.number(0.92, { range: [0, 1] }),
      color: t.rgba({ r: 0.94, g: 0.82, b: 0.54, a: 1 })
    },
    { reconfigure: true }
  ),
  rimLight: mainSheet.object(
    "Rim Light",
    {
      leftPosition: vector3(-2.6, 2.2, 2.7, [-8, 8]),
      rightPosition: vector3(2.6, 1.65, 2.1, [-8, 8]),
      leftIntensity: t.number(0.92, { range: [0, 4] }),
      rightIntensity: t.number(0.48, { range: [0, 4] }),
      color: t.rgba({ r: 0.9, g: 0.75, b: 0.39, a: 1 })
    },
    { reconfigure: true }
  ),
  reflectiveFloor: mainSheet.object(
    "Reflective Floor",
    {
      position: vector3(0, -1.42, 0, [-6, 6]),
      rotation: vector3(-Math.PI / 2, 0, 0, [-Math.PI, Math.PI]),
      scale: vector3(1, 1, 1, [0.2, 3]),
      roughness: t.number(0.22, { range: [0.02, 0.8] }),
      reflectionIntensity: t.number(1, { range: [0, 2.5] }),
      veinOpacity: t.number(1, { range: [0, 2] })
    },
    { reconfigure: true }
  ),
  goldParticles: mainSheet.object(
    "Gold Particles",
    {
      opacity: t.number(1, { range: [0, 2.5] }),
      speed: t.number(1, { range: [0, 3] }),
      sizeMultiplier: t.number(1, { range: [0.2, 3] }),
      spread: t.number(1, { range: [0.3, 2.5] }),
      colorIntensity: t.number(1, { range: [0, 2.5] })
    },
    { reconfigure: true }
  ),
  smokeAtmosphere: mainSheet.object(
    "Smoke Atmosphere",
    {
      opacity: t.number(1, { range: [0, 2.5] }),
      speed: t.number(1, { range: [0, 3] }),
      spread: t.number(1, { range: [0.3, 2.5] }),
      verticalDrift: t.number(1, { range: [0, 3] }),
      colorIntensity: t.number(1, { range: [0, 2.5] })
    },
    { reconfigure: true }
  ),
  godRayBeam: mainSheet.object(
    "God Ray Beam",
    {
      position: vector3(0, 1.64, -1.08, [-8, 8]),
      scale: vector3(1, 1, 1, [0.2, 3]),
      opacity: t.number(1, { range: [0, 2.5] }),
      colorIntensity: t.number(1, { range: [0, 2.5] })
    },
    { reconfigure: true }
  )
};

export function rgbaToCssColor(color: TheatreRgba) {
  return `rgb(${Math.round(color.r * 255)} ${Math.round(color.g * 255)} ${Math.round(
    color.b * 255
  )})`;
}
