import * as THREE from 'three';

import {FBXLoader} from 'FBXLoader';
import {GLTFLoader} from 'GLTFLoader';
import {SkeletonUtils} from 'SkeletonUtils';
import {OrbitControls} from 'OrbitControls';
import {EffectComposer} from './EffectComposer.js';
import {RenderPass} from './RenderPass.js';
import {BokehPass} from './BokehPass.js';
import {UnrealBloomPass} from './UnrealBloomPass.js';
import {AfterimagePass} from './AfterimagePass.js';
globalThis.THREE = THREE;
export {THREE, FBXLoader, GLTFLoader, SkeletonUtils, OrbitControls, AfterimagePass, RenderPass, EffectComposer, GlitchPass, UnrealBloomPass, BokehPass};
