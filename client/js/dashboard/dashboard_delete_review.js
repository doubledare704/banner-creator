import React from 'react';

import {activatePopUp} from '../popUp';
import {csrf} from '../helpers';


function ConfirmationHeader(props) {
  return <h2 className="text-danger">{props.message}</h2>
}


function Message(props) {
  return <h2 className="text-success">{props.message}</h2>
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
       headers: {'X-CSRFToken': csrf()}
     })
       .then(
         (response) => {
           if (response.status === 204) {
             activatePopUp({
               child: <Message message="Ревью помещено в Архив"/>,
               flash: true
             });
             node.closest('.dashboard-content .row').remove();  // remove message from DOM
           }
           return response
         }
       )
    }
  });
})}
