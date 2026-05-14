uniform sampler2D uMap;
uniform vec3 uTint;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec4 texel = texture2D(uMap, vUv);
  float minChannel = min(texel.r, min(texel.g, texel.b));
  float maxChannel = max(texel.r, max(texel.g, texel.b));
  float saturation = maxChannel - minChannel;
  float nearWhite = smoothstep(0.68, 0.94, minChannel) * (1.0 - smoothstep(0.05, 0.22, saturation));
  float alpha = texel.a * (1.0 - nearWhite) * uOpacity;

  vec3 color = mix(texel.rgb, texel.rgb * uTint * 1.35 + uTint * 0.08, 0.34);
  color += uTint * (1.0 - maxChannel) * 0.14;

  if (alpha < 0.01) {
    discard;
  }

  gl_FragColor = vec4(color, alpha);
}
