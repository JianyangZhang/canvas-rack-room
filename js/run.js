var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

window.onload = function () {
    // 初始化画布
    let stage = new Konva.Stage({
        container: 'container',
        width: WIDTH,
        height: HEIGHT
    });
    // 绘制网格
    drawGrids(stage);
    // 绘制机房轮廓
    drawRoomContour(stage);
    // 绘制服务器
    let serverLayer = new Konva.Layer();
    for (let j = 500; j <= 1000; j += 100) {
        for (let i = 280; i <= 440; i += 40) {
            drawServer(stage, serverLayer, j, i);
        }
    }
}


function drawServer(stage, serverLayer, x, y) {
    // 加载资源
    let server_green = new Image();
    server_green.src = './images/server_green.svg';
    let server_white = new Image();
    server_white.src = './images/server_white.svg';
    // 资源加载完成
    server_white.onload = function () {
        let serverWhite = new Konva.Image({
            x: x,
            y: y,
            image: server_white,
            width: 40,
            height: 40,
            draggable: true,
        });
        serverLayer.add(serverWhite);
        stage.add(serverLayer);
        serverLayer.setZIndex(5);
        // 对齐到网格
        snapToGrid(serverWhite, serverLayer);
        // 事件绑定
        serverWhite.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
            serverWhite.setImage(server_green);
            serverLayer.draw();
        });
        serverWhite.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
            serverWhite.setImage(server_white);
            serverLayer.draw();
        });

    }
}

function drawRoomContour(stage) {
    // 初始化参数
    let xGap = 80;
    let yGap = 80;
    let outline_breath = 4;
    let line_breath = 3;
    let line_color = "#FFFFFF";
    let contourLayer = new Konva.Layer();
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
    contourLayer.add(group);
    stage.add(contourLayer);
    contourLayer.setZIndex(1);
}

function drawGrids(stage) {
    let gridLayer = new Konva.Layer();
    let group = new Konva.Group();
    for (let i = 10; i < WIDTH; i += 10) {
        let gridLine = new Konva.Line({
            points: [i, 0, i, HEIGHT],
            stroke: "#404040",
            strokeWidth: 1,
            lineJoin: 'mister',
            dash: [12, 2]
        });
        group.add(gridLine);
    }
    for (let i = 10; i < HEIGHT; i += 10) {
        let gridLine = new Konva.Line({
            points: [0, i, WIDTH, i],
            stroke: "#404040",
            strokeWidth: 1,
            lineJoin: 'mister',
            dash: [12, 2]
        });
        group.add(gridLine);
    }
    gridLayer.add(group);
    stage.add(gridLayer);
    gridLayer.setZIndex(0);
}


function snapToGrid(obj, layer) {
    obj.on('dragend', function () {
        let offsetX = obj.x() % 10;
        let offsetY = obj.y() % 10;
        if (10 - offsetX > offsetX) {
            obj.x(obj.x() - offsetX);
        } else {
            obj.x(obj.x() + (10 - offsetX));
        }
        if (10 - offsetY > offsetY) {
            obj.y(obj.y() - offsetY);
        } else {
            obj.y(obj.y() + (10 - offsetY));
        }
        layer.draw();
    });
}