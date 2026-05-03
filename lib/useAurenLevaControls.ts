"use client";

import { button, folder, useControls } from "leva";
import { useEffect } from "react";

import { AurenHeroPreset, aurenHeroPreset } from "@/lib/auren-hero-preset";
import { getAurenSceneSnapshot, useAurenSceneStore } from "@/lib/useAurenSceneStore";

function range(value: number, min: number, max: number, step = 0.01) {
  return { value, min, max, step };
}

function serializePreset() {
  const snapshot = getAurenSceneSnapshot();
  return `export const aurenHeroPreset = ${JSON.stringify(snapshot, null, 2)};\n\nexport type AurenHeroPreset = typeof aurenHeroPreset;\n`;
}

export function useAurenLevaControls(enabled: boolean) {
  const setControls = useAurenSceneStore((state) => state.setControls);

  const [values] = useControls(
    "AUREN NOIR / Hero Scene",
    () => ({
      "Hero Camera": folder({
        enableLevaOverrides: aurenHeroPreset.enableLevaOverrides,
        cameraX: range(aurenHeroPreset.camera.cameraX, -8, 8),
        cameraY: range(aurenHeroPreset.camera.cameraY, -4, 4),
        cameraZ: range(aurenHeroPreset.camera.cameraZ, 2, 12),
        cameraFov: range(aurenHeroPreset.camera.cameraFov, 24, 55, 0.1),
        targetX: range(aurenHeroPreset.camera.targetX, -3, 3),
        targetY: range(aurenHeroPreset.camera.targetY, -3, 3),
        targetZ: range(aurenHeroPreset.camera.targetZ, -3, 3),
        cameraDamping: range(aurenHeroPreset.camera.cameraDamping, 0.4, 8, 0.05),
        enableHeroBreathing: aurenHeroPreset.camera.enableHeroBreathing,
        breathingAmount: range(aurenHeroPreset.camera.breathingAmount, 0, 0.12, 0.001)
      }),
      "Hero Environment Controls": folder({
        particleIntensity: range(aurenHeroPreset.environment.particleIntensity, 0, 2.5),
        smokeGlobalOpacity: range(aurenHeroPreset.environment.smokeOpacity, 0, 2.5),
        godRayIntensity: range(aurenHeroPreset.environment.godRayIntensity, 0, 2.5),
        floorReflectionGlobal: range(aurenHeroPreset.environment.floorReflection, 0, 2),
        amberGlow: range(aurenHeroPreset.environment.amberGlow, 0, 2.5),
        bloomGlobalIntensity: range(aurenHeroPreset.environment.bloomIntensity, 0, 2)
      }),
      "Hero Bottle": folder({
        bottleX: range(aurenHeroPreset.bottle.bottleX, -3, 3),
        bottleY: range(aurenHeroPreset.bottle.bottleY, -3, 3),
        bottleZ: range(aurenHeroPreset.bottle.bottleZ, -3, 3),
        bottleRotX: range(aurenHeroPreset.bottle.bottleRotX, -Math.PI, Math.PI, 0.001),
        bottleRotY: range(aurenHeroPreset.bottle.bottleRotY, -Math.PI, Math.PI, 0.001),
        bottleRotZ: range(aurenHeroPreset.bottle.bottleRotZ, -Math.PI, Math.PI, 0.001),
        bottleScale: range(aurenHeroPreset.bottle.bottleScale, 0.25, 2.5),
        idleFloatAmount: range(aurenHeroPreset.bottle.idleFloatAmount, 0, 0.18, 0.001),
        idleFloatSpeed: range(aurenHeroPreset.bottle.idleFloatSpeed, 0, 3),
        idleRotationSpeed: range(aurenHeroPreset.bottle.idleRotationSpeed, 0, 1),
        cursorTiltAmount: range(aurenHeroPreset.bottle.cursorTiltAmount, 0, 0.3, 0.001),
        cursorTiltEnabled: aurenHeroPreset.bottle.cursorTiltEnabled,
        glassOpacity: range(aurenHeroPreset.bottle.glassOpacity, 0.15, 1),
        glassRoughness: range(aurenHeroPreset.bottle.glassRoughness, 0.01, 0.8),
        glassTransmission: range(aurenHeroPreset.bottle.glassTransmission, 0, 1),
        glassIOR: range(aurenHeroPreset.bottle.glassIOR, 1, 2.3),
        glassThickness: range(aurenHeroPreset.bottle.glassThickness, 0, 2),
        amberGlowIntensity: range(aurenHeroPreset.bottle.amberGlowIntensity, 0, 1.5),
        capMetalness: range(aurenHeroPreset.bottle.capMetalness, 0, 1),
        capRoughness: range(aurenHeroPreset.bottle.capRoughness, 0.01, 1)
      }),
      "Hero Spotlight": folder({
        spotlightX: range(aurenHeroPreset.spotlight.spotlightX, -8, 8),
        spotlightY: range(aurenHeroPreset.spotlight.spotlightY, 0, 12),
        spotlightZ: range(aurenHeroPreset.spotlight.spotlightZ, -8, 8),
        spotlightIntensity: range(aurenHeroPreset.spotlight.spotlightIntensity, 0, 16),
        spotlightAngle: range(aurenHeroPreset.spotlight.spotlightAngle, 0.03, 1, 0.001),
        spotlightPenumbra: range(aurenHeroPreset.spotlight.spotlightPenumbra, 0, 1),
        spotlightDistance: range(aurenHeroPreset.spotlight.spotlightDistance, 0, 30),
        spotlightColor: aurenHeroPreset.spotlight.spotlightColor
      }),
      "Rim Light": folder({
        rimX: range(aurenHeroPreset.rim.rimX, -8, 8),
        rimY: range(aurenHeroPreset.rim.rimY, -4, 8),
        rimZ: range(aurenHeroPreset.rim.rimZ, -8, 8),
        rimIntensity: range(aurenHeroPreset.rim.rimIntensity, 0, 6),
        rimColor: aurenHeroPreset.rim.rimColor
      }),
      "God Ray Beam": folder({
        beamEnabled: aurenHeroPreset.beam.beamEnabled,
        beamX: range(aurenHeroPreset.beam.beamX, -6, 6),
        beamY: range(aurenHeroPreset.beam.beamY, -2, 6),
        beamZ: range(aurenHeroPreset.beam.beamZ, -6, 6),
        beamScaleX: range(aurenHeroPreset.beam.beamScaleX, 0.1, 3),
        beamScaleY: range(aurenHeroPreset.beam.beamScaleY, 0.1, 3),
        beamScaleZ: range(aurenHeroPreset.beam.beamScaleZ, 0.1, 3),
        beamOpacity: range(aurenHeroPreset.beam.beamOpacity, 0, 2.5),
        beamIntensity: range(aurenHeroPreset.beam.beamIntensity, 0, 2.5),
        beamColor: aurenHeroPreset.beam.beamColor,
        beamSoftness: range(aurenHeroPreset.beam.beamSoftness, 0.2, 2.4)
      }),
      "Gold Particles": folder({
        particlesEnabled: aurenHeroPreset.particles.particlesEnabled,
        particleDensity: range(aurenHeroPreset.particles.particleDensity, 0, 2.5),
        particleOpacity: range(aurenHeroPreset.particles.particleOpacity, 0, 2.5),
        particleSize: range(aurenHeroPreset.particles.particleSize, 0.15, 4),
        particleSpeed: range(aurenHeroPreset.particles.particleSpeed, 0, 4),
        particleSpread: range(aurenHeroPreset.particles.particleSpread, 0.25, 3),
        particleBeamDensity: range(aurenHeroPreset.particles.particleBeamDensity, 0, 3),
        particleTwinkle: range(aurenHeroPreset.particles.particleTwinkle, 0, 3),
        particleColor: aurenHeroPreset.particles.particleColor
      }),
      "Smoke Atmosphere": folder({
        smokeEnabled: aurenHeroPreset.smoke.smokeEnabled,
        smokeOpacity: range(aurenHeroPreset.smoke.smokeOpacity, 0, 2.5),
        smokeSpeed: range(aurenHeroPreset.smoke.smokeSpeed, 0, 4),
        smokeScale: range(aurenHeroPreset.smoke.smokeScale, 0.2, 3),
        smokeSpread: range(aurenHeroPreset.smoke.smokeSpread, 0.2, 3),
        smokeCurlStrength: range(aurenHeroPreset.smoke.smokeCurlStrength, 0, 3),
        smokeColor: aurenHeroPreset.smoke.smokeColor,
        smokeLayerDepth: range(aurenHeroPreset.smoke.smokeLayerDepth, 0.2, 3)
      }),
      "Reflective Floor": folder({
        floorEnabled: aurenHeroPreset.floor.floorEnabled,
        floorY: range(aurenHeroPreset.floor.floorY, -3, 0),
        floorReflectivity: range(aurenHeroPreset.floor.floorReflectivity, 0, 2.5),
        floorBlur: range(aurenHeroPreset.floor.floorBlur, 0, 2),
        floorRoughness: range(aurenHeroPreset.floor.floorRoughness, 0.01, 1),
        floorMetalness: range(aurenHeroPreset.floor.floorMetalness, 0, 1),
        floorVeinIntensity: range(aurenHeroPreset.floor.floorVeinIntensity, 0, 2.5),
        floorGlowIntensity: range(aurenHeroPreset.floor.floorGlowIntensity, 0, 2.5),
        floorColor: aurenHeroPreset.floor.floorColor,
        veinColor: aurenHeroPreset.floor.veinColor
      }),
      "Post FX": folder({
        bloomEnabled: aurenHeroPreset.postfx.bloomEnabled,
        bloomIntensity: range(aurenHeroPreset.postfx.bloomIntensity, 0, 2.5),
        bloomThreshold: range(aurenHeroPreset.postfx.bloomThreshold, 0, 1),
        vignetteDarkness: range(aurenHeroPreset.postfx.vignetteDarkness, 0, 1.3),
        vignetteOffset: range(aurenHeroPreset.postfx.vignetteOffset, 0, 1),
        grainOpacity: range(aurenHeroPreset.postfx.grainOpacity, 0, 0.15, 0.001),
        dofEnabled: aurenHeroPreset.postfx.dofEnabled,
        chromaticAberrationEnabled: aurenHeroPreset.postfx.chromaticAberrationEnabled,
        chromaticOffset: range(aurenHeroPreset.postfx.chromaticOffset, 0, 0.004, 0.00001)
      }),
      Debug: folder({
        showHelpers: aurenHeroPreset.debug.showHelpers,
        showAxes: aurenHeroPreset.debug.showAxes,
        freezeAnimations: aurenHeroPreset.debug.freezeAnimations,
        performanceMode: {
          value: aurenHeroPreset.debug.performanceMode,
          options: ["high", "medium", "low"]
        },
        copyPreset: button(() => {
          void navigator.clipboard?.writeText(serializePreset());
        })
      })
    }),
    { collapsed: false },
    [enabled]
  ) as unknown as [Record<string, unknown>];

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const nextControls: AurenHeroPreset = {
      enableLevaOverrides: Boolean(values.enableLevaOverrides),
      camera: {
        cameraX: Number(values.cameraX),
        cameraY: Number(values.cameraY),
        cameraZ: Number(values.cameraZ),
        cameraFov: Number(values.cameraFov),
        targetX: Number(values.targetX),
        targetY: Number(values.targetY),
        targetZ: Number(values.targetZ),
        cameraDamping: Number(values.cameraDamping),
        enableHeroBreathing: Boolean(values.enableHeroBreathing),
        breathingAmount: Number(values.breathingAmount)
      },
      environment: {
        particleIntensity: Number(values.particleIntensity),
        smokeOpacity: Number(values.smokeGlobalOpacity),
        godRayIntensity: Number(values.godRayIntensity),
        floorReflection: Number(values.floorReflectionGlobal),
        amberGlow: Number(values.amberGlow),
        bloomIntensity: Number(values.bloomGlobalIntensity)
      },
      bottle: {
        bottleX: Number(values.bottleX),
        bottleY: Number(values.bottleY),
        bottleZ: Number(values.bottleZ),
        bottleRotX: Number(values.bottleRotX),
        bottleRotY: Number(values.bottleRotY),
        bottleRotZ: Number(values.bottleRotZ),
        bottleScale: Number(values.bottleScale),
        idleFloatAmount: Number(values.idleFloatAmount),
        idleFloatSpeed: Number(values.idleFloatSpeed),
        idleRotationSpeed: Number(values.idleRotationSpeed),
        cursorTiltAmount: Number(values.cursorTiltAmount),
        cursorTiltEnabled: Boolean(values.cursorTiltEnabled),
        glassOpacity: Number(values.glassOpacity),
        glassRoughness: Number(values.glassRoughness),
        glassTransmission: Number(values.glassTransmission),
        glassIOR: Number(values.glassIOR),
        glassThickness: Number(values.glassThickness),
        amberGlowIntensity: Number(values.amberGlowIntensity),
        capMetalness: Number(values.capMetalness),
        capRoughness: Number(values.capRoughness)
      },
      spotlight: {
        spotlightX: Number(values.spotlightX),
        spotlightY: Number(values.spotlightY),
        spotlightZ: Number(values.spotlightZ),
        spotlightIntensity: Number(values.spotlightIntensity),
        spotlightAngle: Number(values.spotlightAngle),
        spotlightPenumbra: Number(values.spotlightPenumbra),
        spotlightDistance: Number(values.spotlightDistance),
        spotlightColor: String(values.spotlightColor)
      },
      rim: {
        rimX: Number(values.rimX),
        rimY: Number(values.rimY),
        rimZ: Number(values.rimZ),
        rimIntensity: Number(values.rimIntensity),
        rimColor: String(values.rimColor)
      },
      beam: {
        beamEnabled: Boolean(values.beamEnabled),
        beamX: Number(values.beamX),
        beamY: Number(values.beamY),
        beamZ: Number(values.beamZ),
        beamScaleX: Number(values.beamScaleX),
        beamScaleY: Number(values.beamScaleY),
        beamScaleZ: Number(values.beamScaleZ),
        beamOpacity: Number(values.beamOpacity),
        beamIntensity: Number(values.beamIntensity),
        beamColor: String(values.beamColor),
        beamSoftness: Number(values.beamSoftness)
      },
      particles: {
        particlesEnabled: Boolean(values.particlesEnabled),
        particleDensity: Number(values.particleDensity),
        particleOpacity: Number(values.particleOpacity),
        particleSize: Number(values.particleSize),
        particleSpeed: Number(values.particleSpeed),
        particleSpread: Number(values.particleSpread),
        particleBeamDensity: Number(values.particleBeamDensity),
        particleTwinkle: Number(values.particleTwinkle),
        particleColor: String(values.particleColor)
      },
      smoke: {
        smokeEnabled: Boolean(values.smokeEnabled),
        smokeOpacity: Number(values.smokeOpacity),
        smokeSpeed: Number(values.smokeSpeed),
        smokeScale: Number(values.smokeScale),
        smokeSpread: Number(values.smokeSpread),
        smokeCurlStrength: Number(values.smokeCurlStrength),
        smokeColor: String(values.smokeColor),
        smokeLayerDepth: Number(values.smokeLayerDepth)
      },
      floor: {
        floorEnabled: Boolean(values.floorEnabled),
        floorY: Number(values.floorY),
        floorReflectivity: Number(values.floorReflectivity),
        floorBlur: Number(values.floorBlur),
        floorRoughness: Number(values.floorRoughness),
        floorMetalness: Number(values.floorMetalness),
        floorVeinIntensity: Number(values.floorVeinIntensity),
        floorGlowIntensity: Number(values.floorGlowIntensity),
        floorColor: String(values.floorColor),
        veinColor: String(values.veinColor)
      },
      postfx: {
        bloomEnabled: Boolean(values.bloomEnabled),
        bloomIntensity: Number(values.bloomIntensity),
        bloomThreshold: Number(values.bloomThreshold),
        vignetteDarkness: Number(values.vignetteDarkness),
        vignetteOffset: Number(values.vignetteOffset),
        grainOpacity: Number(values.grainOpacity),
        dofEnabled: Boolean(values.dofEnabled),
        chromaticAberrationEnabled: Boolean(values.chromaticAberrationEnabled),
        chromaticOffset: Number(values.chromaticOffset)
      },
      debug: {
        showHelpers: Boolean(values.showHelpers),
        showAxes: Boolean(values.showAxes),
        freezeAnimations: Boolean(values.freezeAnimations),
        performanceMode: values.performanceMode as AurenHeroPreset["debug"]["performanceMode"]
      }
    };

    setControls(nextControls);
  }, [enabled, setControls, values]);
}
