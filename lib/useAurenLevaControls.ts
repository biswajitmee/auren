"use client";

import { button, folder, useControls } from "leva";
import { useEffect } from "react";

import { AurenHeroPreset, aurenHeroPreset } from "@/lib/auren-hero-preset";
import { getAurenSceneSnapshot, useAurenSceneStore } from "@/lib/useAurenSceneStore";
import { serializeAurenHeroPreset } from "@/lib/serializeAurenHeroPreset";

function range(value: number, min: number, max: number, step = 0.01) {
  return { value, min, max, step };
}

function serializePreset() {
  const snapshot = getAurenSceneSnapshot();
  return serializeAurenHeroPreset(snapshot);
}

let presetSaveTimer: number | null = null;

function createBuildPreset(controls: AurenHeroPreset): AurenHeroPreset {
  return {
    ...aurenHeroPreset,
    enableLevaOverrides: true,
    particles: controls.particles,
    goldHelix: controls.goldHelix
  };
}

function persistPreset(preset: AurenHeroPreset) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  if (presetSaveTimer !== null) {
    window.clearTimeout(presetSaveTimer);
  }

  presetSaveTimer = window.setTimeout(() => {
    void fetch("/api/auren-hero-preset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preset)
    }).catch((error) => {
      console.warn("Unable to save Auren hero preset", error);
    });
    presetSaveTimer = null;
  }, 500);
}

export function useAurenLevaControls(enabled: boolean) {
  const setControls = useAurenSceneStore((state) => state.setControls);

  const [values] = useControls(
    "AUREN NOIR / Hero Scene",
    () => ({
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
      "Golden Helix Particles": folder({
        helixEnabled: aurenHeroPreset.goldHelix.helixEnabled,
        helixRadius: range(aurenHeroPreset.goldHelix.helixRadius, 0.04, 0.72, 0.001),
        helixHeight: range(aurenHeroPreset.goldHelix.helixHeight, 0.18, 2.4, 0.001),
        helixTurns: range(aurenHeroPreset.goldHelix.helixTurns, 0.4, 8, 0.001),
        helixTubeRadius: range(aurenHeroPreset.goldHelix.helixTubeRadius, 0.004, 0.32, 0.001),
        helixParticleCount: range(aurenHeroPreset.goldHelix.helixParticleCount, 0, 2400, 1),
        helixParticleSize: range(aurenHeroPreset.goldHelix.helixParticleSize, 0.1, 4),
        helixParticleSpeed: range(aurenHeroPreset.goldHelix.helixParticleSpeed, 0, 4),
        helixParticleOpacity: range(aurenHeroPreset.goldHelix.helixParticleOpacity, 0, 2.5),
        helixParticleColor: aurenHeroPreset.goldHelix.helixParticleColor,
        helixColorIntensity: range(aurenHeroPreset.goldHelix.helixColorIntensity, 0, 3),
        helixSmokeCurl: range(aurenHeroPreset.goldHelix.helixSmokeCurl, 0, 3),
        helixNoiseStrength: range(aurenHeroPreset.goldHelix.helixNoiseStrength, 0, 2)
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
        smokeRibbonWidth: range(aurenHeroPreset.smoke.smokeRibbonWidth, 0.25, 2.5),
        smokeEdgeSoftness: range(aurenHeroPreset.smoke.smokeEdgeSoftness, 0.05, 0.95),
        smokeLightInfluence: range(aurenHeroPreset.smoke.smokeLightInfluence, 0, 3),
        smokeLeftIntensity: range(aurenHeroPreset.smoke.smokeLeftIntensity, 0, 2),
        smokeRightIntensity: range(aurenHeroPreset.smoke.smokeRightIntensity, 0, 2),
        smokeRearIntensity: range(aurenHeroPreset.smoke.smokeRearIntensity, 0, 2),
        smokeLowerMistIntensity: range(aurenHeroPreset.smoke.smokeLowerMistIntensity, 0, 2),
        smokeCenterClearRadius: range(aurenHeroPreset.smoke.smokeCenterClearRadius, 0.3, 2.4),
        smokeLayerCount: range(aurenHeroPreset.smoke.smokeLayerCount, 1, 56, 1),
        smokeLayerDepth: range(aurenHeroPreset.smoke.smokeLayerDepth, 0.2, 3),
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
      enableLevaOverrides: true,
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
      goldHelix: {
        helixEnabled: Boolean(values.helixEnabled),
        helixRadius: Number(values.helixRadius),
        helixHeight: Number(values.helixHeight),
        helixTurns: Number(values.helixTurns),
        helixTubeRadius: Number(values.helixTubeRadius),
        helixParticleCount: Number(values.helixParticleCount),
        helixParticleSize: Number(values.helixParticleSize),
        helixParticleSpeed: Number(values.helixParticleSpeed),
        helixParticleOpacity: Number(values.helixParticleOpacity),
        helixParticleColor: String(values.helixParticleColor),
        helixColorIntensity: Number(values.helixColorIntensity),
        helixSmokeCurl: Number(values.helixSmokeCurl),
        helixNoiseStrength: Number(values.helixNoiseStrength)
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
        smokeRibbonWidth: Number(values.smokeRibbonWidth),
        smokeEdgeSoftness: Number(values.smokeEdgeSoftness),
        smokeLightInfluence: Number(values.smokeLightInfluence),
        smokeLeftIntensity: Number(values.smokeLeftIntensity),
        smokeRightIntensity: Number(values.smokeRightIntensity),
        smokeRearIntensity: Number(values.smokeRearIntensity),
        smokeLowerMistIntensity: Number(values.smokeLowerMistIntensity),
        smokeCenterClearRadius: Number(values.smokeCenterClearRadius),
        smokeLayerCount: Number(values.smokeLayerCount),
        smokeLayerDepth: Number(values.smokeLayerDepth),
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
        smokeOpenFrontAngle: Number(values.smokeOpenFrontAngle)
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
    persistPreset(createBuildPreset(nextControls));
  }, [enabled, setControls, values]);
}
