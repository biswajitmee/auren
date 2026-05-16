uniform float uTime;
uniform float uRadius;
uniform float uHeight;
uniform float uTurns;
uniform float uTubeRadius;
uniform float uSize;
uniform float uSpeed;
uniform float uNoiseStrength;
uniform float uSmokeCurl;

attribute float aProgress;
attribute float aPipeAngle;
attribute float aPipeRadius;
attribute float aScale;
attribute float aPhase;

varying float vAlpha;
varying float vPathT;
varying float vPipeRadius;
varying float vPhase;
varying float vSpark;

const float PI = 3.141592653589793;
const float TAU = 6.283185307179586;

void main() {
  float flow = uTime * uSpeed * 0.055;
  float t = fract(aProgress + flow + aPhase * 0.003);
  float angle = t * max(uTurns, 0.001) * TAU;
  float radius = max(uRadius, 0.001);
  float height = max(uHeight, 0.001);

  vec3 center = vec3(cos(angle) * radius, (t - 0.5) * height, sin(angle) * radius);
  float slope = height / max(uTurns * TAU, 0.001);
  vec3 tangent = normalize(vec3(-sin(angle) * radius, slope, cos(angle) * radius));
  vec3 normal = normalize(vec3(cos(angle), 0.0, sin(angle)));
  vec3 binormal = normalize(cross(tangent, normal));

  float curlWave = sin(t * 21.0 + aPhase * TAU + uTime * 0.44);
  float smokeWave = sin(t * 37.0 - uTime * 0.38 + aPhase * 11.0) *
    cos(t * 13.0 + uTime * 0.21 + aPhase * 5.0);
  float pipeAngle = aPipeAngle + uTime * (0.11 + aPhase * 0.035) + curlWave * uSmokeCurl * 0.34;
  float pipeRadius = uTubeRadius * (0.12 + aPipeRadius * 0.88);
  vec3 pipeOffset =
    normal * cos(pipeAngle) * pipeRadius +
    binormal * sin(pipeAngle) * pipeRadius;

  center += pipeOffset;
  center += normal * smokeWave * uTubeRadius * uNoiseStrength * 0.52;
  center += binormal * curlWave * uTubeRadius * uSmokeCurl * 0.28;

  vec4 mvPosition = modelViewMatrix * vec4(center, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * (1.0 / -mvPosition.z);

  float pulse = 0.72 + 0.28 * sin(uTime * 1.6 + aPhase * 18.0 + t * TAU);
  float vaporWeight = 0.62 + 0.38 * sin(t * 18.0 + aPhase * 9.0 - uTime * 0.6);
  vAlpha = clamp(aScale * pulse * vaporWeight, 0.08, 1.35);
  vPathT = t;
  vPipeRadius = aPipeRadius;
  vPhase = aPhase;
  vSpark = pulse;
}
