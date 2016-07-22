
import {editor} from './fabmain.js';

function loadHistoryImage(){
    window.onload = function () {
        fetch('/editor/')
    }
}

function reloadHistory(node) {
    node.addEventListener('click', loadHistoryImage);
}

module.exports = {
    'reloadHistory': reloadHistory
};