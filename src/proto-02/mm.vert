varying vec3 vPosition;
varying vec4 vColor;

uniform float time;
uniform float radius;
uniform float size;

float angInc = 3.1416 / size;

void main() {
  
  float angle = (position.x  + position.z) * angInc;
  vPosition = position;
  vPosition.x *= cos(angle * time) * 0.2 + 1.0;
  vPosition.z *= cos(angle * time) * 0.2 + 1.0;
  vPosition.y *= sin(angle * time) * 0.2 + 1.0;
  
  vec4 myPos = modelViewMatrix * vec4(vPosition, 1.0);

  // normalize to use on frag
  vPosition.xyz /= size;

  gl_Position = projectionMatrix * myPos;
}
