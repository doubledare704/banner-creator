import React from 'react';
import { csrfToken, ErrorAlert, SuccessAlert } from '../helpers';
import { activatePopUp } from '../popUp';

export default function (node) {
  node.addEventListener('click', (e) => {
    e.preventDefault();
    activatePopUp({
      child: 'Удалить баннер?',
      confirm: true,
      confirmAction: () => {
        fetch(node.dataset.url,
          {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'X-CSRFToken': csrfToken()}
          })
          .then((response) => {
            if (response.status === 204) {
              activatePopUp({child: <SuccessAlert text="Баннер успешно удален."/>, flash: true});
              node.closest('.dashboard-banner-container').remove()
            }
            else {
              activatePopUp({child: <ErrorAlert text="Ошибка при попытке удалить баннер. Попробуйте снова."/>, flash: true})
            }
          })
      }
    });
  })
}