import {editor} from './fabmain.js';
import {csrfToken} from '../helpers';
const saver = document.getElementById('progress_saver');

function loadHist() {
    const previewId = saver.getAttribute('data-review');
    fetch(`/editor/history/${previewId}`, {
            method: 'get',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
        .then((result) => result.json())
        .then(function ({fetch_history}) {
            editor.canv.clear();
            let w, h;
            let ar = fetch_history;
            let rt = JSON.stringify(fetch_history);
            
            if (fetch_history.hasOwnProperty('backgroundImage')) {
                let unpack = fetch_history.backgroundImage;
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
            editor.canv.loadFromJSON(fetch_history, editor.canv.renderAll.bind(editor.canv))
        })
        .catch(function (error) {
            console.log(error);
        });
}
function sendTohistory() {
    const id = saver.getAttribute('data-review');
    let image_history = editor.canv.toJSON();
    const data = {
        hist_id: id,
        jsn: image_history
    };
    fetch(`/editor/history/${id}`, {
        method: 'post',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken()
        },
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .catch(function (error) {
            console.log('Request failed', error);
        });
}

function reloadHistory(node) {
    node.onload = loadHist();
}

function saveToHistory(node) {
    node.addEventListener('click', sendTohistory)
}
module.exports = {
    'reloadHistory': reloadHistory,
    'saveToHistory': saveToHistory
};
