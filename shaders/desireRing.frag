uniform vec3 uAccent;
uniform float uOpacity;
uniform float uProgress;
uniform float uTime;

varying vec2 vUv;
varying vec3 vLocalPosition;

void main() {
  float angle = atan(vLocalPosition.y, vLocalPosition.x);
  float ringNoise = 0.5 + 0.5 * sin(angle * 9.0 - uTime * 0.72);
  float sweep = 0.5 + 0.5 * sin(angle * 2.0 + uProgress * 6.2831853 - uTime * 0.32);
  float edge = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.74, 1.0, vUv.y));
  float pulse = pow(sweep, 3.0) * 0.72 + ringNoise * 0.16;

  vec3 color = uAccent * (0.16 + pulse);
  float alpha = edge * (0.1 + pulse * 0.55) * uOpacity;

  gl_FragColor = vec4(color, alpha);
}
