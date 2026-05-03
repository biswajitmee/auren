uniform float uTime;
uniform float uSize;
uniform float uScroll;
uniform float uTwinkle;
uniform float uBeamDensity;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;
varying float vTwinkle;

void main() {
  vec3 transformed = position;
  float drift = sin(uTime * (0.16 + aPhase * 0.08) + aPhase * 6.2831);
  transformed.y += drift * 0.11;
  transformed.x += cos(uTime * 0.12 + position.z * 0.42 + aPhase) * 0.055;
  transformed.z += sin(uTime * 0.09 + position.x * 0.3 + aPhase) * 0.045;
  transformed.y += fract(aPhase + uTime * 0.018) * 0.16;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * (1.0 / -mvPosition.z);
  float heroFade = mix(1.0, 0.42, smoothstep(0.18, 0.76, uScroll));
  float beamBoost = mix(1.0, uBeamDensity, 1.0 - smoothstep(0.0, 1.65, length(position.xz)));
  vAlpha = clamp(aScale * 1.18 * beamBoost, 0.16, 1.35) * heroFade;
  vTwinkle = mix(1.0, 0.55 + 0.45 * sin(uTime * 2.4 + aPhase * 17.0), uTwinkle);
}
