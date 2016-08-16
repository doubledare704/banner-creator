import {editor} from './fabmain';
import {disableControls} from './editor.js';
import {csrfToken} from '../helpers';

require('./modals.js');
const modal = document.getElementById('reviewModal');

function sendToReview(event) {
    let canvas = editor.canv;
    let objs = canvas.getObjects();
    editor.filterAndDelete(objs);
    event.preventDefault();
    const saver = document.getElementById('progress_saver');
    const previewId = saver.getAttribute('data-review');
    let o = editor.canv.getActiveObject(),
        g = editor.canv.getActiveGroup();
    disableControls(o, g);
    const formData = new FormData(event.target);
    let imageReview = editor.canv.toJSON();
    // append image as base64 string
    formData.append('file', editor.canv.toDataURL("image/png", 1.0));
    formData.append('file_json', JSON.stringify(imageReview));
    formData.append('ids', previewId);

    fetch('/api/review',
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
            document.getElementById('resulting').src = result.src;
            document.getElementById('double').style.display = "block";
            document.getElementById('result_review').style.display = "inline-block";
            localStorage.clear();
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
    modal.style.display = "none";
}

module.exports = function (node) {
    node.addEventListener('submit', sendToReview)
};
