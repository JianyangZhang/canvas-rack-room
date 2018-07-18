window.onload = function () {
    // 准备容器
    bootCheck();
    let app = createApp();
    let stage = app.stage;
    let resources = PIXI.utils.TextureCache;

    // 绘制机房轮廓
    drawRoomContour(stage);

    // 加载资源
    PIXI.loader.add([
        "images/server_white.svg",
    ]).load(afterLoad);

    // 资源加载完成
    function afterLoad() {
        let server_white = new PIXI.Sprite(resources["images/server_white.svg"]);
        // stage.addChild(server_white);
    }
}

// 检查是否支持WebGL
function bootCheck() {
    let type = "WebGL"
    if (!PIXI.utils.isWebGLSupported()) {
        type = "canvas"
    }
    PIXI.utils.sayHello(type)
}

// 创建应用
function createApp() {
    let app = new PIXI.Application({
        antialias: true,
        transparent: false,
        backgroundColor: 0x1F1E2C,
        resolution: 1
    });
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(app.view);
    return app;
}

function drawRoomContour(stage) {
    // 初始化
    let xGap = 15;
    let yGap = 15;
    let outline_breadth = 3;
    let inline_breadth = 2;
    let container = new PIXI.Container();
    let outline = new PIXI.Graphics();
    let line1 = new PIXI.Graphics();

    // 设置总容器
    container.addChild(outline);
    container.addChild(line1)
    container.position.set(xGap, yGap);

    // 绘制外边框
    outline.lineStyle(outline_breadth, 0xFFFFFF, 1);
    outline.drawRect(0, 0, window.innerWidth - 2 * xGap, window.innerHeight - 2 * yGap);
    outline.endFill();
    
    // 绘制内边框1
    line1.lineStyle(inline_breadth, 0xFFFFFF, 1);
    line1.moveTo(0, outline.height - 100);
    line1.lineTo(outline.width - outline_breadth, outline.height - 100);
    
    // 渲染
    stage.addChild(container);
    return container;
}