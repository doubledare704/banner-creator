import React from 'react';
import {h} from 'bazooka';
import {activatePopUp} from '../popUp.js';
import {csrfToken, SuccessAlert, ErrorAlert} from '../helpers';
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
                        return location.reload();
                    }
                    if (response.status === 422) {
                        activatePopUp({
                            child: <ErrorAlert text='Шрифт с таким именем уже существует'/>,
                            flash: true,
                        });
                    } else {
                        throw Error(response.statusText);
                    }
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


export default function handleUploadFont(node) {
    const {projectId} = h.getAttrs(BAZOOKA_PREFIX, node);
    node.onsubmit = configUploadFont(projectId);
}
