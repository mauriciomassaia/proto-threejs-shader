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

const segments = 128
const size = 1024

var supportsPassive = false
try {
  addEventListener('test', null, { get passive() { supportsPassive = true } })
} catch(e) {}

const listenerOptions = supportsPassive ? { passive:true } : false

function onPress () {
  pressed = true
}

function onRelease () {
  pressed = false
}

function toggleWireframe () {
  shaderMaterial.wireframe = !shaderMaterial.wireframe 
}

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
  const el = renderer.domElement
  document.body.appendChild(el)

  el.addEventListener('mousedown', onPress)
  el.addEventListener('mouseup', onRelease)
  el.addEventListener('touchstart', onPress, listenerOptions)
  el.addEventListener('touchend', onRelease, listenerOptions)
  el.addEventListener('touchcancel', onRelease, listenerOptions)
  // el.addEventListener('touchmove', e => e.preventDefault(), listenerOptions)

  window.addEventListener('keyup', function (e) {
    if (e.keyCode === 32) toggleWireframe()
  })
  window.addEventListener('resize', onWindowResize, listenerOptions)

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

var w = document.createElement('a')
w.className = 'wireframe-button'
w.textContent = 'toggle_wireframe'
w.addEventListener('click', toggleWireframe, false);
document.body.appendChild(w);

console.log('_ Use spacebar to toggle wireframe.')
console.log('_ Hold mouse down to revert time.')
console.log('_ Dont forget to save some images.\n\n')
