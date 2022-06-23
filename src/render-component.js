import {THREE} from './three-defs.js';

import {entity} from './entity.js';


export const render_component = (() => {

  class RenderComponent extends entity.Component {
    constructor(params) {
      super();
      this.group_ = new THREE.Group();
      this.target_ = null;
      this.offset_ = null;
      this.mixer_ = null;
      this.anims_ = null;
      this.params_ = params;
      this.params_.scene.add(this.group_);
    }

    Destroy() {
      this.group_.traverse(c => {
        if (c.material) {
          c.material.dispose();
        }
        if (c.geometry) {
          c.geometry.dispose();
        }
      });
      this.params_.scene.remove(this.group_);
    }

    InitEntity() {
      this._LoadModels();
    }
  
    InitComponent() {
      this.RegisterHandler_('update.position', (m) => { this.OnPosition_(m); });
      this.RegisterHandler_('update.rotation', (m) => { this.OnRotation_(m); });
      this.RegisterHandler_('render.visible', (m) => { this.OnVisible_(m); });
      this.RegisterHandler_('render.offset', (m) => { this.OnOffset_(m.offset); });
    }

    OnVisible_(m) {
      this.group_.visible = m.value;
    }

    OnPosition_(m) {
      this.group_.position.copy(m.value);
    }

    OnRotation_(m) {
      this.group_.quaternion.copy(m.value);
    }

    OnOffset_(offset) {
      this.offset_ = offset;
      if (!this.offset_) {
        return;
      }

      if (this.target_) {
        this.target_.position.copy(this.offset_.position);
        this.target_.quaternion.copy(this.offset_.quaternion);
      }
    }

    _LoadModels() {
      const loader = this.FindEntity('loader').GetComponent('LoadController');
      loader.Load(
        this.params_.resourcePath, this.params_.resourceName, (mdl,anim) => {
        if(anim && this.Parent.components_.PlayerController){
          let animations = {};
          this.Parent.components_.PlayerController._mixer = new THREE.AnimationMixer( mdl );
          anim.forEach(x=>{
            animations[x.name]= this.Parent.components_.PlayerController._mixer.clipAction( x );
            animations[x.name].play()
          });
          this.Parent.components_.PlayerController._animations = animations;
        }
        this._OnLoaded(mdl);
      });
    }

    _OnLoaded(obj) {
      this.target_ = obj;
      this.group_.add(this.target_);
      this.group_.position.copy(this.Parent.Position);
      this.group_.quaternion.copy(this.Parent.Quaternion);

      this.target_.scale.setScalar(this.params_.scale);
      if (this.params_.offset) {
        this.offset_ = this.params_.offset;
      }
      this.OnOffset_(this.offset_);

      const textures = {};
      if (this.params_.textures) {
        const loader = this.FindEntity('loader').GetComponent('LoadController');

        for (let k in this.params_.textures.names) {
          const t = loader.LoadTexture(
              this.params_.textures.resourcePath, this.params_.textures.names[k]);
          t.encoding = THREE.sRGBEncoding;

          if (this.params_.textures.wrap) {
            t.wrapS = THREE.RepeatWrapping;
            t.wrapT = THREE.RepeatWrapping;
          }

          textures[k] = t;
        }
      }

      this.target_.traverse(c => {
        let materials = c.material;
        if (!(c.material instanceof Array)) {
          materials = [c.material];
        }

        if (c.geometry) {
          c.geometry.computeBoundingBox();
        }

        for (let m of materials) {
          if (m) {
            // HACK
            m.depthWrite = true;
            m.transparent = false;

            if (this.params_.onMaterial) {
              this.params_.onMaterial(m);
            }
            for (let k in textures) {
              if (m.name.search(k) >= 0) {
                m.map = textures[k];
              }
            }
            if (this.params_.specular) {
              m.specular = this.params_.specular;
            }
            if (this.params_.emissive) {
              m.emissive = this.params_.emissive;
            }
            if (this.params_.colour) {
              m.color = this.params_.colour;
            }
          }
        }
        if (this.params_.receiveShadow !== undefined) {
          c.receiveShadow = this.params_.receiveShadow;
        }
        if (this.params_.castShadow !== undefined) {
          c.castShadow = this.params_.castShadow;
        }
        if (this.params_.visible !== undefined) {
          c.visible = this.params_.visible;
        }

        c.castShadow = true;
        c.receiveShadow = true;
      });

      this.Broadcast({
          topic: 'render.loaded',
          value: this.target_,
      });
    }

    Update(timeInSeconds) {
    }
  };


  return {
      RenderComponent: RenderComponent,
  };

})();