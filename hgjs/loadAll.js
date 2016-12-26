
var singalProcess = 0;
var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        if (percentComplete == 100) {

            archer.loadNum++;
            // console.log("ok-- ----------------- ----->", archer.loadNum);
            var process = 25 + parseInt(archer.loadNum * 5);

            singalProcess = $('.progress-bar-striped').css('width');
            // console.log("singalProcess", singalProcess);

            if (singalProcess < process) {
                singalProcess = process;
            }
            $('.progress-bar-striped').css('width', singalProcess + "%");

            if (archer.modelLength * 3 == archer.loadNum && process == 100) {
                initButton();
                // ininController();       // 初始化按钮
            }
        }
    }
};

function loadList() {
    // 模型的动作
    var action = {
        1: ['./Action/wavefile_v2.vmd'],
        2: ['./Action/15.vmd'],
        3: ['./Action/13.vmd'],
        4: ['./Action/3.vmd'],
    };

    function initModelList(item, meshItem) {
        var onError = function (xhr) {};
        var modelName = 'miku.pmd';
        var modelFile = "./Model/" + modelName;
        // var modelFile = "Len_Kagamine.pmd"
        console.log("item", item,  "  modelFile", modelFile);
        var vmdFiles = action[item];
        helper = new THREE.MMDHelper();
        var loader = new THREE.MMDLoader();

        return function(item) {
            loader.load(modelFile, vmdFiles, function (object) {
                meshItem = object;
                archer.meshlist[item] = meshItem;
                meshItem.position.y = -10;
                for (var i = 0, il = meshItem.material.materials.length; i < il; i++) {
                    var material = meshItem.material.materials[i];
                    material.emissive.multiplyScalar(0.2);
                }
                helper.add(meshItem);
                helper.setAnimation(meshItem);
                ikHelper = new THREE.CCDIKHelper(meshItem);
                ikHelper.visible = false;
                scene.add(ikHelper);
                helper.setPhysics(meshItem);
                ready = true;

            }, onProgress, onError);
        }(item);
    }

    // window.meshlist = [];
    for (var i = 1; i <= archer.modelLength; i++) {
        archer.meshlist[i] = "";
        console.log("window.meshlist");
        initModelList(i, archer.meshlist[i]);
    }

}

loadList();