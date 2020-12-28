//===============================================================
// Import Library
//===============================================================
import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';



let scene,camera,renderer,water,sky,sun;
let orbitControls;


export function sunrise(){
    //シーン、カメラ、レンダラーを生成
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 1, 2000);
    camera.position.set(30, 30, 100);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    //PlaneBufferGeometry
    const waterGeometry = new THREE.PlaneBufferGeometry(10000,10000);
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
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog:scene.fog !== undefined
        }
    );
    // sky
    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    // sky settings
    const sky_uniforms = sky.material.uniforms;
    sky_uniforms['turbidity'].value = 10;
    sky_uniforms['rayleigh'].value = 2;
    sky_uniforms['mieCoefficient'].value = 0.005;
    sky_uniforms['mieDirectionalG'].value = 0.8;


    // sun
    sun = new THREE.Vector3();

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    const parameters = {
        inclination: 0.49,
        azimuth: 0.205
    };

    function updateSun() {

        const theta = Math.PI * ( parameters.inclination - 0.5 );
        const phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

        sun.x = Math.cos( phi );
        sun.y = Math.sin( phi ) * Math.sin( theta );
        sun.z = Math.sin( phi ) * Math.cos( theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        scene.environment = pmremGenerator.fromScene( sky ).texture;

    }
    updateSun();


    //OrbitControls
    document.addEventListener('touchmove',function(e){e.preventDefault();},{passive: false});
    const orbitControls = new OrbitControls(camera,renderer.domElement);
    orbitControls.maxPolarAngle = Math.PI * 0.495;
    orbitControls.target.set(0, 10, 0);
    orbitControls.minDistance = 40.0;
    orbitControls.maxDistance = 200.0;
    orbitControls.update();

    //canvasを作成
    const container = document.querySelector('#canvas__body');
    container.appendChild(renderer.domElement);


    //シーンに追加
    water.rotation.x = - Math.PI / 2;
    scene.add(water);


    //ウィンドウのリサイズに対応
    window.addEventListener('resize',function(){
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth,window.innerHeight);
    },false);

    // threeWorld();
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
