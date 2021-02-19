/**
 * @author Danillo Castilho - danillocastilho.com <danillocastilhocavalcante@gmail.com>
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

camera.position.z = 10;

const uniforms = {
  uTime: { type: 'f', value: 0.0 },
};

// const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
// const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 32, 32, 32);
const geometry = new THREE.SphereBufferGeometry(1, 64, 64);
// const geometry = new THREE.ConeGeometry( 1, 1, 32, 32 );

const material = new THREE.ShaderMaterial(
  {
    wireframe: false,
    side: THREE.DoubleSide,
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag
  }
);
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.set(3.28, 2.3, 1);
scene.add(mesh);

const guiMaterialFolder = gui.addFolder('Material');
guiMaterialFolder.add(material, 'wireframe');

const guiFolder = gui.addFolder('Props');
guiFolder.open();

guiFolder.add(mesh.scale, 'x').min(-5).max(5).step(0.01).name('Scale X');
guiFolder.add(mesh.scale, 'y').min(-5).max(5).step(0.01).name('Scale Y');
guiFolder.add(mesh.scale, 'z').min(-5).max(5).step(0.01).name('Scale Z');

viewport.renderer.setClearColor('black', 1);

const tick = ( elapsedTime ) => {
  material.uniforms.uTime.value = elapsedTime;
  // mesh.rotation.y += 0.02;
}
viewport.addTick(tick);