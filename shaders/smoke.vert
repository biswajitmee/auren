uniform float uTime;
uniform float uSize;
uniform float uScroll;
uniform float uVerticalDrift;
uniform float uCurlStrength;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;

void main() {
  vec3 transformed = position;
  transformed.x += sin(uTime * 0.12 + position.y + aPhase) * 0.26 * uCurlStrength;
  transformed.y += cos(uTime * 0.08 + position.x + aPhase) * 0.11 * uVerticalDrift;
  transformed.z += sin(uTime * 0.06 + position.y * 0.7 + aPhase) * 0.18 * uCurlStrength;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * (1.0 / -mvPosition.z);
  vAlpha = clamp(aScale * 0.42, 0.08, 0.36) * mix(0.9, 1.45, smoothstep(0.45, 0.62, uScroll));
}
