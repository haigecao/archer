function loadList() {

    function initModel() {
        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };
        var onError = function (xhr) {};
        var modelName = 'miku.pmd';
        var modelFile = "./Model/" + modelName;
        var vmdFiles = action[10];

        helper = new THREE.MMDHelper();
        var loader = new THREE.MMDLoader();
        mesh1 = "";
        loader.load(modelFile, vmdFiles, function (object) {
            mesh1 = object;
            mesh1.position.y = -10;
            // scene.remove(mesh)
            // scene.add(mesh1);

            for (var i = 0, il = mesh1.material.materials.length; i < il; i++) {
                var material = mesh1.material.materials[i];
                material.emissive.multiplyScalar(0.2);
            }
            helper.add(mesh1);
            helper.setAnimation(mesh1);

            ikHelper = new THREE.CCDIKHelper(mesh1);
            ikHelper.visible = false;
            scene.add(ikHelper);

            helper.setPhysics(mesh1);
            ready = true;
        }, onProgress, onError);
    }

    initModel();
}

loadList()