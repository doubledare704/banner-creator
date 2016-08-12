import {editor} from './fabmain.js';

function loadNewGridSize() {
    const newSize = document.getElementById('newGrid');
    let ns = newSize.value;
    editor.setNewGridSize(ns);
}

function loadGrid() {
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
function setGrid(node) {
    node.addEventListener('click', loadGrid);
}
function setGridSize(node) {
    node.addEventListener('input', loadNewGridSize);
}

module.exports = {
    'setGrid': setGrid,
    'setGridSize': setGridSize
};