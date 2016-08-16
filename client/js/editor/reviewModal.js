import {editor} from './fabmain';
import {disableControls} from './editor.js';
import {csrfToken} from '../helpers';
import { activateHtmlPopUp, deactivatePopUp } from '../popUp';


function sendToReview(event) {
    let canvas = editor.canv;
    let objs = canvas.getObjects();
    editor.filterAndDelete(objs);
    event.preventDefault();
    let o = editor.canv.getActiveObject(),
        g = editor.canv.getActiveGroup();
    disableControls(o, g);
    const formData = new FormData(event.target);
    let imageReview = editor.canv.toJSON();
    // append image as base64 string
    formData.append('file', editor.canv.toDataURL("image/png", 1.0));
    formData.append('file_json', JSON.stringify(imageReview));
    fetch(event.target.dataset.url,
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
            activateHtmlPopUp({
              child: "<p class='alert alert-success'>Баннер успешно отправлен на ревью</p>",
              flash: true
            });
            document.getElementById('resulting').src = result.src;
            document.getElementById('continue').href += result.rev;
            document.getElementById('double').style.display = "block";
            document.getElementById('continue').style.display = "inline-block";
            document.getElementById('result_review').style.display = "block";
            localStorage.clear();
        })
        .catch(function (error) {
            activateHtmlPopUp({
              child: "<p class='alert alert-danger'>Ошибка при выполнении запроса. Попробуйте отправить повторно.</p>",
              flash: true
            });
        });
    deactivatePopUp();
}

module.exports = function (node) {
    node.addEventListener('submit', sendToReview)
};
