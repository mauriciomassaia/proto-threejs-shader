varying vec3 vPosition;
varying vec4 vColor;

uniform float radius;
uniform float time;

void main() {
  float x = clamp(vPosition.x, 0.0, 1.0);
  float y = clamp(vPosition.y, 0.0, 1.0);
  float z = clamp(vPosition.z, 0.1, 1.0);
  vec4 color = vec4(time * 0.2 + 0.5, x, y, z);
  gl_FragColor = color;
}
