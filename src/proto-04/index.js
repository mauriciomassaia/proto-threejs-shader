/**
 * @author Danillo Castilho - danillocastilho.com <danillocastilhocavalcante@gmail.com>
*/

import vert from './shader.vert'
import frag from './shader.frag'

import * as VIEWPORT from '../viewport/viewport';

import gsap from 'gsap';
import * as THREE from 'three';

// create three js base scene
const viewport = new VIEWPORT.ThreeBasic();
// enable gui debug
viewport.enableGUI();

// create variables for viewport objects
const scene = viewport.scene;
const gui = viewport.gui;

// create base object to three js
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh);

// add viewport background color as renderer is transparent by default
viewport.renderer.setClearColor('black', 1);

// loop function 
const tick = ( elapsedTime ) => {
  // console.log('tick', elapsedTime);
}

// add function as callback to render everytime threejs renders.
viewport.addTick(tick);
// console.log(viewport);

// simple gsap animation
gsap.fromTo( cubeMesh.position, 
  { y: 1 },
  { y: 0, duration: 2, ease: "bounce.out", delay: 1 }
);