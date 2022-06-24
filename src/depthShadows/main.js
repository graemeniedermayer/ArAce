import {entity_manager} from './entity-manager.js';
import {entity} from './entity.js';

import {load_controller} from './load-controller.js';
import {spawners} from './spawners.js';

import {spatial_hash_grid} from './spatial-hash-grid.js';
import {threejs_component} from './threejs-component.js';
import {ammojs_component} from './ammojs-component.js';
import {xr_component} from './webxr-component.js';
import {blaster} from './fx/blaster.js';

import {math} from './math.js';

import {THREE} from './three-defs.js';


if ('serviceWorker' in navigator && 'PushManager' in window) { 
  // Always reset?
  navigator.serviceWorker.register('/sw.js')
  .then(
    function(reg) {}
  )
  .catch(function(error) {
         console.error('Service Worker Error', error);
    }
  )
};

class QuickGame2_Sequel {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this.entityManager_ = new entity_manager.EntityManager();

    this.OnGameStarted_();
  }

  OnGameStarted_() {
    this.grid_ = new spatial_hash_grid.SpatialHashGrid(
        [[-50, -50], [50, 50]], [1, 1]);

    this.LoadControllers_();

    this.previousRAF_ = null;
    this.RAF_();
  }

  LoadControllers_() {
    const threejs = new entity.Entity();
    threejs.AddComponent(new threejs_component.ThreeJSController());
    this.entityManager_.Add(threejs, 'threejs');

    const ammojs = new entity.Entity();
    ammojs.AddComponent(new ammojs_component.AmmoJSController());
    this.entityManager_.Add(ammojs, 'physics');

    // Hack
    this.ammojs_ = ammojs.GetComponent('AmmoJSController');
    this.scene_ = threejs.GetComponent('ThreeJSController').scene_;
    this.camera_ = threejs.GetComponent('ThreeJSController').camera_;
    this.threejs_ = threejs.GetComponent('ThreeJSController');

    const l = new entity.Entity();
    l.AddComponent(new load_controller.LoadController());
    this.entityManager_.Add(l, 'loader');

    const fx = new entity.Entity();
    fx.AddComponent(new blaster.BlasterSystem({
        scene: this.scene_,
        camera: this.camera_,
        texture: './resources/textures/fx/blaster.jpg'.replace('./','/static/'),
    }));
    this.entityManager_.Add(fx, 'fx');


    const basicParams = {
      grid: this.grid_,
      scene: this.scene_,
      camera: this.camera_,
    };

    const spawner = new entity.Entity();
    spawner.AddComponent(new spawners.PlayerSpawner(basicParams));
    spawner.AddComponent(new spawners.EnemyFighterSpawner(basicParams));
    spawner.AddComponent(new spawners.ExplosionSpawner(basicParams));
    spawner.AddComponent(new spawners.TinyExplosionSpawner(basicParams));
    spawner.AddComponent(new spawners.ShipSmokeSpawner(basicParams));
    this.entityManager_.Add(spawner, 'spawners');
    for (let i = 0; i < 5; ++i) {
      const e = spawner.GetComponent('EnemyFighterSpawner').Spawn();
      const n = new THREE.Vector3(
        math.rand_range(-1, 1),
        math.rand_range(-1, 1),
        math.rand_range(-1, 1),
      );
      n.normalize();
      n.multiplyScalar(3);
      n.add(new THREE.Vector3(0, 1, -1));
      e.SetPosition(n);
    }
    // DEMO
    spawner.GetComponent('PlayerSpawner').Spawn();
    
    const webxr = new entity.Entity();
    webxr.AddComponent(new  xr_component.XRController(this.threejs_.threejs_, basicParams))
    this.entityManager_.Add(webxr, 'webxr');

  }

  RAF_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      } else {
        this.Step_(t - this.previousRAF_);
        this.threejs_.Render();
        this.previousRAF_ = t;
      }

      setTimeout(() => {
        this.RAF_();
      }, 1);
    });
  }

  Step_(timeElapsed) {
    // DEMO
    // const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001) * 0.5;
    const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

    this.entityManager_.Update(timeElapsedS, 0);
    this.entityManager_.Update(timeElapsedS, 1);

    this.ammojs_.StepSimulation(timeElapsedS);
  }
}


let _APP = null;

// This could be automatic right?
window.addEventListener('DOMContentLoaded', () => {
  const _Setup = () => {
    Ammo().then(function(AmmoLib) {
      Ammo = AmmoLib;
      _APP = new QuickGame2_Sequel();
      globalThis._APP = _APP
    }); 
    document.body.removeEventListener('click', _Setup);
  };
  document.body.addEventListener('click', _Setup);
});
