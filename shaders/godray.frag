uniform float uIntensity;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  float falloff = smoothstep(0.5, 0.0, abs(vUv.x - 0.5));
  float vertical = smoothstep(1.0, 0.0, vUv.y);

  gl_FragColor = vec4(uColor, falloff * vertical * uIntensity);
}
