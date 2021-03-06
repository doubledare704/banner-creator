//load fabric
let fabric = require('fabric').fabric;
require('./modals.js');

import Editor from './editor.js';
import {csrfToken} from '../helpers';
let editor = new Editor('main', 960, 420);

const fileInput = document.getElementById('input');
const downloadLink = document.getElementById('download');
const addbutton = document.getElementById('addButt');
const addtexts = document.querySelectorAll('#rightcol ul li');
const filetoeditor = document.getElementById('inputted');
const deleteFabricItem = document.getElementById('del_item');
const beforeCutter = document.getElementById('cutters');
const allCutted = document.getElementById('from_db');

// loads all cuted backgrounds from db
allCutted.addEventListener('click', function popList(event) {
    const lister = document.getElementById('list-cuted');
    if (!lister.classList.contains('hidden')) {
        lister.classList.remove('flexic');
        lister.classList.add('hidden');
    }
    else {
        lister.innerHTML = '';
        lister.classList.remove('hidden');
        lister.classList.add('flexic');
        fetch('/editor/cut-choose/',
            {
                method: 'get',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => res.json())
            .then(function ({result}) {
                for (var i = 0; i < result.length; i++) {
                    var elem = document.createElement("div");
                    elem.innerHTML = "<img class='boxer' src=" + result[i].preview + " href=" + result[i].url + " />";
                    lister.innerHTML += elem.outerHTML;
                }
                const cut_list = document.querySelectorAll('#list-cuted div img');
                event.stopPropagation();
                for (let i = 0; i < cut_list.length; i++) {
                    cut_list[i].addEventListener('click', function () {
                        let url = this.getAttribute("href");
                        if (url) {
                            fabric.Image.fromURL(url, (img) => {

                                let originalsize = img.getOriginalSize();
                                let imgratio = img.width / img.height;
                                let newsize = [editor.canv.width * 0.5, editor.canv.width * 0.5 / imgratio];

                                if (originalsize.width > editor.canv.width || originalsize.height > editor.canv.height) {
                                    img.set({
                                        width: newsize[0],
                                        height: newsize[1]
                                    })
                                }
                                editor.canv.add(img);
                            });
                        }
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
});

// save to local storage
beforeCutter.addEventListener('click', function () {
    resetforSaveEdit();
    let bannerStory = editor.canv.toJSON();
    let projectIDToLeave = document.getElementById('backgroundSection').getAttribute('data-project');
    bannerStory = JSON.stringify(bannerStory);
    localStorage.setItem('projectId', projectIDToLeave);
    localStorage.setItem('canvasStory', bannerStory);
    localStorage.setItem('gridSize', document.getElementById('newGrid').value);
});

// deletes custom object from canvas
deleteFabricItem.addEventListener('click', function () {
    let activeObject = editor.canv.getActiveObject(),
        activeGroup = editor.canv.getActiveGroup();
    editor.deleteObject(activeObject, activeGroup);
});

addbutton.addEventListener('click', function () {
    let url_iamge = addbutton.getAttribute('data-button');
    editor.addButton(url_iamge);
});

for (var i = 0; i < addtexts.length; i++) {
    addtexts[i].addEventListener('click', function () {
        let sizes = this.getAttribute("data-size");
        let texting = this.getAttribute("data-text");
        let typings = this.getAttribute("data-type");
        let fonter = this.getAttribute("data-font");
        if (typings) {
            editor.setPrice(fonter, sizes, '#000', texting);
        }
        else {
            editor.setFont(fonter, sizes, '#000', texting);
        }
    });
}

fileInput.addEventListener('click', function () {
    document.getElementById('inputted').click();
    return false;
});

filetoeditor.addEventListener('change', (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', filetoeditor.files[0]);
    fetch('/editor/local/',
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-CSRFToken': csrfToken()
            },
            body: formData
        }
    )
        .then((res) => res.json())
        .then(function ({result}) {
            var src = result.src;
            fabric.Image.fromURL(src, (img) => {

                let originalsize = img.getOriginalSize();
                let imgratio = img.width / img.height;
                let newsize = [editor.canv.width * 0.5, editor.canv.width * 0.5 / imgratio];

                if (originalsize.width > editor.canv.width || originalsize.height > editor.canv.height) {
                    img.set({
                        width: newsize[0],
                        height: newsize[1]
                    })
                }
                editor.canv.add(img);
                filetoeditor.value = ""
            });
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
});

downloadLink.addEventListener('click', function () {
    const link = this;
    let activeObject = editor.canv.getActiveObject(),
        activeGroup = editor.canv.getActiveGroup();
    editor.downloadImage(link, activeObject, activeGroup);
}, false);


// adding undo redo
// http://stackoverflow.com/questions/19043219/undo-redo-feature-in-fabric-js
// Fabric.js Canvas object
let canvas = editor.canv;
// current unsaved state
let state;
// past states
let undo = [];
// reverted states
let redo = [];

let reDo = document.getElementById('redo');
let unDo = document.getElementById('undo');

/**
 * Push the current state into the undo stack and then capture the current state
 */
function save() {
    // clear the redo stack
    redo = [];
    if (!reDo.classList.contains('disabled')) {
        reDo.classList.add('disabled');
    }
    // initial call won't have a state
    if (state) {
        undo.push(state);
        unDo.classList.remove("disabled");
    }
    state = JSON.stringify(canvas);
}

/**
 * Save the current state in the redo stack, reset to a state in the undo stack, and enable the buttons accordingly.
 * Or, do the opposite (redo vs. undo)
 * @param playStack which stack to get the last state from and to then render the canvas as
 * @param saveStack which stack to push current state into
 * @param buttonsOn jQuery selector. Enable these buttons.
 * @param buttonsOff jQuery selector. Disable these buttons.
 */
function replay(playStack, saveStack, buttonsOn, buttonsOff) {
    saveStack.push(state);
    if (playStack.length > 0)
        state = playStack.pop();
    let on = document.getElementById(buttonsOn);
    let off = document.getElementById(buttonsOff);
    // turn both buttons off for the moment to prevent rapid clicking
    if (!on.classList.contains('disabled')) {
        on.classList.add('disabled');
    }
    canvas.clear();
    canvas.loadFromJSON(state, function () {
        canvas.renderAll();
        // now turn the buttons back on if applicable
        on.classList.remove("disabled");
        if (playStack.length <= 1) {
            off.classList.remove("disabled");

        }
    });
}

function undoRedo() {
    save();
    // register event listener for user's actions
    canvas.on('object:modified', function () {
        save();
    });
    // undo and redo buttons
    unDo.onclick = function () {
        replay(undo, redo, 'redo', 'undo');
    };
    reDo.onclick = function () {
        replay(redo, undo, 'undo', 'redo');
    };
}


function resetAll() {
    editor.canv.clear();
    localStorage.clear();
    editor.canv.setBackgroundImage(null, editor.canv.renderAll.bind(editor.canv));
    editor.canv.setWidth(960);
    editor.canv.setHeight(420);
}

function resetCanvas(node) {
    node.addEventListener('click', resetAll);
}

function setColorObjs(node) {
    let handler = function setCols() {
        let activeObject = editor.canv.getActiveObject(),
            activeGroup = editor.canv.getActiveGroup();
        let colorToSend = '#' + node.value;
        editor.setColorToObjects(activeObject, activeGroup, colorToSend)
    };
    node.onchange = handler;
    node.oninput = handler;
}

function deleteKeyup(node) {
    node.onload = document.addEventListener('keydown', function (event) {
        var key = event.keyCode || event.charCode;

        if (key == 46) {
            let activeObject = editor.canv.getActiveObject(),
                activeGroup = editor.canv.getActiveGroup();
            editor.deleteObject(activeObject, activeGroup);
            return false;
        }
    }, false);
}

function redoUndo(node) {
    node.onload = undoRedo();
}

window.onload = function () {

    if (localStorage['canvasStory']) {
        editor.canv.clear();
        let canvasStory = localStorage.getItem('canvasStory');
        resizeIfBackground(canvasStory, true);
    }
    if (localStorage['file_cuted']) {
        fabric.Image.fromURL(localStorage.getItem('file_cuted'), (img) => {

            let originalsize = img.getOriginalSize();
            let imgratio = img.width / img.height;
            let newsize = [editor.canv.width * 0.5, editor.canv.width * 0.5 / imgratio];

            if (originalsize.width > editor.canv.width || originalsize.height > editor.canv.height) {
                img.set({
                    width: newsize[0],
                    height: newsize[1]
                })
            }
            editor.canv.add(img);
        });
    }
    if (localStorage['gridSize']) {
        editor.setNewGridSize(localStorage.getItem('gridSize'));
        document.getElementById('newGrid').value = localStorage.getItem('gridSize');
    }
};

function resizeIfBackground(jsonResul, ifParse = false) {
    if (ifParse) {
        jsonResul = JSON.parse(jsonResul);
    }
    let w, h;
    if (jsonResul.hasOwnProperty('backgroundImage')) {
        let unpack = jsonResul.backgroundImage;
        w = unpack.width;
        h = unpack.height;
        (function getCanvasAtResoution(newWidth, newHeight) {
            let can = editor.canv;
            if (can.width != newWidth || can.height != newHeight) {
                can.setWidth(newWidth);
                can.setHeight(newHeight);
                can.renderAll();
                can.calcOffset();
            }
        })(w, h);
    }
    editor.canv.loadFromJSON(jsonResul, editor.canv.renderAll.bind(editor.canv))
}

function resetforSaveEdit() {
    let canvasScale = localStorage.canvasScale;
    if (canvasScale) {
        let canvas = editor.canv;
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
    }
    canvas.renderAll();

    localStorage.setItem('canvasScale', 1);
}

module.exports = {
    'editor': editor,
    'fabric': fabric,
    'resetCanvas': resetCanvas,
    'deleteKeyup': deleteKeyup,
    'redoUndo': redoUndo,
    'resizeIfBackground': resizeIfBackground,
    'setColorObjs': setColorObjs
};
