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
        requiredFeatures: ['depth-sensing', 'dom-overlay'],
        domOverlay: { root: document.body },
        depthSensing: {
           usagePreference: ["cpu-optimized"],
           dataFormatPreference: ["luminance-alpha"]
        }
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
        });
    }

    InitAR(){
	    let currentSession = null;
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
        let whratio, scaleGeo, convRate, vertices, depthMesh, baseVertices;
        function Render(t, frame) {
            const session = frame.session;
            session.requestAnimationFrame(Render);
            renderer.render( scene, camera );
            let baseLayer = session.renderState.baseLayer;
            const pose = frame.getViewerPose(xrRefSpace);
    	    if (pose) {
    	    	for (const view of pose.views) {
              const viewport = baseLayer.getViewport(view);
			        const depthData = frame.getDepthInformation(view);
              if (firstDepth && depthData){
                firstDepth = false
                // initializing depth
			        	whratio = viewport.width/viewport.height
			        	scaleGeo = 2*Math.tan( 2*Math.PI*camera.fov/(whratio*2*360) )
                const geometry = new THREE.PlaneGeometry(scaleGeo,  scaleGeo*whratio, depthData.width-1, depthData.height-1);
			        	vertices = geometry.attributes.position.array;
			        	baseVertices = new Float32Array(geometry.attributes.position.array);
			        	convRate = depthData.rawValueToMeters
                depthMesh = new THREE.Mesh( geometry, new THREE.ShadowMaterial({transparent:false}) );
                depthMesh.frustumCulled=false;
                depthMesh.receiveShadow = true;
                scene.add(depthMesh)
              }
              if (depthData) {
                // maybe this should be a shared array? maybe verticies need to shared..
			        	let data = new Uint8Array(depthData.data)
                // do this in a webworker?
			        	for ( let  k = 0, i = 0, l = data.length; i < l; i+= 2, k+=3) {
			        		let zdistance = convRate*(data[ i ]+data[ i+1 ]*255)
			        		vertices[ k ] = baseVertices[ k ]*zdistance;
			        		vertices[ k + 1 ] = baseVertices[ k + 1 ]*zdistance ;
			        		vertices[ k + 2 ] =  - zdistance ;
			        	}
                depthMesh.geometry.attributes.position.needsUpdate = true
			        	 // these do need to be updated..
			        	depthMesh.quaternion.copy(camera.quaternion)
			        	depthMesh.position.copy(camera.position)
			        	depthMesh.rotateZ(3*Math.PI/2)
               } else {
                      console.log('unavailable')
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
