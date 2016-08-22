import React from 'react';
import { csrfToken, SuccessAlert, ErrorAlert } from '../helpers';
import { activatePopUp, deactivatePopUp } from '../popUp';


export default function (node) {
  node.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = new FormData(node);
    form.append('banner_id', node.dataset.bannerId);
    fetch(node.dataset.url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'X-CSRFToken': csrfToken()},
      body: form
    }).then((response) => {
      deactivatePopUp();
      if (response.status === 200) {
        response.text()
          .then((data) => {
            activatePopUp({child: <SuccessAlert text="Название баннера сохранено."/>, flash: true});
            const bannerId = form.get('banner_id');
            const bannerTitle = document.getElementById(`dashboard-banner-title-${bannerId}`);
            bannerTitle.textContent = data;
        });
      }
      else {
        activatePopUp({child: <ErrorAlert text="Произошла ошибка. Попробуйте обновить страницу и повторить попытку." />, flash: true})
      }
    })
  })
}