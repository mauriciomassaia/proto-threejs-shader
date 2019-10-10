import {
  BufferAttribute,
  Mesh,
  PerspectiveCamera,
  SphereBufferGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from 'three'
import vert from './mm.vert'
import frag from './mm.frag'
import '../utils/reset.css'
import './index.css'

let camera
let mesh
let renderer
let scene
let shaderMaterial
let uniforms

let pressed = false

const segments = 256
const size = 1024

function init () {
  camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000)
  scene = new Scene()
  camera.position.y = size * 2
  camera.position.z = size * 2
  camera.rotation.x = -Math.PI / 4

  var geometry = new SphereBufferGeometry(size, segments, segments)
  uniforms = {
    time: { type: 'f', value: 0.0 },
    size: { type: 'f', value: size },
    radius: { type: 'f', value: 0.0 }
  }

  shaderMaterial = new ShaderMaterial({
    wireframe: false,
    transparent: true,
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag
  })

  mesh = new Mesh(geometry, shaderMaterial)
  scene.add(mesh)

  renderer = new WebGLRenderer({ preserveDrawingBuffer: true })
  renderer.setClearColor(0x111111)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  renderer.domElement.addEventListener('mousedown', function () {
    pressed = true
  })

  renderer.domElement.addEventListener('mouseup', function () {
    pressed = false
  })

  window.addEventListener('keyup', function (e) {
    if (e.keyCode === 32) {
      shaderMaterial.wireframe = !shaderMaterial.wireframe 
    }
  })

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
  if (pressed) {
    uniforms.time.value += (0 - uniforms.time.value) * 0.025
  } else {
    uniforms.time.value += 0.04
  }
  uniforms.radius.value = Math.cos(Date.now() / 300) * 100 + 150
  
  mesh.rotation.y += 0.005
  mesh.rotation.x += 0.001
  mesh.rotation.z += 0.003

  camera.updateMatrixWorld()
  renderer.render(scene, camera)
}

window.onload = function () {
  init()
  animate()
}

var d = document.createElement('a')
d.className = 'download-button'
d.textContent = 'save_image'
d.addEventListener('click', function(ev) {
  d.href = renderer.domElement.toDataURL('image/jpeg', 1.0);
  d.download = `mm-blob-${Date.now()}.jpg`
}, false);

document.body.appendChild(d);

console.log('_ Use spacebar to toggle wireframe.')
console.log('_ Hold mouse down to revert time.')
console.log('_ Dont forget to save some images.\n\n')
