attribute float aSideSign;
attribute vec3 aSideDir;

uniform float uTime;
uniform float uSpeed;
uniform float uCurlStrength;
uniform float uRibbonWidth;
uniform float uSeed;
uniform float uLowerMist;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vSideDistance;
varying float vRibbonT;

void main() {
  vUv = uv;
  vRibbonT = uv.y;
  vSideDistance = abs(uv.x - 0.5) * 2.0;

  float time = uTime * uSpeed;
  float seed = uSeed * 6.2831853;
  float lowerMistDamp = mix(1.0, 0.42, uLowerMist);
  vec3 transformed = position + aSideDir * aSideSign * uRibbonWidth;
  float centerWeight = 1.0 - vSideDistance * 0.36;
  float riseWave = sin(uv.y * 8.4 - time * 0.5 + seed) * 0.055;
  float longCurl = sin(uv.y * 4.2 + time * 0.22 + seed * 1.2) * 0.11;
  float crossCurl = sin(uv.y * 13.0 + uv.x * 5.5 - time * 0.35 + seed) * 0.045;
  float softTorsion = sin(uv.y * 5.0 + time * 0.18 + seed * 0.7) * aSideSign;

  transformed.x += (longCurl + crossCurl) * uCurlStrength * centerWeight * lowerMistDamp;
  transformed.y += riseWave * uCurlStrength * centerWeight * lowerMistDamp;
  transformed.z +=
    (softTorsion * 0.075 + sin(uv.y * 7.2 - time * 0.24 + seed) * 0.04) *
    uCurlStrength *
    centerWeight;

  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
