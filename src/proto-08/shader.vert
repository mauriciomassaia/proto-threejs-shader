uniform float uTime;

varying vec2 vUv;
varying float vTime;

void main()
{
    // position.x = position.x
    // position.x = 0;

    float elapsedTime = uTime;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.y += cos(uv.y + elapsedTime);
    modelPosition.x = sin(modelPosition.y + elapsedTime) + modelPosition.x + sin(elapsedTime);
    modelPosition.z = modelPosition.z + cos(elapsedTime) + cos(modelPosition.y + elapsedTime);
    // modelPosition.z = sin(modelPosition.x);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vTime = uTime;
    vUv = uv;
}