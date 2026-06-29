let imgs = [];
let scale = 100;
let max = 0;
let maxa = 0;
let counter;

let fileInput;
let myCanvas;
let ctx;
let rawCanvas;

let lastRendered = true
let otstup = 25

let lovimClick = false
let clickX = 0
let clickY = 0

let maxLocalScale = 0;



let isBPressed = false;

window.addEventListener('keydown', function(event) {
    if (event.code === 'KeyB') {
        isBPressed = true;
    }
});
window.addEventListener('keyup', function(event) {
    if (event.code === 'KeyB') {
        isBPressed = false;
    }
});


function setup() {
    noCanvas();

    fileInput = createFileInput(handleFile);
    fileInput.position(0, 640);
    fileInput.attribute('multiple', '');

    myCanvas = createElement('canvas');
    myCanvas.position(0, 0);

    rawCanvas = myCanvas.elt;
    rawCanvas.addEventListener('click', function(event) {

        // Получаем визуальные размеры канваса на экране (из CSS)
        const rect = rawCanvas.getBoundingClientRect();

        // Координаты клика НА ЭКРАНЕ относительно левого верхнего угла канваса
        const clientX = event.clientX - rect.left;
        const clientY = event.clientY - rect.top;

        // ПЕРЕСЧЕТ В РЕАЛЬНЫЕ ПИКСЕЛИ ХОЛСТА (через пропорцию)
        const realX = Math.round(clientX * (rawCanvas.width / rect.width));
        const realY = Math.round(clientY * (rawCanvas.height / rect.height));

        console.log(`Экранные пиксели (в пределах CSS): ${clientX}x${clientY}`);
        console.log(`Реальные пиксели холста (в пределах ${rawCanvas.width}x${rawCanvas.height}): ${realX}x${realY}`);

        // Пример: рисуем красный квадрат 50x50 пикселей в месте реального клика
        ctx.fillStyle = 'red';
        ctx.fillRect(realX - 25, realY - 25, 50, 50);
        lovimClick = true;
        clickX = realX
        clickY = realY
        reDraw()
    });
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


    counter = createP("Макс: 1000")
    counter.position(25, 700);

    ctupp = createButton("+")
    ctupp.mousePressed(function() {
        max += 1
        reDraw()
    })
    ctupp.position(0, 700);
    ctddo = createButton("-")
    ctddo.mousePressed(function() {
        max -= 1
        reDraw()
    })
    ctddo.position(100, 700);

    ctuppx = createButton("++")
    ctuppx.mousePressed(function() {
        max += 10
        reDraw()
    })
    ctuppx.position(0, 720);
    ctddox = createButton("--")
    ctddox.mousePressed(function() {
        max -= 10
        reDraw()
    })
    ctddox.position(100, 720);
}

function goodImgDraw(posx, posy, imgRaw) {
    let img = imgRaw[0]
    let localScale = scale - imgRaw[1]
    let sizex = img.width / (img.height / localScale)
    if (!(sizex + posx > rawCanvas.width)) {
        lastRendered = true
            //LOVIM CLICK
        if (lovimClick) {
            if (clickX > posx && (clickX < sizex + posx)) {
                if (clickY > posy && (clickY < localScale + posy)) {
                    console.log("С")
                    if (isBPressed) { imgRaw[1] = imgRaw[1] - (scale / 15) } else { imgRaw[1] = imgRaw[1] + (scale / 15) }

                    localScale = scale - imgRaw[1]
                    sizex = img.width / (img.height / localScale)
                }
            }
        }
        //RISUEM
        if (maxLocalScale < localScale) {
            maxLocalScale = localScale
        }
        ctx.drawImage(img, posx, posy, sizex, localScale)
        maxa++
    } else {
        lastRendered = false
    }
    return sizex + (otstup + (scale / 4))
}

function reDraw() {
    maxLocalScale = scale
    counter.html("Макс:" + max)
    maxa = 0;
    let renderX = 0;
    let renderY = 0;
    let imageIndex = 0;
    ctx.clearRect(0, 0, rawCanvas.width, rawCanvas.height) //CLEAR
    if (scale > 0 && imgs.length > 0)
        while (true) {
            if (lastRendered) {
                imageIndex += 1
            }
            if (imageIndex === imgs.length) {
                imageIndex = 0
            }
            if (renderX > rawCanvas.width) {
                renderY += maxLocalScale + (otstup + (scale / 4))
                renderX = 0
            }
            if ((renderY + scale) > rawCanvas.height) {
                break
            }
            renderX += goodImgDraw(renderX, renderY, imgs[imageIndex])
            if (maxa == max) {
                break
            }
        }
}

function handleFile(files) {
    if (!Array.isArray(files)) {
        files = [files];
    }
    let imagesToLoad = 0;
    let imageFiles = files.filter(f => f.type === 'image');
    if (imageFiles.length === 0) return;
    imageFiles.forEach(file => {
        imagesToLoad++;
        let img = new Image();
        img.src = file.data;
        img.onload = function() {
            imgs.push([img, 0]);
            imagesToLoad--;
            if (imagesToLoad === 0) {
                reDraw()
            }
        };
    });
}