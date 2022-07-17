import {entity} from "./entity.js";
import {THREE, AfterimagePass, RenderPass, EffectComposer, GlitchPass, UnrealBloomPass, BokehPass} from './three-defs.js';
// This is a little messy. I need to review JS context/scope

export const xr_component = (() => {
class XRController extends entity.Component {
    constructor(renderer, params) {
      super();

      let {camera, scene} = params;
      this.renderer_ = renderer;
      this.camera_ = camera;
      this.scene_ = scene;

      this._width = screen.availWidth;
      this._height = screen.availHeight ;
    //   global variables are the bestest of best variables.
      globalThis.camera = this.camera_
      globalThis.renderer = this.renderer_
      globalThis.scene = this.scene_
      this.options = {
        requiredFeatures: [ 'dom-overlay'],
        domOverlay: { root: document.body },
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

        const size = renderer.getSize( new THREE.Vector2() );
        this._pixelRatio = renderer.getPixelRatio();
        this._width = size.width;
        this._height = size.height;

        let renderTarget = new THREE.WebGLRenderTarget(  this._width * this._pixelRatio, this._height * this._pixelRatio );
        renderTarget.texture.name = 'EffectComposer.rt1';
        globalThis.renderTarget = renderTarget
        this.composer_ = new EffectComposer( this.renderer_, renderTarget)//, new THREE.WebGLCubeRenderTarget(1440, 2960));

        const renderPass = new RenderPass( scene, camera );
        this.composer_.addPass( renderPass );

        const bloomPass = new UnrealBloomPass();
        bloomPass.threshold = 0;
		    bloomPass.strength = 4;
		    bloomPass.radius = 0.1;
        this.composer_.addPass( bloomPass );
	 	    let bokehPass = new BokehPass(scene, camera, {
            focus: 1.0,
            aperture: 0.025,
            maxblur: 0.5,
        } );
	      this.composer_.addPass( bokehPass );
        globalThis.composer = this.composer_
  
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
        let firstPost = true;
        let whratio, scaleGeo, convRate, vertices, depthMesh, baseVertices, estimate;
        function Render(t, frame) {
            const session = frame.session;
            session.requestAnimationFrame(Render);
            let baseLayer = session.renderState.baseLayer;
            const pose = frame.getViewerPose(xrRefSpace);

    	    if (pose) {
    	    	for (const view of pose.views) {
              const viewport = baseLayer.getViewport(view);
              if(firstPost){
                firstPost = false
                setTimeout(()=>{
                    renderer.setSize(viewport.width/3.5, viewport.height/3.5)
                    renderTarget.setSize(viewport.width, viewport.height)
                    composer.setSize(viewport.width, viewport.height)
                    composer.passes.forEach(x=>x.setSize(viewport.width, viewport.height))},1000)

                }
              composer.render();
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
