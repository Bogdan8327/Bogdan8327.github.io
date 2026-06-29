let imgs = [];
let scale = 100;


let fileInput;
let myCanvas;
let ctx;
let rawCanvas;

function setup() {
    noCanvas();

    fileInput = createFileInput(handleFile);
    fileInput.position(0, 640);

    myCanvas = createElement('canvas');
    myCanvas.position(0, 0);

    rawCanvas = myCanvas.elt;
    ctx = rawCanvas.getContext('2d');

    // 1. Задаем РЕАЛЬНОЕ внутреннее разрешение холста
    rawCanvas.width = 2480;
    rawCanvas.height = 3508;

    // 2. Задаем ВИЗУАЛЬНЫЙ размер на экране через CSS-стили
    myCanvas.style('width', '480px');
    myCanvas.style('height', '640px');

    // Добавим рамку, чтобы видеть границы сжатого холста
    myCanvas.style('border', '1px solid black');

    scaleUpButton = createButton("Увеличить размер")
    scaleUpButton.mousePressed(function() {
        reDraw()
        scale += 25
    })
    scaleUpButton.position(0, 660);
    scaleDownButton = createButton("Уменьшить размер")
    scaleDownButton.mousePressed(function() {
        reDraw()
        scale -= 25
    })
    scaleDownButton.position(0, 680);
}

function goodImgDraw(posx, posy, img) {
    let sizex = img.width / (img.height / scale)
    if (!(sizex + posx > rawCanvas.width)) {
        ctx.drawImage(img, posx, posy, sizex, scale)
    }
    return sizex
}

function reDraw() {
    let renderX = 0;
    let renderY = 0;
    let imageIndex = 0;
    ctx.clearRect(0, 0, rawCanvas.width, rawCanvas.height) //CLEAR
    if (scale > 0 && imgs.length > 0)
        while (true) {
            imageIndex += 1
            if (imageIndex === imgs.length) {
                imageIndex = 0
            }
            if (renderX > rawCanvas.width) {
                renderY += scale
                renderX = 0
            }
            if ((renderY + scale) > rawCanvas.height) {
                break
            }
            renderX += goodImgDraw(renderX, renderY, imgs[imageIndex])
        }
}

function handleFile(file) {
    if (file.type === 'image') {
        let img = new Image();
        img.src = file.data;

        img.onload = function() {
            imgs.push(img)
            reDraw()
        };
    }
}