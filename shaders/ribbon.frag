uniform vec3 uColor;
uniform float uOpacity;
uniform float uScroll;
uniform float uColorIntensity;

varying vec2 vUv;
varying float vWave;

void main() {
  float sideFade = smoothstep(0.0, 0.24, vUv.x) * smoothstep(1.0, 0.76, vUv.x);
  float lengthFade = smoothstep(0.0, 0.14, vUv.y) * smoothstep(1.0, 0.22, vUv.y);
  float strandA = 1.0 - smoothstep(0.018, 0.16, abs(vUv.y - (0.42 + sin(vUv.x * 7.0 + vWave * 2.0) * 0.12)));
  float strandB = 1.0 - smoothstep(0.012, 0.18, abs(vUv.y - (0.58 + cos(vUv.x * 5.0 + vWave * 2.4) * 0.1)));
  float vapor = (strandA * 0.56 + strandB * 0.38 + vWave * 0.16) * sideFade * lengthFade;
  float storyLift = mix(0.74, 1.25, smoothstep(0.46, 0.62, uScroll));

  gl_FragColor = vec4(uColor * uColorIntensity, vapor * uOpacity * storyLift);
}
