//===============================================================
// Import Library
//===============================================================
import * as THREE from 'three/build/three.min';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import {
    Water
} from 'three/examples/jsm/objects/Water';
import {
    Sky
} from 'three/examples/jsm/objects/Sky';
import {
    GUI
} from 'three/examples/jsm/libs/dat.gui.module';



let scene, camera, renderer, water, sky, sun;
let orbitControls;


export function sunrise() {

    return new Promise((resolve, reject) => {
        //シーン、カメラ、レンダラーを生成
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 10, 2000000);
        camera.position.set(0, 100, 2000);
        scene.add(camera);
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        //PlaneBufferGeometry
        const waterGeometry = new THREE.PlaneBufferGeometry(100000, 100000);

        let dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-1, 1.75, 1);
        dirLight.position.multiplyScalar(100);
        scene.add(dirLight);

        dirLight.castShadow = true;

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        let d = 50;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;

        dirLight.shadow.camera.far = 13500;

        //Water
        water = new Water(
            waterGeometry, {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('images/Water.jpg', function(texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                alpha: 0.85,
                sunDirection: dirLight.position.clone().normalize(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );

        // sky
        sky = new Sky();
        sky.scale.setScalar(45000);
        scene.add(sky);
        // sky settings
        let sky_uniforms = sky.material.uniforms;
        sky_uniforms['turbidity'].value = 10;
        sky_uniforms['rayleigh'].value = 0.94;
        sky_uniforms['mieCoefficient'].value = 0.005;
        sky_uniforms['mieDirectionalG'].value = 0.8;


        // sun
        sun = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20000, 16, 8),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );
        sun.position.y = -700000;
        scene.add(sun);

        let effectController = {
            turbidity: 10,
            rayleigh: 1.24,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.6,
            inclination: 0.519, // elevation / inclination
            azimuth: 0.25, // Facing front,
            exposure: renderer.toneMappingExposure
        };

        let distance = 402000;

        function updateSun() {

            let uniforms = sky.material.uniforms;
            uniforms["turbidity"].value = effectController.turbidity;
            uniforms["rayleigh"].value = effectController.rayleigh;
            uniforms["mieCoefficient"].value = effectController.mieCoefficient;
            uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

            const theta = Math.PI * (effectController.inclination - 0.5);
            const phi = 2 * Math.PI * (effectController.azimuth - 0.5);

            sun.position.x = distance * Math.cos(phi);
            sun.position.y = distance * Math.sin(phi) * Math.sin(theta);
            sun.position.z = distance * Math.sin(phi) * Math.cos(theta);

            uniforms["sunPosition"].value.copy(sun.position);
            sky.material.uniforms['sunPosition'].value.copy(sun.position);
            water.material.uniforms['sunDirection'].value.copy(sun.position).normalize();

            renderer.toneMappingExposure = effectController.exposure;
            renderer.render(scene, camera);


        }
        // const gui = new GUI();

        // gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange(updateSun);
        // gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(updateSun);
        // gui.add(effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(updateSun);
        // gui.add(effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(updateSun);
        // // gui.add(effectController, "luminance", 0, 1, 0.0001).onChange(updateSun);
        // gui.add(effectController, "inclination", 0, 1, 0.0001).onChange(updateSun);
        // gui.add(effectController, "azimuth", 0, 1, 0.0001).onChange(updateSun);
        // gui.add(effectController, "exposure", 0, 1, 0.0001).onChange(updateSun);


        updateSun();
        window.setInterval(() => {
            if (effectController.inclination > 0.4749) {
                effectController.inclination -= 0.0001;
                updateSun();
            } else {
                clearInterval();
                resolve();
            }
        }, 100);




        //OrbitControls
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, {
            passive: false
        });
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.maxPolarAngle = Math.PI * 0.495;
        orbitControls.target.set(0, 20, 1000);
        orbitControls.minDistance = 200.0;
        orbitControls.maxDistance = 200.0;
        orbitControls.update();

        //canvasを作成
        const container = document.querySelector('#canvas__body');
        container.appendChild(renderer.domElement);


        //シーンに追加
        scene.add(water);
        water.rotation.x = -Math.PI / 2;


        //ウィンドウのリサイズに対応
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

        // threeWorld();
        // setLight();
        rendering(water);
    });
}

// デバッグ用
function threeWorld() {
    //座標軸の生成
    const axes = new THREE.AxesHelper(1000);
    axes.position.set(0, 0, 0);
    scene.add(axes);

    //グリッドの生成
    const grid = new THREE.GridHelper(100, 100);
    scene.add(grid);
}

function setLight() {
    //環境光
    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);
}


function rendering() {
    //アニメーション
    water.material.uniforms['time'].value += 1.0 / 60.0;
    requestAnimationFrame(rendering);
    renderer.render(scene, camera);
}