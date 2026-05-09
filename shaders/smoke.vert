uniform float uTime;
uniform float uSpeed;
uniform float uRiseSpeed;
uniform float uCurlStrength;
uniform float uLayerSeed;
uniform float uDriftX;
uniform float uDriftZ;
uniform float uDepthStrength;

varying vec2 vUv;
varying vec2 vFlowUv;
varying vec3 vWorldPosition;
varying float vLowerWeight;
varying float vEdgeWeight;
varying float vRibbonWave;

void main() {
  vUv = uv;

  float time = uTime * uSpeed;
  float seed = uLayerSeed * 6.2831853;
  vec3 transformed = position;
  float lower = 1.0 - smoothstep(0.0, 0.82, uv.y);
  float edgeWeight = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x);
  float longWave = sin(uv.y * 4.7 + time * 0.22 + seed) * 0.16;
  float ribbonCurl = sin(uv.y * 8.8 + uv.x * 2.2 + time * 0.32 + seed) * 0.095;
  float crossCurl = sin(uv.x * 12.0 + uv.y * 5.0 + time * 0.24 + seed) * 0.058;
  float liftedCurl = sin(uv.y * 14.0 - time * 0.2 + seed * 1.7) * 0.055;
  float sideSlip = sin(uv.y * 2.2 + seed * 0.7 + time * 0.1);

  transformed.x += (longWave + ribbonCurl + crossCurl) * uCurlStrength * (0.55 + lower * 0.85);
  transformed.x += uDriftX * (uv.y - 0.5) * (0.45 + lower * 0.35);
  transformed.y += liftedCurl * uCurlStrength * edgeWeight;
  transformed.z *= uDepthStrength;
  transformed.z += sin(uv.x * 5.5 + uv.y * 8.0 + time * 0.2 + seed) * 0.14 * uCurlStrength;
  transformed.z += uDriftZ * sideSlip * (0.2 + lower * 0.28);

  float flow = fract(uv.y - time * uRiseSpeed * 0.045 + uLayerSeed);
  vFlowUv = vec2(uv.x + sin(time * 0.1 + uv.y * 3.0 + seed) * 0.1, flow);
  vLowerWeight = lower;
  vEdgeWeight = edgeWeight;
  vRibbonWave = longWave;

  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
