uniform vec3 uAccent;
uniform float uOpacity;
uniform float uTime;

varying vec2 vUv;
varying vec3 vViewPosition;

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

void main() {
  vec2 uv = vUv;
  vec2 centered = abs(uv - 0.5);
  float edge = max(centered.x / 0.5, centered.y / 0.5);
  float rim = smoothstep(0.68, 1.0, edge);
  float topFlare = smoothstep(0.78, 1.0, uv.y) * (1.0 - smoothstep(0.1, 0.5, abs(uv.x - 0.5)));
  float sideGlow = smoothstep(0.42, 0.5, centered.x) * (0.36 + 0.64 * smoothstep(0.1, 0.94, uv.y));
  float scan = smoothstep(0.02, 0.0, abs(uv.y - (0.82 + sin(uTime * 0.48 + uv.x * 9.0) * 0.025)));
  float grain = noise(uv * vec2(34.0, 48.0) + uTime * 0.045);
  float viewSheen = pow(1.0 - abs(normalize(vViewPosition).z), 2.2);

  vec3 base = vec3(0.012, 0.011, 0.01);
  vec3 color = base;
  color += uAccent * (rim * 0.28 + sideGlow * 0.18 + topFlare * 0.72 + scan * 0.62);
  color += vec3(0.8, 0.63, 0.38) * grain * 0.035;
  color += vec3(1.0, 0.9, 0.72) * viewSheen * 0.05;

  float alpha = (0.08 + rim * 0.22 + sideGlow * 0.18 + topFlare * 0.18 + scan * 0.16 + grain * 0.035) * uOpacity;
  gl_FragColor = vec4(color, alpha);
}
