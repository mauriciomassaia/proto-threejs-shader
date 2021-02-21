uniform float uTime;
uniform sampler2D uBaseImage;
uniform sampler2D uReplaceImage;

uniform vec2 uMouse;
uniform vec2 uRes;

varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
}