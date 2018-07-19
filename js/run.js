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
    let grids = drawGrids(stage);
    // 绘制机房轮廓
    let contour = drawRoomContour(stage);
    // 绘制服务器
    let serverLayer = new Konva.Layer();
    for (let i = 500; i <= 1000; i += 100) {
        for (let j = 280; j <= 440; j += 40) {
            let condition = 0;
            if ((i == 600 && j == 320) || (i == 600 && j == 360) || (i == 800 && j == 400)) { condition = 1; }
            drawServer(stage, serverLayer, {
                x: i,
                y: j,
                condition: condition,
            });
        }
    }
    // 绘制风扇
    let fanLayer = new Konva.Layer();
    drawFan(stage, fanLayer, {
        x: 300,
        y: 470,
        condition: 0,
        rotate: true,
        angularSpeed: 180,  // one revolution per 2 seconds (2 * 180 = 360)
    });
    drawFan(stage, fanLayer, {
        x: 1200,
        y: 220,
        condition: 1,
        rotate: false,
    });
}

function drawFan(stage, fanLayer, options) {
    let x = options.x == undefined ? 30 : options.x;
    let y = options.y == undefined ? 30 : options.y;
    let condition = options.condition == undefined ? 0 : options.condition;
    let rotate = options.rotate == undefined ? false : options.rotate;
    let angularSpeed = options.angularSpeed == undefined ? 90 : options.angularSpeed;
    // 加载资源
    let fan = new Image();
    if (condition == 0) {
        fan.src = './images/fan_blue.svg';
    } else {
        fan.src = './images/fan_red.svg';
    }
    // 资源加载完成
    fan.onload = function () {
        let theFan = new Konva.Image({
            x: x,
            y: y,
            image: fan,
            width: 60,
            height: 60,
            draggable: true,
            offset: {
                x: 30,
                y: 30,
            },
            name: "draggable"
        });
        fanLayer.add(theFan);
        stage.add(fanLayer);
        fanLayer.setZIndex(6);
        // 对齐到网格
        snapToGrid(theFan, fanLayer);
        // 绑定事件
        theFan.on('mouseenter', function () { stage.container().style.cursor = 'pointer'; });
        theFan.on('mouseleave', function () { stage.container().style.cursor = 'default'; });
        if (rotate) {
            let anim = new Konva.Animation(function (frame) {
                let angleDiff = frame.timeDiff * angularSpeed / 1000;
                theFan.rotate(angleDiff);
            }, fanLayer);
            anim.start();
        }
    }
}

function drawServer(stage, serverLayer, options) {
    let x = options.x == undefined ? 0 : options.x;
    let y = options.y == undefined ? 0 : options.y;
    let condition = options.condition == undefined ? 0 : options.condition;
    // 加载资源
    let server_green = new Image();
    server_green.src = './images/server_green.svg';
    let server = new Image();
    if (condition == 0) {
        server.src = './images/server_white.svg';
    } else {
        server.src = './images/server_red.svg';
    }
    // 资源加载完成
    server.onload = function () {
        let theServer = new Konva.Image({
            x: x,
            y: y,
            image: server,
            width: 40,
            height: 40,
            draggable: true,
            name: "draggable",
        });
        serverLayer.add(theServer);
        stage.add(serverLayer);
        serverLayer.setZIndex(5);
        // 对齐到网格
        snapToGrid(theServer, serverLayer);
        // 事件绑定
        theServer.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
            if (condition == 0) {
                theServer.setImage(server_green);
                serverLayer.draw();
            }
        });
        theServer.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
            if (condition == 0) {
                theServer.setImage(server);
                serverLayer.draw();
            }
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
    return { group: group, layer: contourLayer }
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
    return { group: group, layer: gridLayer }
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