uniform vec3 uColor;
uniform float uTime;
uniform float uOpacity;
uniform float uColorIntensity;

varying float vAlpha;
varying float vPathT;
varying float vPipeRadius;
varying float vPhase;
varying float vSpark;

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

  for (int i = 0; i < 4; i++) {
    value += noise(p) * amplitude;
    p = rotate * p * 2.03 + 0.17;
    amplitude *= 0.54;
  }

  return value;
}

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float core = 1.0 - smoothstep(0.012, 0.075, d);
  float halo = 1.0 - smoothstep(0.055, 0.5, d);
  float edge = 1.0 - smoothstep(0.42, 0.5, d);
  vec2 smokeUv = vec2(vPathT * 8.0 + uTime * 0.08, vPhase * 6.0) + uv * 2.8;
  float broad = fbm(smokeUv);
  float filament = fbm(smokeUv * vec2(4.8, 0.72) + vec2(1.8, -uTime * 0.12));
  float smokeMask = smoothstep(0.25, 0.94, broad * 0.58 + filament * 0.42);
  float glint = pow(max(0.0, 1.0 - d * 3.25), 5.0) * vSpark;
  float particle = (halo * 0.48 + core * 0.32 + glint * 0.42) * edge * smokeMask;
  float pipeGlow = 1.0 - smoothstep(0.34, 1.0, vPipeRadius);
  vec3 hotGold = vec3(1.0, 0.82, 0.36);
  vec3 color = mix(uColor, hotGold, glint * 0.58 + pipeGlow * 0.12) * uColorIntensity;

  gl_FragColor = vec4(color, particle * vAlpha * uOpacity);
}
