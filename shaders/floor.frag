uniform float uTime;
uniform float uOpacity;
uniform vec3 uBaseColor;
uniform vec3 uVeinColor;

varying vec2 vUv;

float lineField(vec2 uv, float offset) {
  float a = sin((uv.x * 14.0 + uv.y * 3.4 + offset) * 3.14159);
  float b = sin((uv.x * 3.8 - uv.y * 12.0 - offset * 0.6) * 3.14159);
  float crack = abs(a * 0.58 + b * 0.42);
  return 1.0 - smoothstep(0.002, 0.014, crack);
}

void main() {
  vec2 uv = vUv - 0.5;
  vec2 stretched = uv * vec2(0.82, 1.42);
  float radial = 1.0 - smoothstep(0.08, 0.62, length(stretched));
  float cracks = max(lineField(vUv, 0.14), lineField(vUv * 1.62, 0.47) * 0.55);
  float hairline = max(lineField(vUv * vec2(2.3, 1.1), 0.73) * 0.32, cracks);
  float hotspot = 1.0 - smoothstep(0.0, 0.18, length(uv * vec2(1.5, 3.0)));
  float glow = (hairline * radial * 0.48) + hotspot * 0.09;
  vec3 color = mix(uBaseColor * 0.45, uVeinColor, glow);

  gl_FragColor = vec4(color, glow * uOpacity);
}
