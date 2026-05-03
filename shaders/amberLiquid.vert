uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec3 transformed = position;
  transformed.y += sin((position.x * 8.0) + uTime * 1.2) * 0.015;
  transformed.z += sin((position.y * 7.0) + uTime * 0.9) * 0.01;

  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
