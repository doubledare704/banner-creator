import {editor} from './fabmain.js';

function loadNewGridSize() {
    const newSize = document.getElementById('newGrid');
    let ns = newSize.value;
    editor.setNewGridSize(ns);
}

function loadGrid() {
    let defaultGrid = 15;
    document.getElementById('newGrid').value = defaultGrid;
    editor.setGridToCanv(defaultGrid);
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