#define PI 3.1415926535897932384626433832795

uniform vec3 uColor;
uniform int uOctaves;

varying vec2 vUv;
varying float vTime;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < uOctaves; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

float pattern( in vec2 p )
{
    vec2 q = vec2( fbm( p + vec2(0.0,0.0) ),
                   fbm( p + vec2(5.2,1.3) ) );

    vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2) ),
                   fbm( p + 4.0*q + vec2(8.3,2.8) ) );

    float time = vTime / 10.0;

    return fbm( (p + 4.0*r) + time );
}

void main()
{
	vec4 on = vec4(0.0);
    float color = pattern(vUv);
	vec3 finalColor = mix( vec3(0.3,0.1,0.4), vec3(0.3,0.05,0.05), vec3(0.13, 1, 0.15) );
	finalColor = mix( finalColor, vec3(0.9,0.9,0.9), dot(color, pow(2.0, vUv.y)) );
	finalColor = mix( finalColor, vec3(0.0,0.2,0.4), 2.0 );
	finalColor = clamp( finalColor*1.0*5.0, 0.0, 2.0 );
    
    gl_FragColor = vec4(finalColor, 1.0);
}