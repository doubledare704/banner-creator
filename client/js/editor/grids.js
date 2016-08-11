import {editor} from './fabmain.js';

function loadNewGridSize() {
    const newSize = document.getElementById('newGrid');
    editor.setNewGridSize(newSize.value);
}

function loadGrid() {
    let defaultGrid = 10;
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