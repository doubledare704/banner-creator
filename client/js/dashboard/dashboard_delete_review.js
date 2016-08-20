import React from 'react';

import { activatePopUp } from '../popUp';
import { csrfToken, SuccessAlert, ErrorAlert } from '../helpers';


function ConfirmationHeader(props) {
  return <h4 className="text-danger">{props.message}</h4>
}


export default function (node) {
 node.addEventListener('click', function (e) {
  e.stopPropagation();

  activatePopUp({child: <ConfirmationHeader message="Удалить ревью?" />,
    confirm: true,
    confirmAction: function() {
     const url = node.dataset.url;
     fetch(url, {
       method: 'POST',
       credentials: 'same-origin',
       headers: {'X-CSRFToken': csrfToken()}
     })
       .then(
         (response) => {
           if (response.status === 204) {
             activatePopUp({
               child: <SuccessAlert text="Ревью помещено в Архив"/>,
               flash: true
             });
             node.closest('.dashboard-content .row').remove();  // remove message from DOM
           }
           else {
             activatePopUp({
               child: <ErrorAlert text="Произошла ошибка. Попробуйте обновить страницу и повторить попытку."/>,
               flash: true
             })
           }
           return response
         }
       )
    }
  });
})}
