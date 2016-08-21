import {h} from 'bazooka';
import {activatePopUp} from '../popUp';
import {csrfToken, ErrorAlert} from '../helpers';

const BAZOOKA_PREFIX = 'project-button';

function removeButtonClick(projectId) {
    return () => {
        fetch(`/admin/projects/${projectId}/button/`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-CSRFToken': csrfToken()
            },
        })
            .then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return window.location.reload();
                }
            )
            .catch((response) => {
                console.error(response.message);
                activatePopUp({
                    child: <ErrorAlert text="Произошла ошибка. Попробуйте обновить страницу и повторить попытку"/>,
                    flash: true,
                });
            });
    };

}

export default function handleRemoveButtonClick(node) {
    const {projectId} = h.getAttrs(BAZOOKA_PREFIX, node);
    node.onclick = removeButtonClick(projectId);
}

