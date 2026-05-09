uniform vec3 uColor;
uniform float uOpacity;
uniform float uIntensity;
uniform float uSoftness;
uniform float uFalloff;
uniform float uNoiseAmount;

varying vec2 vUv;
varying float vHeight;
varying float vFacing;
varying vec3 vWorldPosition;
varying float vRadial;

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
  float amplitude = 0.52;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = mat2(0.82, -0.57, 0.57, 0.82) * p * 2.04 + 0.19;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  float vertical = smoothstep(0.015, 0.22, vHeight) * smoothstep(1.0, 0.12, vHeight);
  float topFalloff = mix(0.62, 1.62, pow(smoothstep(0.05, 1.0, vHeight), 0.72));
  float bottomFocus = 1.0 - smoothstep(0.0, 0.54 * uSoftness, vRadial);
  float center = 1.0 - smoothstep(0.0, 0.48 * uSoftness, abs(vUv.x - 0.5));
  float shell = mix(0.28, 0.94, 1.0 - smoothstep(0.04, 0.86, vFacing));
  float turbulence = fbm(vWorldPosition.xz * 0.72 + vec2(vHeight * 1.3, vHeight * -0.8));
  float striation = 0.78 + 0.22 * sin(vHeight * 42.0 + vUv.x * 12.0 + turbulence * 2.2);
  float noisyFeather = mix(1.0, 0.72 + turbulence * 0.48, uNoiseAmount);
  float falloff = pow(vertical, max(uFalloff, 0.2));
  float alpha = (shell * 0.24 + center * 0.2 + bottomFocus * 0.22) *
    falloff * topFalloff * striation * noisyFeather * 0.13;

  gl_FragColor = vec4(uColor * uIntensity, alpha * uOpacity);
}
