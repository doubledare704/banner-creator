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
    // let reDo = document.getElementById('redo');
    // let unDo = document.getElementById('undo');
    reDo.setAttribute('disabled', 'disabled');
    // $('#redo').prop('disabled', true);
    // initial call won't have a state
    if (state) {
        undo.push(state);
        unDo.setAttribute('disabled', '');
        // $('#undo').prop('disabled', false);
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
    state = playStack.pop();
    let on = document.getElementById(buttonsOn);
    let off = document.getElementById(buttonsOff);
    // turn both buttons off for the moment to prevent rapid clicking
    on.setAttribute('disabled', 'disabled');
    off.setAttribute('disabled', 'disabled');

    // on.prop('disabled', true);
    // off.prop('disabled', true);
    canvas.clear();
    canvas.loadFromJSON(state, function () {
        canvas.renderAll();
        // now turn the buttons back on if applicable
        on.setAttribute('disabled', '');
        if (playStack.length) {
            off.setAttribute('disabled', '');
        }
    });
}

$(function () {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Set up the canvas
    // canvas = new fabric.Canvas('canvas');
    // canvas.setWidth(500);
    // canvas.setHeight(500);
    // save initial state
    save();
    // register event listener for user's actions
    canvas.on('object:modified', function () {
        save();
    });
    // draw button
    // $('#draw').click(function () {
    //     var imgObj = new fabric.Circle({
    //         fill: '#' + Math.floor(Math.random() * 16777215).toString(16),
    //         radius: Math.random() * 250,
    //         left: Math.random() * 250,
    //         top: Math.random() * 250
    //     });
    //     canvas.add(imgObj);
    //     canvas.renderAll();
    //     save();
    // });
    // undo and redo buttons
    unDo.onclick = function () {
        replay(undo, redo, 'redo', this);
    };
    reDo.onclick = function () {
        replay(undo, redo, 'undo', this);
    };
    // $('#redo').click(function () {
    //     replay(redo, undo, '#undo', this);
    // })
});