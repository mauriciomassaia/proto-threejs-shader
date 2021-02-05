/**
 * @author Danillo Castilho - danillocastilho.com <danillocastilhocavalcante@gmail.com>
*/

import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Viewport {
    constructor( props ) {

        // create initial class states to control on debug panel
        this.state = {
            controls: {
                isOrbitControlsActive: true,
            }
        };
        
        // inital canvas size
        this.size = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        // tick array to loop render functions from outside of the class
        this.tick = [];

        // base canvas
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);

        // base three.js scene
        this.scene = new THREE.Scene();
  
        // base three.js camera
        this.camera = new THREE.PerspectiveCamera(45, this.size.width / this.size.height, 0.1, 100);
        this.camera.position.z = 3
        
        // add camera to scene
        this.scene.add(this.camera);
        
        // base three.js renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        })

        // add orbit controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;

        // create clock to track elapsed time
        this.clock = new THREE.Clock();

        // create gui debugger
        this.gui = new dat.GUI();
        this.gui.width = 300;
        // hide debugger on initial state
        this.gui.hide();

        // create folder and add options to enable and disable controls
        this.guiViewportFolder = this.gui.addFolder('Viewport');
        this.guiControlsFolder = this.guiViewportFolder.addFolder('Controls');
        this.guiControlsFolder.add(this.state.controls, 'isOrbitControlsActive').name('Orbit Controls').onChange((value)=>{
            this.controls.reset();
            this.controls.enabled = value;
        });

        // resize functions, resize has to run once to resize canvas
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        // call render function to init tick
        this.render();
    }

    resize () {
        // update size variable
        this.size =  {
            width: window.innerWidth,
            height: window.innerHeight
        }

        // update camera aspect to the actual size
        this.camera.aspect = this.size.width / this.size.height
        this.camera.updateProjectionMatrix()

        // update renderer to the actual size
        this.renderer.setSize(this.size.width, this.size.height)
        this.renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
    }

    render () {
        // collect elapsed time
        const elapsedTime = this.clock.getElapsedTime();

        // run tick loop to call outside functions before render
        this.tick.map( (callback) => {callback.call({}, elapsedTime)} );
        this.controls.update();
        
        // render scene and camera
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }

    addTick ( callback ) {
        // add new function to tick loop
        this.tick.push( callback );
    }

    enableGUI () {
        // enable gui
        this.gui.show();
    }

    disableGUI () {
        // disable gui
        this.gui.hide();
    }
}