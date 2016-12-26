if (!Detector.webgl) Detector.addGetWebGLMessage();
var container, stats;
var camera, controls, scene, renderer;
var cross;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 100;
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);
    scene = new THREE.Scene();

    var manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {

        console.log(item, loaded, total);

    };

    var texture = new THREE.Texture();
    var loader = new THREE.ImageLoader(manager);
    loader.load('/uploads/160701/pattern-7.png', function(image) {

        texture.image = image;
        texture.needsUpdate = true;

    });

    // model

    var loader = new THREE.OBJLoader(manager);
    loader.load('/uploads/160701/clothes/t-shirt-01.obj', function(object) {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
            }
        });
        object.position.y = -50;
        object.scale.x = object.scale.y = object.scale.z = 20;
        scene.add(object);
    });


    // lights

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, -1, -1);
    scene.add(light);

    light = new THREE.AmbientLight(0xffffff);
    scene.add(light);


    renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    document.body.appendChild(renderer.domElement);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    container.appendChild(stats.domElement);
    window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

}

function render() {

    renderer.render(scene, camera);
    stats.update();
}