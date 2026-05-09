uniform vec3 uColor;
uniform vec3 uBeamPosition;
uniform vec3 uWarmColor;
uniform float uOpacity;
uniform float uBrightness;
uniform float uNoiseScale;
uniform float uDissolve;
uniform float uLightResponse;
uniform float uBeamInfluence;
uniform float uWarmthInBeam;
uniform float uShadowDensity;
uniform float uBeamRadius;
uniform float uBeamHeight;
uniform float uBeamTopWidth;
uniform float uBeamBottomWidth;
uniform float uBeamFalloff;
uniform float uLowerDensity;
uniform float uUpperFade;
uniform float uLayerOpacity;
uniform float uFloorHotspotStrength;
uniform float uFloorHotspotRadius;

varying vec2 vUv;
varying vec2 vFlowUv;
varying vec3 vWorldPosition;
varying float vLowerWeight;
varying float vEdgeWeight;
varying float vRibbonWave;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.8, -0.6, 0.6, 0.8);

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotate * p * 2.03 + 0.17;
    amplitude *= 0.52;
  }

  return value;
}

void main() {
  float sideFade = smoothstep(0.0, 0.26, vUv.x) * smoothstep(1.0, 0.74, vUv.x);
  float upperMask = smoothstep(1.0, 0.1 + uUpperFade * 0.42, vUv.y);
  float verticalFade = smoothstep(0.0, 0.08, vUv.y) * upperMask;
  vec2 movingUv = vFlowUv * vec2(1.05, 2.85) * uNoiseScale;
  float broad = fbm(movingUv + vec2(vRibbonWave * 0.9, 0.0));
  float filament = fbm(movingUv * vec2(4.8, 0.62) + vec2(1.7, -0.4));
  float hair = fbm(movingUv * vec2(9.0, 0.36) + vec2(-0.8, 2.4));
  float centerLine = 0.5 + (broad - 0.5) * 0.52 + vRibbonWave * 0.52;
  float strand = 1.0 - smoothstep(0.035, 0.28, abs(vUv.x - centerLine));
  float lace = smoothstep(uDissolve * 0.72, 1.0, broad * 0.5 + filament * 0.34 + hair * 0.24);
  float vapor = pow(lace, 1.28);
  float panelBreakup = smoothstep(0.18, 0.92, fbm(movingUv * vec2(0.72, 1.55) + 3.7));
  float lowerDensity = mix(0.34, 1.0 + uLowerDensity * 0.42, vLowerWeight);

  float beamStart = uBeamPosition.y - uBeamHeight * 0.5;
  float beamT = clamp((vWorldPosition.y - beamStart) / max(uBeamHeight, 0.001), 0.0, 1.0);
  float heightMask = smoothstep(0.0, 0.18, beamT) * smoothstep(1.0, 0.24, beamT);
  float beamWidth = mix(uBeamBottomWidth, uBeamTopWidth, pow(beamT, 0.72)) * uBeamRadius;
  float beamDistance = length(vWorldPosition.xz - uBeamPosition.xz);
  float beamCore = 1.0 - smoothstep(beamWidth * 0.16, beamWidth, beamDistance);
  float beamFeather = 1.0 - smoothstep(beamWidth * 0.34, beamWidth * max(uBeamFalloff, 0.2), beamDistance);
  float beamMask = (beamCore * 0.42 + beamFeather * 0.72) * heightMask * uBeamInfluence;
  float floorDistance = length(vWorldPosition.xz * vec2(1.15, 1.0));
  float floorGlow = (1.0 - smoothstep(0.0, uFloorHotspotRadius * 3.4, floorDistance)) *
    smoothstep(-1.55, -0.18, vWorldPosition.y) * uFloorHotspotStrength;

  float alpha = vapor * pow(strand, 1.42) * pow(sideFade, 1.65) * verticalFade * lowerDensity * panelBreakup;
  float edgeLight = (1.0 - vEdgeWeight) * 0.34 + strand * 0.18;
  alpha *= 1.0 + beamMask * uLightResponse * 0.62 + floorGlow * 0.16 + edgeLight * beamMask;
  alpha *= uLayerOpacity;

  vec3 shadowed = uColor * (1.0 - uShadowDensity * (1.0 - beamMask) * 0.42);
  vec3 lit = mix(shadowed, uWarmColor, clamp(beamMask * uWarmthInBeam + floorGlow * 0.24, 0.0, 1.0));
  vec3 color = lit * uBrightness * (0.62 + beamMask * 0.78 + floorGlow * 0.18);

  gl_FragColor = vec4(color, alpha * uOpacity);
}
