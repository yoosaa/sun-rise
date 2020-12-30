/**
 * import
 */
import * as THREE from './module/_3d';
import * as fontEffect from './module/_font-effect';


/**
 * 読み込み後
 */
window.addEventListener('load', function() {

    THREE.sunrise();
    fontEffect.disp();

});