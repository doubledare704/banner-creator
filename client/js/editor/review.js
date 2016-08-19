import React from 'react';
import { activatePopUp } from '../popUp';

const saver = document.getElementById('progress_saver');


function PopUpForm(props) {
  return (
    <div dangerouslySetInnerHTML={{__html: props.form}}>
    </div>
  )
}


export default function(node) {
  node.addEventListener('click', function (e) {
    fetch(node.dataset.url,
      {credentials: 'same-origin'})
      .then((res) => res.text())
      .then((text) => {
        activatePopUp({child: <PopUpForm form={text} />});
        const title_input = document.querySelector('input[name=title]');
        if (saver) { title_input.value = saver.dataset.banner_title }
      });
  });
};
