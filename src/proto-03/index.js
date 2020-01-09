/**
 * @author Danillo Castilho - danillocastilho.com <danillocastilhocavalcante@gmail.com>
 */

import vert from './shader.vert'
import frag from './shader.frag'
import '../utils/reset.css'
import './index.css'
import gsap from 'gsap';

var canvas, gl, vertexShader, fragmentShader, program, vertices, color, test;

function getShader(gl, str, type) {
    var shader;

    if (type == gl.FRAGMENT_SHADER) {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == gl.VERTEX_SHADER) {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function getColor () {
    return [color.r, color.g, color.b, color.a];
}

function render () {
    vertices = new Float32Array([
        test.a, -0.5,
        0.6, -0.5,
        0.6, 0.5,
        -0.6, -0.5,
        test.b, 0.5,
        -0.6, 0.5,
    ]);

    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    gl.useProgram( program );
    program.color = gl.getUniformLocation( program, 'color' );
    gl.uniform4fv( program.color, getColor() );

    program.position = gl.getAttribLocation( program, 'position' );
    gl.enableVertexAttribArray( program.position );
    gl.vertexAttribPointer( program.position, 2, gl.FLOAT, false, 0, 0 );

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);

    window.requestAnimationFrame(render);
}

function init () {
    color = { r: 0, g: 0, b: 0, a: 1 };
    test = { a: -0.4, b: 0.4 };

    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    document.body.appendChild( canvas );

    gl = canvas.getContext('webgl');

    gl.clearColor(0, 0, 0, 0);
    gl.clear( gl.COLOR_BUFFER_BIT );

    vertexShader = getShader(gl, vert, gl.VERTEX_SHADER);
    fragmentShader = getShader(gl, frag, gl.FRAGMENT_SHADER);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gsap.to(color, {r: 0.5, b: 1, g: 0, a: 1, duration: 2, delay: 2, ease: "power3.inOut" });
    gsap.to(test, {a: 0.0, b: 0.0, duration: 2, delay: 2, ease: "power3.inOut" });

    render();
}

document.addEventListener("DOMContentLoaded", init);
