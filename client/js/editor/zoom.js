import {editor} from "./fabmain.js";

// as in source http://jsfiddle.net/Q3TMA/1107/
let canvasScale = 1;
let SCALE_FACTOR = 1.25;
let canvas = editor.canv;

function resetZoom() {
    canvas.setHeight(canvas.getHeight() * (1 / canvasScale));
    canvas.setWidth(canvas.getWidth() * (1 / canvasScale));
    if (canvas.backgroundImage) {
        canvas.backgroundImage.width = canvas.getWidth();
        canvas.backgroundImage.height = canvas.getHeight();
    }

    let objects = canvas.getObjects();
    for (let i in objects) {
        let scaleX = objects[i].scaleX;
        let scaleY = objects[i].scaleY;
        let left = objects[i].left;
        let top = objects[i].top;

        let tempScaleX = scaleX * (1 / canvasScale);
        let tempScaleY = scaleY * (1 / canvasScale);
        let tempLeft = left * (1 / canvasScale);
        let tempTop = top * (1 / canvasScale);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }

    canvas.renderAll();

    canvasScale = 1;
}

function zoomOut() {
    canvasScale = canvasScale / SCALE_FACTOR;

    localStorage.setItem('canvasScale', canvasScale);

    canvas.setHeight(canvas.getHeight() * (1 / SCALE_FACTOR));
    canvas.setWidth(canvas.getWidth() * (1 / SCALE_FACTOR));

    if (canvas.backgroundImage) {
        canvas.backgroundImage.width = canvas.getWidth();
        canvas.backgroundImage.height = canvas.getHeight();
    }

    let objects = canvas.getObjects();
    for (let i in objects) {
        let scaleX = objects[i].scaleX;
        let scaleY = objects[i].scaleY;
        let left = objects[i].left;
        let top = objects[i].top;

        let tempScaleX = scaleX * (1 / SCALE_FACTOR);
        let tempScaleY = scaleY * (1 / SCALE_FACTOR);
        let tempLeft = left * (1 / SCALE_FACTOR);
        let tempTop = top * (1 / SCALE_FACTOR);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }

    canvas.renderAll();
}

function zoomIn() {
    canvasScale = canvasScale * SCALE_FACTOR;
    localStorage.setItem('canvasScale', canvasScale);

    canvas.setHeight(canvas.getHeight() * SCALE_FACTOR);
    canvas.setWidth(canvas.getWidth() * SCALE_FACTOR);
    if (canvas.backgroundImage) {
        canvas.backgroundImage.width = canvas.getWidth();
        canvas.backgroundImage.height = canvas.getHeight();
    }

    let objects = canvas.getObjects();
    for (let i in objects) {
        let scaleX = objects[i].scaleX;
        let scaleY = objects[i].scaleY;
        let left = objects[i].left;
        let top = objects[i].top;

        let tempScaleX = scaleX * SCALE_FACTOR;
        let tempScaleY = scaleY * SCALE_FACTOR;
        let tempLeft = left * SCALE_FACTOR;
        let tempTop = top * SCALE_FACTOR;

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }

    canvas.renderAll();
}

function createListenersKeyboard() {
    document.onkeydown = onKeyDownHandler;
}
function onKeyDownHandler(event) {
    //event.preventDefault();

    let key;
    if (window.event) {
        key = window.event.keyCode;
    }
    else {
        key = event.keyCode;
    }

    switch (key) {
        //////////////
        // Shortcuts
        //////////////
        // Zoom In (Ctrl+"+")
        case 187: // Ctrl+"+"
            if (event.ctrlKey) {
                event.preventDefault();
                zoomIn();
            }
            break;
        // Zoom Out (Ctrl+"-")
        case 189: // Ctrl+"-"
            if (event.ctrlKey) {
                event.preventDefault();
                zoomOut();
            }
            break;
        // Reset Zoom (Ctrl+"0")
        case 48: // Ctrl+"0"
            if (event.ctrlKey) {
                event.preventDefault();
                resetZoom();
            }
            break;
        default:
            // TODO
            break;
    }
}


function keysListen(node) {
    node.onload = createListenersKeyboard();
}

function setOriginalZoom(node) {
    node.addEventListener('click', resetZoom);
}
function zoomOuter(node) {
    node.addEventListener('click', zoomOut);
}
function setNormalZoom(node) {
    node.addEventListener('click', zoomIn);
}

module.exports = {
    'setOriginalZoom': setOriginalZoom,
    'setNormalZoom': setNormalZoom,
    'keysListen': keysListen,
    'zoomOuter': zoomOuter
};
