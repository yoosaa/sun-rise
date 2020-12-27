//===============================================================
// Import Library
//===============================================================
import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Water } from 'three/examples/jsm/objects/Water';



let scene,camera,renderer,water;
let orbitControls;

//PlaneBufferGeometry
const waterGeometry = new THREE.PlaneBufferGeometry(1000,1000);


export function sunrise(){
    //シーン、カメラ、レンダラーを生成
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 1, 2000);
    camera.position.set(30, 30, 100);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    //Water
    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'images/Water_2_M_Normal.jpg', function(texture){
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            } ),
            alpha: 1.0,
            waterColor: 0x3e89ce,
            distortionScale: 3.7,
            fog:scene.fog !== undefined
        }
    );

    //OrbitControls
    document.addEventListener('touchmove',function(e){e.preventDefault();},{passive: false});
    const orbitControls = new OrbitControls(camera,renderer.domElement);

    //canvasを作成
    const container = document.querySelector('#canvas__body');
    container.appendChild(renderer.domElement);


    //シーンに追加
    scene.add(water);
    water.rotation.x = - Math.PI / 2;


    //ウィンドウのリサイズに対応
    window.addEventListener('resize',function(){
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth,window.innerHeight);
    },false);

    threeWorld();
    setLight();
    rendering(water);
}

// デバッグ用
function threeWorld(){
    //座標軸の生成
    const axes = new THREE.AxesHelper(1000);
    axes.position.set(0,0,0);
    scene.add(axes);

    //グリッドの生成
    const grid = new THREE.GridHelper(100,100);
    scene.add(grid);
}
 
function setLight(){
    //環境光
    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);
}

 
function rendering(){
    //アニメーション
    water.material.uniforms['time'].value += 1.0 / 60.0;
    requestAnimationFrame(rendering);
    renderer.render(scene,camera);
}
