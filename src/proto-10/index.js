/**
 * @author Danillo Castilho - danillocastilho.com <danillocastilhocavalcante@gmail.com>
 * study based on
 * https://tympanus.net/codrops/2019/10/23/making-gooey-image-hover-effects-with-three-js/
*/

import vert from './shader.vert'
import frag from './shader.frag'

import * as VIEWPORT from '../viewport/viewport';

import gsap from 'gsap';
import * as THREE from 'three';

import image1 from './gray.jpg';
import image2 from './red.jpg';

const viewport = new VIEWPORT.ThreeBasic();
viewport.controls.enabled = false;
viewport.enableGUI();

const camera = viewport.camera;
const scene = viewport.scene;
const gui = viewport.gui;

camera.position.z = 2;

const mouse = new THREE.Vector2(0, 0);

const loader = new THREE.TextureLoader();
const texture1 = loader.load(image1);
const texture2 = loader.load(image2);

const uniforms = {
  uTime: { value: 0.0 },
  uBaseImage: { value: texture1 },
  uReplaceImage: { value: texture2 },
  uMouse: { value: mouse },
  uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
};

const geometry = new THREE.PlaneBufferGeometry(1, 1, 1);
// const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 32, 32, 32);
// const geometry = new THREE.SphereBufferGeometry(1, 64, 64);
// const geometry = new THREE.ConeGeometry( 1, 1, 32, 32 );

const material = new THREE.ShaderMaterial(
  {
    wireframe: false,
    side: THREE.DoubleSide,
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    defines: {
        PR: Math.min(window.devicePixelRatio, 2).toFixed(1)
    }
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

viewport.renderer.setClearColor('black', 1);

const onMouseMove = ( e ) => {
  gsap.to(mouse, { x: (event.clientX / window.innerWidth) * 2 - 1, y: -(event.clientY / window.innerHeight) * 2 + 1 });
  // gsap.to(mesh.rotation, { x: -mouse.y * 0.3, y: mouse.x * (Math.PI / 6) });
}
window.addEventListener('mousemove', onMouseMove);

const onResize = ( e ) => {
  material.uniforms.uRes.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

const onTick = ( elapsedTime ) => {
  material.uniforms.uTime.value = elapsedTime;
  // mesh.rotation.y += 0.02;
}

viewport.addTick(onTick);