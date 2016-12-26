
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var windowHalfX = WIDTH / 2;
var windowHalfY = HEIGHT / 2;
var NEAR = 1.0, FAR = 350.0;
var VIEW_ANGLE = 45;
var renderer, camera, scene, stats, clock;
var controls;
var helper;
var numLights = 40;
var lights = [];
var ready = false;


function initScene() {
    renderer = new THREE.WebGLDeferredRenderer();       //
    renderer.enableLightPrePass(true);
    renderer.forwardRendering = true;
    renderer.setSize(WIDTH, HEIGHT);	// 初始化渲染
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, WIDTH / HEIGHT, NEAR, FAR);
    camera.position.z = 50;
    archer.oldCamer = camera.clone();       // 深度克隆 相机
    archer.initCamer = camera.clone();      // 相机初始
    controls = new THREE.TrackballControls(camera);
    scene = new THREE.Scene();
    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    initModel();
    initLights();
    window.addEventListener('resize', onWindowResize, false);
    clock = new THREE.Clock();
}

function initModel() {
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function (xhr) {
    };
    var modelFile = "./Model/miku.pmd";
    var vmdFiles = ["./Action/11.vmd"];
    console.log("modelFile = ", modelFile, " \n vmdFiles = ", vmdFiles);
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    helper = new THREE.MMDHelper();
    var loader = new THREE.MMDLoader();
    mesh = "";
    loader.load(modelFile, vmdFiles, function (object) {
        mesh = object;
        archer.isOriginPlay = true;         // 原始模型
        archer.currentMesh = mesh;          // 保存当前

        archer.meshlist[0] = mesh;
        mesh.position.y = -7;
        scene.add(mesh);
        // 深度克隆
        archer.oldMesh = mesh.clone();
        archer.initMesh = mesh.clone();

        for (var i = 0, il = mesh.material.materials.length; i < il; i++) {
            var material = mesh.material.materials[i];
            material.emissive.multiplyScalar(0.2);
        }
        helper.add(mesh);
        helper.setAnimation(mesh);

        ikHelper = new THREE.CCDIKHelper(mesh);
        ikHelper.visible = false;
        scene.add(ikHelper);

        helper.setPhysics(mesh);
        ready = true;


//            $('.progress-bar-striped').css('width', "25%");

        setTimeout(function () {
            initButton();
//                initCute();
        }, 1000);

    }, onProgress, onError);

}

function initButton() {
    $('#wj').css("display", "block");
    $('#nav').css('display', 'block');
    $("#reStart").css('display', 'block');
    $('#controlArea').css('display', 'block');
    $('#controlAction').css('display', 'block');

    $('#show').css('display', 'none');
    $('.demo').css('display', 'none');
    // $("#Action").html(actionList[archer.actionNum]);
}


function initLights() {
    var distance = 7;
    var c = new THREE.Vector3();
    var geometry = new THREE.SphereGeometry(0.1, 0.1, 0.1);
    var directionalLight = new THREE.DirectionalLight(0x101010);
    directionalLight.position.set(-1, 1, 1).normalize();
    scene.add(directionalLight);
    var spotLight = new THREE.SpotLight(0xf0f0f0);
    spotLight.position.set(30, 30, 30);
    spotLight.angle = 0.5;
    scene.add(spotLight);
}

function onWindowResize(event) {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    renderer.setSize(WIDTH, HEIGHT);    // cancas
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}


function update() {
    controls.update();
    var delta = clock.getDelta();
    var time = Date.now() * 0.0006;
    helper.animate(delta);
    for (var i = 0, il = lights.length; i < il; i++) {
        var light = lights[i];
        var x = Math.sin(time + i * 7.0) * 24 * Math.abs(Math.sin(time / i / 7.0));
        var y = Math.cos(time + i * 5.0) * 15 * Math.abs(Math.sin(time / i / 13.0)) + 6;
        var z = Math.cos(time + i * 3.0) * 24 * Math.abs(Math.sin(time / i / 17.0));
        light.position.set(x, y, z);
    }
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    if (ready) {
        update();
        render();
    }
}

function onWindowClick(e) {
    for (var i = 0; i < mesh.geometry.animations.length; i++) {
        clip = mesh.geometry.animations[i];
        action = mesh.mixer.clipAction(clip);
        action.time = 500;
        action.play();
    }
}

// 播放
function PlayMesh(count) {
    var mesh = archer.currentMesh;
    for (var i = 0; i < mesh.geometry.animations.length; i++) {
        var clip = mesh.geometry.animations[i];
        var action = mesh.mixer.clipAction(clip);
        action.time = archer.playTime;
        console.log("PlayMesh 播放");
        archer.currentAction = action;      // 保留物体
        archer.userStop = false;
        action.play();
    }
}
// 暂停
function PauseMesh() {
    var mesh = archer.currentMesh;
    for (var i = 0; i < mesh.geometry.animations.length; i++) {
        var clip = mesh.geometry.animations[i];
        var action = mesh.mixer.clipAction(clip);
        console.log("PauseMesh 暂停");
        archer.playTime = action.time;
        archer.currentAction = action;
        action.stop();

        archer.userStop = true;     // 用户暂停模型动作
    }
}

$("#playOrPause").click(function () {
    if (archer.playOrPause == true) {   // 播放 --> 停止
        $("#playOrPause .but-control").attr('src', "./images/play.png");
        PauseMesh();
        archer.playOrPause = false;

    } else {                            // 停止 --> 播放
        $("#playOrPause .but-control").attr('src', "./images/stop.png");
        PlayMesh(0);
        archer.playOrPause = true;
    }
})


//--------------- 初始化 正方形 ------------------
function initCute() {
    materials = [];
    for (var i = 1; i <= 6; ++i) {
        materials.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('../img/' + i + '.png',
                {}, function () {
                    renderer.render(scene, camera);
                }),
            overdraw: true
        }));
    }

    cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5),
        new THREE.MeshFaceMaterial(materials));


    cube.position.y = -15;
    scene.add(cube);
}


// 检测动作是否完成
function checkActionIsOver() {
    setInterval(function () {
        if (archer.currentAction == null) {
            return;
        }

        var singal = archer.currentAction.isRunning();

        // 动作截止，就初始化原始动作 并且，用户没有暂停
        if (singal == false && archer.userStop == false &&
            archer.isOriginPlay == false) {
            archer.isOriginPlay = true;    // 原始模型

            scene.remove(archer.currentMesh);
            scene.add(mesh);
            archer.currentMesh = mesh;

            for (var i = 0; i < mesh.geometry.animations.length; i++) {
                var clip = mesh.geometry.animations[i];
                var action = mesh.mixer.clipAction(clip);
                action.time = archer.playTime;
                action.setLoop(2201, 1000);

                archer.currentAction = action;      // 保留物体
                action.play();
            }

            console.log("检测动作是否完成");
        }
    }, 1000);
}

checkActionIsOver();

//    function initBackgrondImg() {
//
//
//        materials.push(new THREE.MeshBasicMaterial({
//            map: THREE.ImageUtils.loadTexture('./images/1.png',
//                {}, function () {
//                    renderer.render(scene, camera);
//                }),
//            overdraw: true
//        }));
//
//
////        cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5),
////            new THREE.MeshFaceMaterial(materials));
//
//
//        cube.position.y = -15;
//        scene.add(cube);
//    }

initScene();
animate();
//    initBackgrondImg

