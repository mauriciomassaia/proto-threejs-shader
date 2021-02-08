/**
 * @author Danillo Castilho - danillocastilho.com <danillocastilhocavalcante@gmail.com>
*/

import vert from './shader.vert'
import frag from './shader.frag'

import * as VIEWPORT from '../viewport/viewport';

import gsap from 'gsap';
import * as THREE from 'three';

import colorPBTextureImage from './textures01/Crystal_004_basecolor-pb.jpg';
import heightTextureImage from './textures01/Crystal_004_height.png';
import normalTextureImage from './textures01/Crystal_004_normal.jpg';
import roughnessTextureImage from './textures01/Crystal_004_roughness.jpg';
import ambientOcclusionTextureImage from './textures01/Crystal_004_ambientOcclusion.jpg';

import envMapPX from './environmentMaps/0/px.jpg';
import envMapNX from './environmentMaps/0/nx.jpg';
import envMapPY from './environmentMaps/0/py.jpg';
import envMapNY from './environmentMaps/0/ny.jpg';
import envMapPZ from './environmentMaps/0/pz.jpg';
import envMapNZ from './environmentMaps/0/nz.jpg';

import envMapTest from './environmentMaps/0/test.jpg';

// create three js base scene
const viewport = new VIEWPORT.ThreeBasic();
// enable gui debug
viewport.camera.position.z = 3;
viewport.enableGUI();

// create variables for viewport objects
const scene = viewport.scene;
const gui = viewport.gui;

// add viewport background color as renderer is transparent by default
viewport.renderer.setClearColor('black', 1);

// loading manager
const loadingManager = new THREE.LoadingManager();

// texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load(colorPBTextureImage);

const normalTexture = textureLoader.load(normalTextureImage);
const roughnessTexture = textureLoader.load(roughnessTextureImage);
const heightTexture = textureLoader.load(heightTextureImage);
const ambientOcclusionTexture = textureLoader.load(ambientOcclusionTextureImage);

// cube texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader()

// const environmentMapTexture = cubeTextureLoader.load([
//   envMapPX,
//   envMapNX,
//   envMapPY,
//   envMapNY,
//   envMapPZ,
//   envMapNZ
// ]);

const environmentMapTexture = cubeTextureLoader.load([
    envMapTest,
    envMapTest,
    envMapTest,
    envMapTest,
    envMapTest,
    envMapTest
  ]);

// color parameters

const parameters = {
  color: 0xffffff
}

// create base object to three js
const diamondGeometry = new THREE.SphereBufferGeometry(1, 64, 64);
const diamondMaterial = new THREE.MeshStandardMaterial();

diamondMaterial.color.set(parameters.color);

// diamondMaterial.map = colorTexture;

diamondMaterial.normalMap = normalTexture;
diamondMaterial.normalScale.set(0.16, 0.05);

diamondMaterial.roughnessMap = roughnessTexture;
diamondMaterial.roughness = 0;

diamondMaterial.displacementMap = heightTexture;
diamondMaterial.displacementScale = 1;

diamondMaterial.metalness = 1;

diamondMaterial.envMap = environmentMapTexture;
diamondMaterial.flatShading = true;

diamondMaterial.needsUpdate = true;

const diamondMesh = new THREE.Mesh(diamondGeometry, diamondMaterial)
scene.add(diamondMesh);

// add material debug data 
const guiMaterialFolder = viewport.gui.addFolder('Material');
guiMaterialFolder.add(diamondMaterial, 'wireframe').name('Wireframe');
guiMaterialFolder.add(diamondMaterial, 'flatShading').name('Flat Shading').onChange(() => {
  diamondMaterial.needsUpdate = true;
});
guiMaterialFolder.addColor(parameters, 'color').onChange(() => {
  diamondMaterial.color.set(parameters.color);
});
guiMaterialFolder.add(diamondMaterial, 'metalness').min(0).max(1).step(0.01).name('Metalness');
guiMaterialFolder.add(diamondMaterial, 'roughness').min(0).max(1).step(0.01).name('Roughness');
guiMaterialFolder.add(diamondMaterial, 'displacementScale').min(0).max(1).step(0.01).name('Displacement Scale');
guiMaterialFolder.add(diamondMaterial, 'aoMapIntensity').min(0).max(1).step(0.01).name('Ambient Occlusion Intensity').onChange(()=>{
  diamondMaterial.needsUpdate = true;
})
guiMaterialFolder.add(diamondMaterial.normalScale, 'x').min(0).max(1).step(0.01).name('Normal Scale X');
guiMaterialFolder.add(diamondMaterial.normalScale, 'y').min(0).max(1).step(0.01).name('Normal Scale Y');

// loop function 
const tick = ( elapsedTime ) => {
  // console.log('tick', elapsedTime);
  diamondMesh.rotation.y = (elapsedTime / 10);
  diamondMesh.rotation.z = (elapsedTime / 9);
}

// add function as callback to render everytime threejs renders.
viewport.addTick(tick);