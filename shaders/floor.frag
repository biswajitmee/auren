uniform float uTime;
uniform float uOpacity;
uniform float uVeinIntensity;
uniform float uVeinScale;
uniform float uHotspotStrength;
uniform float uHotspotRadius;
uniform float uAtmosphereReflection;
uniform vec3 uBaseColor;
uniform vec3 uVeinColor;

varying vec2 vUv;

float lineField(vec2 uv, float offset) {
  float a = sin((uv.x * 12.0 + uv.y * 2.9 + offset) * 3.14159);
  float b = sin((uv.x * 3.4 - uv.y * 10.5 - offset * 0.6) * 3.14159);
  float c = sin((uv.x * 1.9 + uv.y * 17.0 + offset * 1.4) * 3.14159);
  float crack = abs(a * 0.48 + b * 0.34 + c * 0.18);
  return 1.0 - smoothstep(0.0018, 0.018, crack);
}

void main() {
  vec2 uv = vUv - 0.5;
  vec2 stretched = uv * vec2(0.82, 1.42);
  float radial = 1.0 - smoothstep(0.08, 0.62, length(stretched));
  vec2 veinUv = (vUv - 0.5) * uVeinScale + 0.5;
  float cracks = max(lineField(veinUv, 0.14), lineField(veinUv * 1.62, 0.47) * 0.55);
  float hairline = max(lineField(veinUv * vec2(2.3, 1.1), 0.73) * 0.32, cracks);
  float hotspot = 1.0 - smoothstep(0.0, uHotspotRadius, length(uv * vec2(1.5, 3.0)));
  float atmosphere = pow(1.0 - smoothstep(0.0, 0.84, length(uv * vec2(0.82, 1.24))), 1.8);
  float glow = (hairline * radial * 0.28 * uVeinIntensity) +
    hotspot * 0.18 * uHotspotStrength +
    atmosphere * 0.05 * uAtmosphereReflection;
  vec3 color = mix(uBaseColor * 0.38, uVeinColor, clamp(glow, 0.0, 1.0));

  gl_FragColor = vec4(color, glow * uOpacity);
}
