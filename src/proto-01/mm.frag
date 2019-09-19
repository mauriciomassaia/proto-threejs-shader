varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;

uniform float radius;
uniform float time;
uniform sampler2D texture1;
uniform sampler2D texture2;

void main() {

  vec4 t1 = texture2D( texture1, vUv );
  vec4 t2 = texture2D( texture2, vUv );

  vec4 color = vec4(0, 0, 0, 1);

  // based on y position
  color = mix(t1, t2, (vPosition.y  / radius) / 2.0);

  // fade
  // color = mix(t1, t2, (sin(time) + 1.0) / 2.0);

  gl_FragColor = color;

}
