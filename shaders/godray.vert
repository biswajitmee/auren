uniform float uTime;
uniform float uTopWidth;
uniform float uBottomWidth;
uniform float uNoiseAmount;

varying vec2 vUv;
varying float vHeight;
varying float vFacing;
varying vec3 vWorldPosition;
varying float vRadial;

void main() {
  vUv = uv;
  vHeight = position.y + 0.5;

  float radius = mix(uBottomWidth, uTopWidth, smoothstep(0.0, 1.0, vHeight));
  float breathing = sin(vHeight * 18.0 + uTime * 0.35) * 0.012;
  float drift = sin(position.x * 4.0 + position.z * 3.0 + vHeight * 11.0 + uTime * 0.18) * 0.025 * uNoiseAmount;
  vec3 transformed = position;
  transformed.xz *= radius + breathing + drift;
  vRadial = length(position.xz);

  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vWorldPosition = worldPosition.xyz;
  vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
  vec3 viewDirection = normalize(cameraPosition - worldPosition.xyz);
  vFacing = abs(dot(worldNormal, viewDirection));

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
