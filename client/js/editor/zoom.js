import {editor} from './fabmain.js';

// as in source http://jsfiddle.net/Q3TMA/1107/
let copiedObject;
let copiedObjects = [];
let canvasScale = 1;
let SCALE_FACTOR = 1.2;
let canvas = editor.canv;

function resetZoom() {
    const newSize = document.getElementById('newGrid');
    let ns = newSize.value;
    editor.setNewGridSize(ns);
}

function zoomIn() {
    let defaultGrid = 0;
    const innumber = document.getElementById('newGrid');
    if (innumber.value > 0) {
        defaultGrid = innumber.value;
    }
    else {
        defaultGrid = 15;
        innumber.value = defaultGrid;
    }
    editor.setGridToCanv(defaultGrid);
    const secnumber = document.getElementById('gridder');
    if (secnumber.classList.contains('disabled')) {
        secnumber.classList.remove("disabled");
        if (innumber.hasAttribute('disabled')) {
            innumber.removeAttribute("disabled");
        }
    }
    else {
        secnumber.classList.add("disabled");
        if (!innumber.hasAttribute('disabled')) {
            innumber.setAttribute("disabled", "disabled");
        }
    }
}

function createListenersKeyboard() {
    document.onkeydown = onKeyDownHandler;
}
function onKeyDownHandler(event) {
    //event.preventDefault();

    var key;
    if(window.event){
        key = window.event.keyCode;
    }
    else{
        key = event.keyCode;
    }

    switch(key){
        //////////////
        // Shortcuts
        //////////////
        // Zoom In (Ctrl+"+")
        case 187: // Ctrl+"+"
            if(ableToShortcut()){
                if(event.ctrlKey){
                    event.preventDefault();
                    zoomIn();
                }
            }
            break;
        // Zoom Out (Ctrl+"-")
        case 189: // Ctrl+"-"
            if(ableToShortcut()){
                if(event.ctrlKey){
                    event.preventDefault();
                    zoomOut();
                }
            }
            break;
        // Reset Zoom (Ctrl+"0")
        case 48: // Ctrl+"0"
            if(ableToShortcut()){
                if(event.ctrlKey){
                    event.preventDefault();
                    resetZoom();
                }
            }
            break;
        default:
            // TODO
            break;
    }
}


function keysListen(node){
    node.onload = createListenersKeyboard();
}

function setOriginalZoom(node) {
    node.addEventListener('click', resetZoom);
}
function setNormalZoom(node) {
    node.addEventListener('input', zoomIn);
}

module.exports = {
    'setOriginalZoom': setOriginalZoom,
    'setNormalZoom': setNormalZoom
};
