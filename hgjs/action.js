// 重置
$('#reset').click(function () {
    camera = archer.oldCamer;
    controls = new THREE.TrackballControls(camera);
    archer.oldCamer = camera.clone();
});

var actionList = {
    "1" : "1",
    "2" : "2",
    "3" : "3",
    "4" : "4",
    "5" : "5",
    "6" : "6"
};


// 上一个
$("#Action-pro").click(function () {

    var num = archer.actionNum;
    if (num != 1) {
        num = num - 1;
    } else {
        num = archer.modelLength;
    }

    archer.actionNum = num;
    $("#Action").html(actionList[num]);
    archer.oldMesh = archer.meshlist[num];


    changeMove(num);
});

$("#Action-next").click(function () {
    var num = archer.actionNum;
    if (num != archer.modelLength) {
        num = num + 1;
    } else {
        num = 1;
    }
    archer.actionNum = num;

    $("#Action").html(actionList[num]);
    archer.oldMesh = archer.meshlist[num];

    changeMove(num);
    console.log("------------- num -----------------", num);
});

var changeMoveSingal = false;   // 防止连续点击
function changeMove(num) {
        $("#playOrPause .but-control").attr('src', "./images/stop.png");
        archer.playOrPause = true;      // 是否暂停
        archer.userStop = false;        // 用户没有停止
        archer.isOriginPlay = false;    // 不是原始模型在跳舞
        scene.remove(archer.currentMesh);
        scene.remove(archer.meshlist[0]);
        scene.remove(archer.oldMesh);

        scene.add(archer.meshlist[num]);
        archer.currentMesh = archer.meshlist[num];

        PauseMesh();

        var mesh = archer.currentMesh;
        for (var i = 0; i < mesh.geometry.animations.length; i++) {
            var clip = mesh.geometry.animations[i];
            var action = mesh.mixer.clipAction(clip);
            action.time = 0;
            action.setLoop(2200, 1);
            archer.currentAction = action;      // 保留物体
            action.play();
        }
        console.log("PlayMesh 播放");

        archer.userStop = false;
        camera = archer.oldCamer;
        controls = new THREE.TrackballControls(camera);
        archer.oldCamer = camera.clone();
}



$("#controller-area").click(function () {
    
});