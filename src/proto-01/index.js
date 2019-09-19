import {
  BufferAttribute,
  Matrix4,
  Mesh,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  WebGLRenderer
} from 'three'
import vert from './mm.vert'
import frag from './mm.frag'
import imageCanvasHex from './canvas-hex.jpg'
import imageDrop1 from './drops-1.jpg'
import '../utils/reset.css'

let camera
let terrainMesh
let renderer
let scene
let shaderMaterial
let uniforms

const segments = 64
const planeWidth = 2048
const planeHeight = 2048

function init () {
  camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000)
  scene = new Scene()

  camera.position.y = 2000
  camera.position.z = 2000
  camera.rotation.x = -Math.PI / 4

  var geometry = new PlaneBufferGeometry(planeWidth, planeHeight, segments, segments)
  geometry.applyMatrix(new Matrix4().makeRotationX(-Math.PI / 2))

  var colors = new BufferAttribute(new Float32Array(segments * 3 * 4), 4)

  for (var i = 0; i < colors.count; i++) {
    colors.setXYZW(i, Math.random(), Math.random(), Math.random(), Math.random())
  }

  geometry.addAttribute('color', colors)

  const texture1 = new TextureLoader().load(imageCanvasHex)
  const texture2 = new TextureLoader().load(imageDrop1)

  uniforms = {
    time: { type: 'f', value: 1.0 },
    planeSize: { type: 'f', value: planeWidth },
    radius: { type: 'f', value: 400.0 },
    texture1: { type: 't', value: texture1 },
    texture2: { type: 't', value: texture2 }
  }

  shaderMaterial =
    new ShaderMaterial({
      wireframe: false,
      transparent: true,
      uniforms: uniforms,
      vertexShader: vert,
      fragmentShader: frag
    })

  terrainMesh = new Mesh(geometry, shaderMaterial)
  scene.add(terrainMesh)

  renderer = new WebGLRenderer()
  renderer.setClearColor(0x111111)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)

  onWindowResize()
}

function onWindowResize () {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

function animate () {
  window.requestAnimationFrame(animate)
  render()
}

function render () {
  uniforms.time.value += 0.05
  uniforms.time.value %= Math.PI * 2

  terrainMesh.rotation.y += 0.01

  camera.updateMatrixWorld()

  renderer.render(scene, camera)
}

window.onload = function () {
  init()
  animate()
}
