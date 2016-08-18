import {editor, resizeIfBackground} from './fabmain.js';
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
            resizeIfBackground(fetch_history);
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
