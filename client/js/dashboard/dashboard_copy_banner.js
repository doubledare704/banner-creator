import React from 'react';
import { csrfToken, SuccessAlert, ErrorAlert } from '../helpers';
import { activatePopUp } from '../popUp';



export default function (node) {
  node.addEventListener('click', function (e) {
    const url = new URL(window.location.origin + node.dataset.url);
    const form = new FormData();
    form.append('banner_id', node.dataset.bannerId);
    fetch(url,
      {credentials: 'same-origin',
      method: 'POST',
      headers: {'X-CSRFToken': csrfToken()},
      body: form
      }
    ).then((res) => {
      if (res.status === 200) {
        res.text().then((data) => {
        const bannerDiv = document.createElement('div');
        bannerDiv.className = ('col-md-6 dashboard-banner-container');
        bannerDiv.innerHTML = data;
        node.closest(".row").insertBefore(bannerDiv, node.closest('.dashboard-banner-container').nextSibling);
        });
        activatePopUp({child: <SuccessAlert text="Копия баннера успешно создана"/>, flash: true})
      }
      else {
        activatePopUp({child: <ErrorAlert text="Произошла ошибка. Попробуйте повторить попытку."/>, flash: true})
      }
    });
  })
}