import {editor, resizeIfBackground} from './fabmain.js';
import React from 'react';
import {csrfToken} from '../helpers';
import {activatePopUp} from '../popUp';
import {disableControls} from './editor';
import {ErrorAlert, SuccessAlert} from '../helpers';
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
        .then(function ({fetch_history, banner_title}) {
            editor.canv.clear();
            resizeIfBackground(fetch_history);
            saver.dataset.banner_title = banner_title;
        })
        .catch(function (error) {
            console.log(error);
        });
}
function sendTohistory() {
    const id = saver.getAttribute('data-review');
    let image_history = editor.canv.toJSON();
    let objs = editor.canv.getObjects();
    editor.filterAndDelete(objs);
      let o = editor.canv.getActiveObject(),
          g = editor.canv.getActiveGroup();
    disableControls(o, g);
    const image = editor.canv.toDataURL("image/png", 1.0);
    const data = {
        hist_id: id,
        jsn: image_history,
        image: image

    }
    fetch(`/editor/history/${id}`, {
        method: 'post',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken()
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
          if (response.status == 200) { activatePopUp({child: <SuccessAlert text="Изменения сохранены" />, flash: true})}
          else { activatePopUp({child: <ErrorAlert text="Ошибка при попытке сохранить изменения."/>, flash: true}) }
        })
}

function reloadHistory(node) {
    node.onload = loadHist();
}

function saveToHistory(node) {
    node.addEventListener('click', sendTohistory);
    node.onload = loadHist();
}
module.exports = {
    'reloadHistory': reloadHistory,
    'saveToHistory': saveToHistory
};
