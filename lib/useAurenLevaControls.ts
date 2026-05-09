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
      "Leva Overrides": folder({
        enableLevaOverrides: aurenHeroPreset.enableLevaOverrides
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
        glassTransmission: range(aurenHeroPreset.bottle.glassTransmission, 0, 1),
        glassOpacity: range(aurenHeroPreset.bottle.glassOpacity, 0.05, 1),
        glassIOR: range(aurenHeroPreset.bottle.glassIOR, 1, 2.3),
        glassThickness: range(aurenHeroPreset.bottle.glassThickness, 0, 2),
        glassRoughness: range(aurenHeroPreset.bottle.glassRoughness, 0.01, 0.8),
        glassReflectivity: range(aurenHeroPreset.bottle.glassReflectivity, 0, 1.5),
        glassClearcoat: range(aurenHeroPreset.bottle.glassClearcoat, 0, 1),
        amberTint: aurenHeroPreset.bottle.amberTint,
        attenuationDistance: range(aurenHeroPreset.bottle.attenuationDistance, 0.1, 6),
        fresnelStrength: range(aurenHeroPreset.bottle.fresnelStrength, 0, 2),
        fresnelPower: range(aurenHeroPreset.bottle.fresnelPower, 0.5, 8),
        edgeHighlightIntensity: range(aurenHeroPreset.bottle.edgeHighlightIntensity, 0, 2.5),
        amberGlowIntensity: range(aurenHeroPreset.bottle.amberGlowIntensity, 0, 1.5),
        capMetalness: range(aurenHeroPreset.bottle.capMetalness, 0, 1),
        capRoughness: range(aurenHeroPreset.bottle.capRoughness, 0.01, 1),
        labelBoost: range(aurenHeroPreset.bottle.labelBoost, 0, 2)
      }),
      "Hero Spotlight": folder({
        spotlightX: range(aurenHeroPreset.spotlight.spotlightX, -8, 8),
        spotlightY: range(aurenHeroPreset.spotlight.spotlightY, 0, 12),
        spotlightZ: range(aurenHeroPreset.spotlight.spotlightZ, -8, 8),
        spotlightIntensity: range(aurenHeroPreset.spotlight.spotlightIntensity, 0, 16),
        spotlightAngle: range(aurenHeroPreset.spotlight.spotlightAngle, 0.03, 1, 0.001),
        spotlightPenumbra: range(aurenHeroPreset.spotlight.spotlightPenumbra, 0, 1),
        spotlightDistance: range(aurenHeroPreset.spotlight.spotlightDistance, 0, 30),
        spotlightDecay: range(aurenHeroPreset.spotlight.spotlightDecay, 0, 4),
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
        beamSoftness: range(aurenHeroPreset.beam.beamSoftness, 0.2, 2.4),
        beamTopWidth: range(aurenHeroPreset.beam.beamTopWidth, 0.2, 2.5),
        beamBottomWidth: range(aurenHeroPreset.beam.beamBottomWidth, 0.02, 1.2),
        beamHeight: range(aurenHeroPreset.beam.beamHeight, 2, 10),
        beamFalloff: range(aurenHeroPreset.beam.beamFalloff, 0.3, 3),
        beamNoiseAmount: range(aurenHeroPreset.beam.beamNoiseAmount, 0, 1.5)
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
        particleColor: aurenHeroPreset.particles.particleColor,
        particleUpwardFlow: range(aurenHeroPreset.particles.particleUpwardFlow, 0, 3),
        particleDepthStrength: range(aurenHeroPreset.particles.particleDepthStrength, 0.2, 3)
      }),
      "Smoke Atmosphere": folder({
        smokeEnabled: aurenHeroPreset.smoke.smokeEnabled,
        smokeOpacity: range(aurenHeroPreset.smoke.smokeOpacity, 0, 2.5),
        smokeBrightness: range(aurenHeroPreset.smoke.smokeBrightness, 0, 3),
        smokeSpeed: range(aurenHeroPreset.smoke.smokeSpeed, 0, 4),
        smokeRiseSpeed: range(aurenHeroPreset.smoke.smokeRiseSpeed, 0, 4),
        smokeDriftX: range(aurenHeroPreset.smoke.smokeDriftX, -1.5, 1.5, 0.001),
        smokeDriftZ: range(aurenHeroPreset.smoke.smokeDriftZ, -1.5, 1.5, 0.001),
        smokeScale: range(aurenHeroPreset.smoke.smokeScale, 0.2, 3),
        smokeSpread: range(aurenHeroPreset.smoke.smokeSpread, 0.2, 3),
        smokeCurlStrength: range(aurenHeroPreset.smoke.smokeCurlStrength, 0, 3),
        smokeNoiseScale: range(aurenHeroPreset.smoke.smokeNoiseScale, 0.5, 8),
        smokeDissolve: range(aurenHeroPreset.smoke.smokeDissolve, 0.05, 0.95),
        smokeLayerCount: range(aurenHeroPreset.smoke.smokeLayerCount, 1, 56, 1),
        smokeDepthStrength: range(aurenHeroPreset.smoke.smokeDepthStrength, 0.2, 3),
        smokeColor: aurenHeroPreset.smoke.smokeColor,
        smokeWarmthInBeam: range(aurenHeroPreset.smoke.smokeWarmthInBeam, 0, 2),
        smokeBeamInfluence: range(aurenHeroPreset.smoke.smokeBeamInfluence, 0, 3),
        smokeShadowDensity: range(aurenHeroPreset.smoke.smokeShadowDensity, 0, 2),
        smokeLowerDensity: range(aurenHeroPreset.smoke.smokeLowerDensity, 0, 3),
        smokeUpperFade: range(aurenHeroPreset.smoke.smokeUpperFade, 0, 2),
        smokeFrontLayerOpacity: range(aurenHeroPreset.smoke.smokeFrontLayerOpacity, 0, 2),
        smokeMidLayerOpacity: range(aurenHeroPreset.smoke.smokeMidLayerOpacity, 0, 2),
        smokeRearLayerOpacity: range(aurenHeroPreset.smoke.smokeRearLayerOpacity, 0, 2),
        smokeSpawnRadius: range(aurenHeroPreset.smoke.smokeSpawnRadius, 0.2, 3),
        smokeSpawnStrength: range(aurenHeroPreset.smoke.smokeSpawnStrength, 0, 3),
        smokeHeight: range(aurenHeroPreset.smoke.smokeHeight, 0.3, 3),
        smokeLightResponse: range(aurenHeroPreset.smoke.smokeLightResponse, 0, 3),
        smokeShellRadius: range(aurenHeroPreset.smoke.smokeShellRadius, 0.8, 5),
        smokeShellHeight: range(aurenHeroPreset.smoke.smokeShellHeight, 1.5, 7),
        smokeOpenFrontAngle: range(aurenHeroPreset.smoke.smokeOpenFrontAngle, 70, 150, 1)
      }),
      "Reflective Floor": folder({
        floorEnabled: aurenHeroPreset.floor.floorEnabled,
        floorY: range(aurenHeroPreset.floor.floorY, -3, 0),
        floorReflectivity: range(aurenHeroPreset.floor.floorReflectivity, 0, 2.5),
        floorBlur: range(aurenHeroPreset.floor.floorBlur, 0, 2),
        floorRoughness: range(aurenHeroPreset.floor.floorRoughness, 0.01, 1),
        floorMetalness: range(aurenHeroPreset.floor.floorMetalness, 0, 1),
        floorBaseColor: aurenHeroPreset.floor.floorBaseColor,
        floorVeinIntensity: range(aurenHeroPreset.floor.floorVeinIntensity, 0, 2.5),
        floorVeinScale: range(aurenHeroPreset.floor.floorVeinScale, 0.2, 4),
        floorVeinColor: aurenHeroPreset.floor.floorVeinColor,
        floorGlowIntensity: range(aurenHeroPreset.floor.floorGlowIntensity, 0, 2.5),
        floorHotspotStrength: range(aurenHeroPreset.floor.floorHotspotStrength, 0, 3),
        floorHotspotRadius: range(aurenHeroPreset.floor.floorHotspotRadius, 0.05, 1.5),
        floorAtmosphereReflection: range(aurenHeroPreset.floor.floorAtmosphereReflection, 0, 3),
        reflectionStrength: range(aurenHeroPreset.floor.reflectionStrength, 0, 3)
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
        glassTransmission: Number(values.glassTransmission),
        glassOpacity: Number(values.glassOpacity),
        glassIOR: Number(values.glassIOR),
        glassThickness: Number(values.glassThickness),
        glassRoughness: Number(values.glassRoughness),
        glassReflectivity: Number(values.glassReflectivity),
        glassClearcoat: Number(values.glassClearcoat),
        amberTint: String(values.amberTint),
        attenuationDistance: Number(values.attenuationDistance),
        fresnelStrength: Number(values.fresnelStrength),
        fresnelPower: Number(values.fresnelPower),
        edgeHighlightIntensity: Number(values.edgeHighlightIntensity),
        amberGlowIntensity: Number(values.amberGlowIntensity),
        capMetalness: Number(values.capMetalness),
        capRoughness: Number(values.capRoughness),
        labelBoost: Number(values.labelBoost)
      },
      spotlight: {
        spotlightX: Number(values.spotlightX),
        spotlightY: Number(values.spotlightY),
        spotlightZ: Number(values.spotlightZ),
        spotlightIntensity: Number(values.spotlightIntensity),
        spotlightAngle: Number(values.spotlightAngle),
        spotlightPenumbra: Number(values.spotlightPenumbra),
        spotlightDistance: Number(values.spotlightDistance),
        spotlightDecay: Number(values.spotlightDecay),
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
        beamSoftness: Number(values.beamSoftness),
        beamTopWidth: Number(values.beamTopWidth),
        beamBottomWidth: Number(values.beamBottomWidth),
        beamHeight: Number(values.beamHeight),
        beamFalloff: Number(values.beamFalloff),
        beamNoiseAmount: Number(values.beamNoiseAmount)
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
        particleColor: String(values.particleColor),
        particleUpwardFlow: Number(values.particleUpwardFlow),
        particleDepthStrength: Number(values.particleDepthStrength)
      },
      smoke: {
        smokeEnabled: Boolean(values.smokeEnabled),
        smokeOpacity: Number(values.smokeOpacity),
        smokeBrightness: Number(values.smokeBrightness),
        smokeSpeed: Number(values.smokeSpeed),
        smokeRiseSpeed: Number(values.smokeRiseSpeed),
        smokeDriftX: Number(values.smokeDriftX),
        smokeDriftZ: Number(values.smokeDriftZ),
        smokeScale: Number(values.smokeScale),
        smokeSpread: Number(values.smokeSpread),
        smokeCurlStrength: Number(values.smokeCurlStrength),
        smokeNoiseScale: Number(values.smokeNoiseScale),
        smokeDissolve: Number(values.smokeDissolve),
        smokeLayerCount: Number(values.smokeLayerCount),
        smokeDepthStrength: Number(values.smokeDepthStrength),
        smokeColor: String(values.smokeColor),
        smokeWarmthInBeam: Number(values.smokeWarmthInBeam),
        smokeBeamInfluence: Number(values.smokeBeamInfluence),
        smokeShadowDensity: Number(values.smokeShadowDensity),
        smokeLowerDensity: Number(values.smokeLowerDensity),
        smokeUpperFade: Number(values.smokeUpperFade),
        smokeFrontLayerOpacity: Number(values.smokeFrontLayerOpacity),
        smokeMidLayerOpacity: Number(values.smokeMidLayerOpacity),
        smokeRearLayerOpacity: Number(values.smokeRearLayerOpacity),
        smokeSpawnRadius: Number(values.smokeSpawnRadius),
        smokeSpawnStrength: Number(values.smokeSpawnStrength),
        smokeHeight: Number(values.smokeHeight),
        smokeLightResponse: Number(values.smokeLightResponse),
        smokeShellRadius: Number(values.smokeShellRadius),
        smokeShellHeight: Number(values.smokeShellHeight),
        smokeOpenFrontAngle: Number(values.smokeOpenFrontAngle),
        smokeLayerDepth: aurenHeroPreset.smoke.smokeLayerDepth
      },
      floor: {
        floorEnabled: Boolean(values.floorEnabled),
        floorY: Number(values.floorY),
        floorReflectivity: Number(values.floorReflectivity),
        floorBlur: Number(values.floorBlur),
        floorRoughness: Number(values.floorRoughness),
        floorMetalness: Number(values.floorMetalness),
        floorBaseColor: String(values.floorBaseColor),
        floorVeinIntensity: Number(values.floorVeinIntensity),
        floorVeinScale: Number(values.floorVeinScale),
        floorVeinColor: String(values.floorVeinColor),
        floorGlowIntensity: Number(values.floorGlowIntensity),
        floorHotspotStrength: Number(values.floorHotspotStrength),
        floorHotspotRadius: Number(values.floorHotspotRadius),
        floorAtmosphereReflection: Number(values.floorAtmosphereReflection),
        reflectionStrength: Number(values.reflectionStrength)
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
