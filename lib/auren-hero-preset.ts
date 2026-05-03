export const aurenHeroPreset = {
  enableLevaOverrides: false,
  camera: {
    cameraX: 0,
    cameraY: 0.12,
    cameraZ: 7.2,
    cameraFov: 34,
    targetX: 0,
    targetY: 0.04,
    targetZ: 0,
    cameraDamping: 2.4,
    enableHeroBreathing: true,
    breathingAmount: 0.018
  },
  environment: {
    particleIntensity: 1,
    smokeOpacity: 1,
    godRayIntensity: 1,
    floorReflection: 1,
    amberGlow: 1,
    bloomIntensity: 1
  },
  bottle: {
    bottleX: 0,
    bottleY: 0,
    bottleZ: 0,
    bottleRotX: 0,
    bottleRotY: 0,
    bottleRotZ: 0,
    bottleScale: 1,
    idleFloatAmount: 0.045,
    idleFloatSpeed: 0.8,
    idleRotationSpeed: 0.08,
    cursorTiltAmount: 0.08,
    cursorTiltEnabled: true,
    glassOpacity: 0.86,
    glassRoughness: 0.12,
    glassTransmission: 0.12,
    glassIOR: 1.48,
    glassThickness: 0.52,
    amberGlowIntensity: 0.18,
    capMetalness: 0.16,
    capRoughness: 0.12
  },
  spotlight: {
    spotlightX: 0.05,
    spotlightY: 8.9,
    spotlightZ: 1.35,
    spotlightIntensity: 7.2,
    spotlightAngle: 0.18,
    spotlightPenumbra: 0.92,
    spotlightDistance: 0,
    spotlightColor: "#F0D08A"
  },
  rim: {
    rimX: -2.6,
    rimY: 2.2,
    rimZ: 2.7,
    rimIntensity: 0.92,
    rimColor: "#E6BF64"
  },
  beam: {
    beamEnabled: true,
    beamX: 0,
    beamY: 1.64,
    beamZ: -1.08,
    beamScaleX: 1,
    beamScaleY: 1,
    beamScaleZ: 1,
    beamOpacity: 1,
    beamIntensity: 1,
    beamColor: "#E7C66E",
    beamSoftness: 1
  },
  particles: {
    particlesEnabled: true,
    particleDensity: 1,
    particleOpacity: 1,
    particleSize: 1,
    particleSpeed: 1,
    particleSpread: 1,
    particleBeamDensity: 1,
    particleTwinkle: 1,
    particleColor: "#D8B65D"
  },
  smoke: {
    smokeEnabled: true,
    smokeOpacity: 1,
    smokeSpeed: 1,
    smokeScale: 1,
    smokeSpread: 1,
    smokeCurlStrength: 1,
    smokeColor: "#E8D3AA",
    smokeLayerDepth: 1
  },
  floor: {
    floorEnabled: true,
    floorY: -1.42,
    floorReflectivity: 1,
    floorBlur: 0.78,
    floorRoughness: 0.22,
    floorMetalness: 0.68,
    floorVeinIntensity: 1,
    floorGlowIntensity: 1,
    floorColor: "#090705",
    veinColor: "#E49E38"
  },
  postfx: {
    bloomEnabled: true,
    bloomIntensity: 0.66,
    bloomThreshold: 0.34,
    vignetteDarkness: 0.84,
    vignetteOffset: 0.2,
    grainOpacity: 0.022,
    dofEnabled: true,
    chromaticAberrationEnabled: true,
    chromaticOffset: 0.00028
  },
  debug: {
    showHelpers: false,
    showAxes: false,
    freezeAnimations: false,
    performanceMode: "high" as "high" | "medium" | "low"
  }
};

export type AurenHeroPreset = typeof aurenHeroPreset;
