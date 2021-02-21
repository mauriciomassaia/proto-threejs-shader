/**
 * @author Danillo Castilho - danillocastilho.com <danillocastilhocavalcante@gmail.com>
 * study based on
 * https://www.iquilezles.org/www/articles/warp/warp.htm
 * https://www.shadertoy.com/view/lsl3RH
 * https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mix.xhtml
 * https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
*/

import vert from './shader.vert'
import frag from './shader.frag'

import * as VIEWPORT from '../viewport/viewport';

import gsap from 'gsap';
import * as THREE from 'three';

const viewport = new VIEWPORT.ThreeBasic();
viewport.enableGUI();

const camera = viewport.camera;
const scene = viewport.scene;
const gui = viewport.gui;

camera.position.z = 2;

const uniforms = {
  uTime: { value: 0.0 },
  uColor: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
  uOctaves: { value: 6 },
};

// const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
// const geometry = new THREE.SphereBufferGeometry(1, 32, 32);
// const geometry = new THREE.ConeGeometry( 1, 1, 32, 32 );

const material = new THREE.ShaderMaterial(
  {
    wireframe: false,
    side: THREE.FrontSide,
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag
  }
);

const mesh = new THREE.Mesh(geometry, material);
// mesh.scale.set(3.28, 2.3, 1);
scene.add(mesh);

const guiMaterialFolder = gui.addFolder('Material');
guiMaterialFolder.add(material, 'wireframe');

const guiFolder = gui.addFolder('Props');
guiFolder.open();

guiFolder.add(mesh.scale, 'x').min(-5).max(5).step(0.01).name('Scale X');
guiFolder.add(mesh.scale, 'y').min(-5).max(5).step(0.01).name('Scale Y');
guiFolder.add(mesh.scale, 'z').min(-5).max(5).step(0.01).name('Scale Z');

guiFolder.add(material.uniforms.uOctaves, 'value').min(1).max(20).step(1).name('Octaves');

// guiFolder.add(material.uniforms.uColor.value, 'x').min(0.0).max(1.0).step(0.01).name('Color R');
// guiFolder.add(material.uniforms.uColor.value, 'y').min(0.0).max(1.0).step(0.01).name('Color G');
// guiFolder.add(material.uniforms.uColor.value, 'z').min(0.0).max(1.0).step(0.01).name('Color B');

viewport.renderer.setClearColor('black', 1);

const tick = ( elapsedTime ) => {
  material.uniforms.uTime.value = elapsedTime;
  // mesh.rotation.y += 0.02;
}
viewport.addTick(tick);