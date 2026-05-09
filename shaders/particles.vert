uniform float uTime;
uniform float uSize;
uniform float uScroll;
uniform float uTwinkle;
uniform float uBeamDensity;
uniform float uUpwardFlow;
uniform float uDepthStrength;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;
varying float vTwinkle;
varying float vBeam;

void main() {
  vec3 transformed = position;
  transformed.z *= uDepthStrength;
  float drift = sin(uTime * (0.16 + aPhase * 0.08) + aPhase * 6.2831);
  float upwardLoop = fract((position.y + 2.0) / 5.7 + uTime * 0.018 * uUpwardFlow + aPhase * 0.17);
  transformed.y = mix(transformed.y, -2.0 + upwardLoop * 5.7, clamp(uUpwardFlow, 0.0, 1.0));
  transformed.y += drift * 0.11;
  transformed.x += cos(uTime * 0.12 + position.z * 0.42 + aPhase) * 0.055;
  transformed.z += sin(uTime * 0.09 + position.x * 0.3 + aPhase) * 0.045;
  transformed.y += fract(aPhase + uTime * 0.018) * 0.16 * uUpwardFlow;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * (1.0 / -mvPosition.z);
  float heroFade = mix(1.0, 0.42, smoothstep(0.18, 0.76, uScroll));
  vBeam = 1.0 - smoothstep(0.0, 1.65, length(transformed.xz));
  float beamBoost = mix(1.0, uBeamDensity, vBeam);
  vAlpha = clamp(aScale * 1.18 * beamBoost, 0.16, 1.35) * heroFade;
  vTwinkle = mix(1.0, 0.55 + 0.45 * sin(uTime * 2.4 + aPhase * 17.0), uTwinkle);
}
