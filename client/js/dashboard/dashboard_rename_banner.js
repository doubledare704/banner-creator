import React from 'react';
import { csrfToken, SuccessAlert, ErrorAlert } from '../helpers';
import { activatePopUp } from '../popUp';


function PopUpForm(props) {
  return (
    <div dangerouslySetInnerHTML={{__html: props.form}}>
    </div>
  )
}

export default function (node) {
  node.addEventListener('click', function (e) {
    const url = new URL(window.location.origin +  node.dataset.url);
    url.searchParams.append('id', node.dataset.bannerId);
    fetch(url, {credentials: 'same-origin'}
    ).then((response) => {
      if (response.status === 200) {
        response.text().then((text) => {
            activatePopUp({child: <PopUpForm form={text} />})
        })
      }
      else {
        activatePopUp({child: <ErrorAlert text="Произошла ошибка. Попробуйте обновить страницу и повторить попытку"/>})
      }
  })
})
}