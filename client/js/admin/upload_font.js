import {h} from 'bazooka';
import {activatePopUp} from '../popUp.js';
import {csrfToken} from '../helpers';
const BAZOOKA_PREFIX = 'font';


function configUploadFont(projectId) {
    return (e) => {
        e.preventDefault();
        fetch(`/admin/projects/${projectId}/fonts/`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-CSRFToken': csrfToken()
            },
            body: new FormData(e.target)
        })
            .then((response) => {
                    if (response.ok) {
                        location.reload();
                    }
                    let errorMessage;
                    switch (response.status) {
                        case 422:
                            errorMessage = 'Шрифт с таким именем уже существует';
                            break;
                        case 400:
                            errorMessage = 'Ошибка сервера. Возможно, Вы не выбрали файл';
                            break;
                        default:
                            console.error(response.statusText);
                            errorMessage = 'Ошибка сервера.';
                    }
                    activatePopUp({
                        title: errorMessage,
                        flash: true,
                    });
                }
            );
    };
}


export default function handleUploadFont(node) {
    const {projectId} = h.getAttrs(BAZOOKA_PREFIX, node);
    node.onsubmit = configUploadFont(projectId);
}
