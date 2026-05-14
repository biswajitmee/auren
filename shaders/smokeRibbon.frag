uniform float uTime;
uniform float uOpacity;
uniform float uSpeed;
uniform float uNoiseScale;
uniform float uCurlStrength;
uniform float uDissolve;
uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uBeamCenter;
uniform float uBeamRadius;
uniform float uBeamInfluence;
uniform float uWarmth;
uniform float uEdgeSoftness;
uniform float uBrightness;
uniform float uSeed;
uniform float uCenterClearRadius;
uniform float uCenterAvoidance;
uniform float uLowerMist;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vSideDistance;
varying float vRibbonT;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.82, -0.57, 0.57, 0.82);

  for (int i = 0; i < 5; i++) {
    value += noise(p) * amplitude;
    p = rotate * p * 2.04 + 0.19;
    amplitude *= 0.52;
  }

  return value;
}

void main() {
  float time = uTime * uSpeed;
  float seed = uSeed * 6.2831853;
  float edgeStart = clamp(1.0 - uEdgeSoftness, 0.02, 0.92);
  float edgeFade = 1.0 - smoothstep(edgeStart, 1.0, vSideDistance);
  float startFade = smoothstep(0.0, 0.08, vRibbonT);
  float endFade = 1.0 - smoothstep(0.84, 1.0, vRibbonT);
  float upperFade = mix(1.0 - smoothstep(0.74, 1.0, vRibbonT) * 0.52, 0.92, uLowerMist);
  vec2 flowUv = vec2(
    vUv.x * 2.35 + sin(vRibbonT * 5.2 + seed) * 0.22,
    vRibbonT * mix(3.6, 1.7, uLowerMist) - time * 0.18 + uSeed * 2.1
  ) * uNoiseScale;
  float broad = fbm(flowUv + vec2(0.0, time * 0.035));
  float curl = fbm(flowUv * vec2(1.8, 1.18) + vec2(seed * 0.11, -time * 0.04));
  float filamentNoise = fbm(flowUv * vec2(5.2, 0.68) + vec2(1.7, seed));
  float hairNoise = fbm(flowUv * vec2(11.0, 0.32) + vec2(-0.7, 2.4));
  float centerA =
    0.5 +
    sin(vRibbonT * 6.0 - time * 0.28 + seed) * 0.09 * uCurlStrength +
    (broad - 0.5) * 0.18;
  float centerB =
    0.5 +
    sin(vRibbonT * 8.8 + time * 0.2 + seed * 1.6) * 0.13 +
    (curl - 0.5) * 0.22;
  float strandA = 1.0 - smoothstep(0.025, 0.21, abs(vUv.x - centerA));
  float strandB = 1.0 - smoothstep(0.018, 0.16, abs(vUv.x - centerB));
  float broadBody = 1.0 - smoothstep(0.28, 0.96, vSideDistance);
  float breakupNoise = smoothstep(
    uDissolve * 0.58,
    1.0,
    broad * 0.42 + curl * 0.25 + filamentNoise * 0.22 + hairNoise * 0.16
  );
  float breakup = mix(0.34, 1.0, breakupNoise);
  float wisps = max(strandA * (0.66 + filamentNoise * 0.34), strandB * 0.62);
  float alpha =
    (broadBody * 0.38 + wisps * 0.72 + edgeFade * hairNoise * 0.14) *
    edgeFade *
    startFade *
    endFade *
    upperFade *
    breakup;

  float beamDistance = length(vWorldPosition.xz - uBeamCenter.xz);
  float beamCore = 1.0 - smoothstep(uBeamRadius * 0.16, uBeamRadius * 0.82, beamDistance);
  float beamFeather = 1.0 - smoothstep(uBeamRadius * 0.38, uBeamRadius * 1.45, beamDistance);
  float beamHeight = smoothstep(-1.45, 0.1, vWorldPosition.y) * (1.0 - smoothstep(3.2, 5.2, vWorldPosition.y));
  float beamMask = (beamCore * 0.58 + beamFeather * 0.42) * beamHeight * uBeamInfluence;
  float centerDistance = length(vec2(vWorldPosition.x, (vWorldPosition.y - 0.05) * 0.72));
  float centerClear = smoothstep(uCenterClearRadius * 0.58, uCenterClearRadius, centerDistance);
  float centerProtection = mix(1.0, centerClear, uCenterAvoidance * (1.0 - uLowerMist * 0.45));
  float litEdge = smoothstep(0.48, 0.9, vSideDistance) * beamMask;

  alpha *= centerProtection;
  alpha *= 2.15;
  alpha *= mix(0.78, 1.48, clamp(beamMask, 0.0, 1.0));
  alpha *= mix(1.0, 0.72, uLowerMist);

  vec3 shadowSmoke = uColor * (0.72 + broad * 0.22 + wisps * 0.2);
  float warmth = clamp(beamMask * uWarmth + litEdge * 0.45, 0.0, 1.0);
  vec3 litSmoke = mix(shadowSmoke, uLightColor, warmth);
  vec3 color = litSmoke * uBrightness * (0.82 + beamMask * 0.92 + litEdge * 0.36);

  gl_FragColor = vec4(color, alpha * uOpacity);
}
