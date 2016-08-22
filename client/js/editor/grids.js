import {editor} from './fabmain.js';

function loadNewGridSize() {
    const newSize = document.getElementById('newGrid');
    let ns = newSize.value;
    if (ns < 5) {
        ns = 5;
    }
    editor.setNewGridSize(ns);
}

function loadGrid() {
    let defaultGrid = 0;
    const innumber = document.getElementById('newGrid');
    if (innumber.value > 0) {
        defaultGrid = innumber.value;
    }
    else {
        defaultGrid = 10;
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

    let trigger = document.getElementById('gridTrigger');
    if (trigger.innerText.includes('on')) {
        trigger.innerText = 'grid_off'
    }
    else {
        trigger.innerText = 'grid_on'
    }
}

function adaptgrid() {
    editor.setAdaptiveGrid();
}

function adaptiveGrid(node) {
    node.addEventListener('click', adaptgrid);
}
function setGrid(node) {
    node.addEventListener('click', loadGrid);
}
function setGridSize(node) {
    node.addEventListener('input', loadNewGridSize);
}

module.exports = {
    'setGrid': setGrid,
    'setGridSize': setGridSize,
    'adaptiveGrid': adaptiveGrid
};