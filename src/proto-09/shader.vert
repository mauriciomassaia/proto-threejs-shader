uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;
varying float vTime;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vTime = uTime;
    vUv = uv;
}