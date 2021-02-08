/**
 * @author Danillo Castilho - danillocastilho.com <danillocastilhocavalcante@gmail.com>
*/

import vert from './shader.vert'
import frag from './shader.frag'

import * as VIEWPORT from '../viewport/viewport';

import gsap from 'gsap';
import * as THREE from 'three';

import colorTextureImage from './textures01/Sci-fi_Wall_005_basecolor.jpg';
import heightTextureImage from './textures01/Sci-fi_Wall_005_height.png';
import normalTextureImage from './textures01/Sci-fi_Wall_005_normal.jpg';
import roughnessTextureImage from './textures01/Sci-fi_Wall_005_roughness.jpg';
import ambientOcclusionTextureImage from './textures01/Sci-fi_Wall_005_ambientOcclusion.jpg';

// create three js base scene
const viewport = new VIEWPORT.ThreeBasic();
// enable gui debug
viewport.camera.position.z = 10;
viewport.enableGUI();

// create variables for viewport objects
const scene = viewport.scene;
const gui = viewport.gui;

// add viewport background color as renderer is transparent by default
viewport.renderer.setClearColor('black', 1);

// add lights to the scene

const lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[0].position.set( 10, 10, 10 );
scene.add( lights[0] );

lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[1].position.set( 10, -10, -10 );
scene.add( lights[1] );

lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[2].position.set( -10, -10, -7 );
scene.add( lights[2] );

// light helpers
const lightHelpers = [];

lightHelpers[0] = new THREE.PointLightHelper(lights[0], 2);
scene.add(lightHelpers[0]);

lightHelpers[1] = new THREE.PointLightHelper(lights[1], 2);
scene.add(lightHelpers[1]);

lightHelpers[2] = new THREE.PointLightHelper(lights[2], 2);
scene.add(lightHelpers[2]);

lightHelpers.map( (light)=>{ light.visible = false; } );

// add lights debug data 
const guiLightFolder = viewport.gui.addFolder('Lights');

const guiLight1Folder = guiLightFolder.addFolder('Light 1');
guiLight1Folder.add(lightHelpers[0], 'visible');
guiLight1Folder.add(lights[0].position, 'x').min(-200).max(200).step(0.01);
guiLight1Folder.add(lights[0].position, 'y').min(-200).max(200).step(0.01);
guiLight1Folder.add(lights[0].position, 'z').min(-200).max(200).step(0.01);

const guiLight2Folder = guiLightFolder.addFolder('Light 2');
guiLight2Folder.add(lightHelpers[1], 'visible');
guiLight2Folder.add(lights[1].position, 'x').min(-200).max(200).step(0.01);
guiLight2Folder.add(lights[1].position, 'y').min(-200).max(200).step(0.01);
guiLight2Folder.add(lights[1].position, 'z').min(-200).max(200).step(0.01);

const guiLight3Folder = guiLightFolder.addFolder('Light 3');
guiLight3Folder.add(lightHelpers[2], 'visible');
guiLight3Folder.add(lights[2].position, 'x').min(-200).max(200).step(0.01);
guiLight3Folder.add(lights[2].position, 'y').min(-200).max(200).step(0.01);
guiLight3Folder.add(lights[2].position, 'z').min(-200).max(200).step(0.01);

// loading manager
const loadingManager = new THREE.LoadingManager();

// texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load(colorTextureImage);

const normalTexture = textureLoader.load(normalTextureImage);
const roughnessTexture = textureLoader.load(roughnessTextureImage);
const heightTexture = textureLoader.load(heightTextureImage);
const ambientOcclusionTexture = textureLoader.load(ambientOcclusionTextureImage);

const parameters = {
  color: 0xff6800
}

// create base object to three js
const sphereGeometry = new THREE.SphereBufferGeometry(1, 64, 64);
const sphereMaterial = new THREE.MeshStandardMaterial();

sphereMaterial.color.set(parameters.color);

sphereMaterial.map = colorTexture;

sphereMaterial.normalMap = normalTexture;
// sphereMaterial.normalScale.set(6.75, 14.96);

sphereMaterial.roughnessMap = roughnessTexture;
sphereMaterial.roughness = 1;

sphereMaterial.aoMap = ambientOcclusionTexture;
sphereMaterial.aoMapIntensity = 1;

sphereMaterial.displacementMap = heightTexture;
sphereMaterial.displacementScale = 1;

sphereMaterial.metalness = 0.7;

// sphereMaterial.flatShading = true;
// sphereMaterial.needsUpdate = true;

const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh);

// add material debug data 
const guiMaterialFolder = viewport.gui.addFolder('Material');
guiMaterialFolder.add(sphereMaterial, 'wireframe').name('Wireframe');
guiMaterialFolder.add(sphereMaterial, 'flatShading').name('Flat Shading').onChange(() => {
  sphereMaterial.needsUpdate = true;
});
guiMaterialFolder.addColor(parameters, 'color').onChange(() => {
  sphereMaterial.color.set(parameters.color);
});
guiMaterialFolder.add(sphereMaterial, 'metalness').min(0).max(1).step(0.01).name('Metalness');
guiMaterialFolder.add(sphereMaterial, 'roughness').min(0).max(1).step(0.01).name('Roughness');
guiMaterialFolder.add(sphereMaterial, 'displacementScale').min(0).max(1).step(0.01).name('Displacement Scale');
guiMaterialFolder.add(sphereMaterial, 'aoMapIntensity').min(0).max(1).step(0.01).name('Ambient Occlusion Intensity').onChange(()=>{
  sphereMaterial.needsUpdate = true;
})
guiMaterialFolder.add(sphereMaterial.normalScale, 'x').min(0).max(20).step(0.01).name('Normal Scale X');
guiMaterialFolder.add(sphereMaterial.normalScale, 'y').min(0).max(20).step(0.01).name('Normal Scale Y');

// loop function 
const tick = ( elapsedTime ) => {
  // console.log('tick', elapsedTime);
  sphereMesh.rotation.y = (elapsedTime / 5);
}

// add function as callback to render everytime threejs renders.
viewport.addTick(tick);