attribute float vertexPos;
attribute vec4 color;

varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;

uniform float time;
uniform float radius;
uniform float planeSize;

void main() {

  vUv = uv;

  float angInc = 3.1416 / planeSize;
  float angle = (position.x  + position.z + planeSize) / 2.0 ;
  vPosition = position;
  vPosition.y += sin(angle * angInc + time) * radius + radius;
  vPosition.x += cos(angle * angInc + time) * radius + radius;
  vec4 myPos = modelViewMatrix * vec4(vPosition, 1.0);

  gl_Position = projectionMatrix * myPos;

}
