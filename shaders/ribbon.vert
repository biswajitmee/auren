uniform float uTime;
uniform float uCurlStrength;

varying vec2 vUv;
varying float vWave;

void main() {
  vUv = uv;
  vec3 transformed = position;
  float wave = sin(uv.x * 8.0 + uv.y * 5.0 + uTime * 0.28);
  transformed.y += wave * 0.055 * uCurlStrength;
  transformed.x += sin(uv.y * 9.0 + uTime * 0.36) * 0.045 * uCurlStrength;
  vWave = sin(uv.x * 13.0 + uv.y * 5.5 + uTime * 0.42) * 0.5 + 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
