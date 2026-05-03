uniform vec3 uColor;
uniform float uOpacity;
uniform float uColorIntensity;

varying float vAlpha;
varying float vTwinkle;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float core = 1.0 - smoothstep(0.012, 0.08, d);
  float halo = 1.0 - smoothstep(0.05, 0.48, d);
  float glint = pow(max(0.0, 1.0 - d * 3.2), 5.0);
  float circle = halo * 0.44 + core * 0.34 + glint * 0.34;

  vec3 color = mix(uColor, vec3(1.0, 0.82, 0.36), glint * 0.45) * uColorIntensity;
  gl_FragColor = vec4(color, circle * vAlpha * vTwinkle * 0.74 * uOpacity);
}
