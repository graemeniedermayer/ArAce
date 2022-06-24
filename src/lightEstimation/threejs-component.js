import {THREE, OrbitControls} from '../three-defs.js';

import {entity} from "../entity.js";


export const threejs_component = (() => {




  class ThreeJSController extends entity.Component {
    constructor() {
      super();
    }

    InitEntity() {
      this.threejs_ = new THREE.WebGLRenderer({
        antialias: true,
        alpha:true
      });
      this.threejs_.xr.enabled = true;
      this.threejs_.outputEncoding = THREE.sRGBEncoding;
      // this.threejs_.gammaFactor = 2.2;
      this.threejs_.shadowMap.enabled = true;
      this.threejs_.shadowMap.type = THREE.PCFSoftShadowMap;
      this.threejs_.setPixelRatio(window.devicePixelRatio);
      this.threejs_.setSize(window.innerWidth, window.innerHeight);
      this.threejs_.domElement.id = 'threejs';
      this.threejs_.physicallyCorrectLights = true;
  
      document.getElementById('container').appendChild(this.threejs_.domElement);
  
      window.addEventListener('resize', () => {
        this.OnResize_();
      }, false);
  
      const fov = 80;
      const aspect = 2960 / 1440;
      const near = 0.0001;
      const far = 100.0;
      this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
      // this.camera_.position.set(.2, .05, .15);
      this.scene_ = new THREE.Scene();

      this.listener_ = new THREE.AudioListener();
      this.camera_.add(this.listener_);
  
	    let lightProbe = new THREE.LightProbe();
	    lightProbe.intensity = 0;
	    lightProbe.castShadow = true;
      this.scene_.add(lightProbe);
      globalThis.lightProbe = lightProbe

      let directionalLight = new THREE.DirectionalLight(0x8088b3, 1.0);
      directionalLight.position.set(-.1, 5, .1);
      directionalLight.target.position.set(0, 0, 0);
      directionalLight.castShadow = true;
      directionalLight.shadow.bias = -0.001;
      directionalLight.shadow.mapSize.width = 512;
      directionalLight.shadow.mapSize.height = 512;
      directionalLight.shadow.camera.near = 0.0001;
      directionalLight.shadow.camera.far = 10.0;
      directionalLight.shadow.camera.left = 5;
      directionalLight.shadow.camera.right = -5;
      directionalLight.shadow.camera.top = 5;
      directionalLight.shadow.camera.bottom = -5;
      this.scene_.add(directionalLight);
      globalThis.directionalLight = directionalLight

      this.sun_ = directionalLight;

      this.OnResize_();
    }


    OnResize_() {
      this.camera_.aspect = window.innerWidth / window.innerHeight;
      this.camera_.updateProjectionMatrix();

      this.threejs_.setSize(window.innerWidth, window.innerHeight);
    }

    Render() {
      this.threejs_.autoClearColor = true;
      this.threejs_.render(this.scene_, this.camera_);
    }

    Update(timeElapsed) {
      const player = this.FindEntity('player');
      if (!player) {
        return;
      }
      const pos = player._position;
  
      this.sun_.position.copy(pos);
      this.sun_.position.add(new THREE.Vector3(-.1, 5, .1));
      this.sun_.target.position.copy(pos);
      this.sun_.updateMatrixWorld();
      this.sun_.target.updateMatrixWorld();

    }
  }

  return {
      ThreeJSController: ThreeJSController,
  };
})();
