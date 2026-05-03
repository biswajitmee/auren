uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  float wave = sin((vUv.x * 12.0) + uTime * 1.6) * 0.05;
  float depth = smoothstep(0.05, 0.95, vUv.y);
  vec3 glow = uColor + vec3(0.28, 0.12, 0.0) * depth + wave;

  gl_FragColor = vec4(glow, 0.58);
}
