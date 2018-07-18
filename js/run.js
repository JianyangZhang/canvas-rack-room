var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

window.onload = function () {
    // 初始化画布
    let stage = new Konva.Stage({
        container: 'container',
        width: WIDTH,
        height: HEIGHT
    });
    // 绘制机房轮廓
    drawRoomContour(stage)
    // 绘制服务器
    let serverLayer = new Konva.Layer();
    drawServer(stage, serverLayer, 100, 100)
    drawServer(stage, serverLayer, 150, 150)
    drawServer(stage, serverLayer, 200, 200)
}


function drawServer(stage, serverLayer, x, y) {
    // 加载资源
    var asset = new Image();
    asset.src = './images/server_white.svg';
    // 资源加载完成
    asset.onload = function () {
        let server = new Konva.Image({
            x: x,
            y: y,
            image: asset,
            scale: { x: 0.05, y: 0.05 },
            draggable: true
        });
        serverLayer.add(server);
        stage.add(serverLayer);
        // 可拖拽物品把鼠标样式改成小手
        mouseDragStyle(stage, server);
    }
}

function drawRoomContour(stage) {
    // 初始化参数
    let xGap = 80;
    let yGap = 80;
    let outline_breath = 4;
    let line_breath = 3;
    let line_color = "#FFFFFF";
    let layer = new Konva.Layer();
    let group = new Konva.Group({
        x: xGap,
        y: yGap,
    });

    // 设置外边框
    let outline = new Konva.Rect({
        x: 0,
        y: 0,
        width: WIDTH - 2 * xGap,
        height: HEIGHT - 2 * yGap,
        stroke: line_color,
        strokeWidth: outline_breath
    });

    // 设置内部线条
    let line0 = new Konva.Line({
        points: [0, 0.8 * outline.height(), outline.width(), 0.8 * outline.height()],
        stroke: line_color,
        strokeWidth: line_breath,
        lineCap: 'miter',
        lineJoin: 'round'
    });

    // 渲染
    group.add(outline);
    group.add(line0);
    layer.add(group);
    layer.moveToBottom();
    stage.add(layer);
}

function mouseDragStyle(stage, target) {
    target.on('mouseenter', function () {
        stage.container().style.cursor = 'pointer';
    });
    target.on('mouseleave', function () {
        stage.container().style.cursor = 'default';
    });
}
