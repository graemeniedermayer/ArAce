import {entity} from "../entity.js";

// This is a little messy. I need to review JS context/scope

export const xr_component = (() => {
class XRController extends entity.Component {
    constructor(renderer, params) {
      super();

      let {camera, scene} = params;
      this.renderer_ = renderer;
      this.camera_ = camera;
      this.scene_ = scene;
    //   global variables are the bestest of best variables.
      globalThis.camera = this.camera_
      globalThis.renderer = this.renderer_
      globalThis.scene = this.scene_
      this.options = {
        requiredFeatures: [ 'dom-overlay'],
        requiredFeatures: ['dom-overlay', 'light-estimation'],
        domOverlay: { root: document.body }
      };
    }
    Options(options) {
        this.options = options
    }

    InitEntity() {
        // construct AR button

        this.button = document.createElement( 'button' );
        this.button.id = 'ArButton'
        this.button.textContent = 'ENTER AR' ;
        this.button.style.cssText+= `position: absolute;top:80%;left:40%;width:20%;height:2rem;`;

        
        document.body.appendChild(this.button)
        document.getElementById('ArButton').addEventListener('click',x=>this.InitAR())
    }
    
    getXRSessionInit( mode, options) {
        if ( options && options.referenceSpaceType ) {
            this.renderer_.xr.setReferenceSpaceType( options.referenceSpaceType );
        }
        var space = (options || {}).referenceSpaceType || 'local-floor';
        var sessionInit = (options && options.sessionInit) || {};
    
        // Nothing to do for default features.
        if ( space == 'viewer' )
            return sessionInit;
        if ( space == 'local' && mode.startsWith('immersive' ) )
            return sessionInit;
    
        // If the user already specified the space as an optional or required feature, don't do anything.
        if ( sessionInit.optionalFeatures && sessionInit.optionalFeatures.includes(space) )
            return sessionInit;
        if ( sessionInit.requiredFeatures && sessionInit.requiredFeatures.includes(space) )
            return sessionInit;
    
        var newInit = Object.assign( {}, sessionInit );
        newInit.requiredFeatures = [ space ];
        if ( sessionInit.requiredFeatures ) {
            newInit.requiredFeatures = newInit.requiredFeatures.concat( sessionInit.requiredFeatures );
        }
        return newInit;
     }

    onSessionEnded( /*event*/ ){
        let onSessionEnded = this.onSessionEnded
        currentSession.removeEventListener( 'end', onSessionEnded );
        this.renderer_.xr.setSession( null );
        currentSession = null;
    }

    onSessionStarted( session, context ){
        let onSessionEnded = context.onSessionEnded
        session.addEventListener( 'end', onSessionEnded );
        context.renderer_.xr.setSession( session );
        context.button.style.display = 'none';
        context.button.textContent = 'EXIT AR';

        session.requestReferenceSpace('local').then((refSpace) => {
            context.xrRefSpace = refSpace;
            globalThis.xrRefSpace = refSpace;
          session.requestAnimationFrame(context.InitRender);
          session.requestLightProbe().then((lightProbe) => {
            globalThis.xrLightProbe = lightProbe;
            // xrLightProbe.addEventListener('reflectionchange', () => reflectionChanged = true);
          }).catch(err => console.error(err));
        });
    }

    InitAR(){
        const planeGeometry = new THREE.PlaneGeometry( 512, 512 );
        planeGeometry.rotateX( - Math.PI / 2 );
        const plane = new THREE.Mesh( planeGeometry, new THREE.ShadowMaterial() );
        plane.scale.y = 4;
        plane.scale.x = 4;
        plane.scale.z = 4;
        plane.position.y = -1.0;
        plane.receiveShadow = true;
	    let currentSession = null;
        scene.add( plane );
	    if ( currentSession === null ) {
	    	var sessionInit = this.getXRSessionInit( 'immersive-ar', {
	    		mode: 'immersive-ar',
	    		referenceSpaceType: 'local', // 'local-floor'
	    		sessionInit: this.options
	    	});
	    	navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( x=>{this.onSessionStarted(x, this)} );
	    } else {
	    	currentSession.end();
	    }
	    this.renderer_.xr.addEventListener('sessionstart',
	    	(ev) => {
	    		console.log('sessionstart', ev);
	    		document.body.style.backgroundColor = 'rgba(0, 0, 0, 0)';
	    		this.renderer_.domElement.style.display = 'none';
	    	});
        this.renderer_.xr.addEventListener('sessionend',
	    	(ev) => {
	    		console.log('sessionend', ev);
	    		document.body.style.backgroundColor = '';
	    		this.renderer_.domElement.style.display = '';
	    	});
    }
    InitRender(initt, initframe){
        // let xrRefSpace = this.xrRefSpace;
        let firstDepth = true;
        let firstLight = true;
        let whratio, scaleGeo, convRate, vertices, depthMesh, baseVertices, estimate;
        function Render(t, frame) {
            const session = frame.session;
            session.requestAnimationFrame(Render);
            renderer.render( scene, camera );
            let baseLayer = session.renderState.baseLayer;
            const pose = frame.getViewerPose(xrRefSpace);
    	    if (pose) {
    	    	for (const view of pose.views) {
                    const viewport = baseLayer.getViewport(view);
                    // gl.viewport(viewport.x, viewport.y,
                    //             viewport.width, viewport.height);
                    // depth needs to be placed as a collider and for occlusion
			        // const depthData = frame.getDepthInformation(view);
                    if(xrLightProbe){
                        estimate = frame.getLightEstimate(xrLightProbe);
                      if (estimate) {
                        lightProbe.sh.fromArray(estimate.sphericalHarmonicsCoefficients);
                        lightProbe.intensity = 1;
                
                        const intensityScalar =
                          Math.max(1.0,
                          Math.max(estimate.primaryLightIntensity.x,
                          Math.max(estimate.primaryLightIntensity.y,
                                   estimate.primaryLightIntensity.z)));
                
                        directionalLight.color.setRGB(
                          estimate.primaryLightIntensity.x / intensityScalar,
                          estimate.primaryLightIntensity.y / intensityScalar,
                          estimate.primaryLightIntensity.z / intensityScalar);
                
                        directionalLight.intensity = intensityScalar;
                        directionalLight.position.copy(estimate.primaryLightDirection);
                
                      }
                    }
                }    
            }   
        }
        Render(initt,initframe)
    }
    Update(){

    }
}
    return {
        XRController: XRController,
    };
})();
