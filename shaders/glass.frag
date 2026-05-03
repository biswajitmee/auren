uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormal)), 0.0), 2.4);
  float glint = sin((vWorldPosition.y + uTime * 0.16) * 18.0) * 0.025;
  vec3 color = uColor + vec3(fresnel * 0.55 + glint, fresnel * 0.42, fresnel * 0.18);

  gl_FragColor = vec4(color, clamp(uOpacity + fresnel * 0.28, 0.0, 0.62));
}
