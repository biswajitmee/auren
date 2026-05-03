uniform vec3 uColor;
uniform float uOpacity;
uniform float uColorIntensity;

varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float soft = 1.0 - smoothstep(0.05, 0.5, d);
  float feather = 1.0 - smoothstep(0.28, 0.5, d);

  vec3 warmSmoke = mix(uColor, vec3(0.78, 0.48, 0.18), 0.32) * uColorIntensity;
  gl_FragColor = vec4(warmSmoke, soft * feather * vAlpha * uOpacity);
}
