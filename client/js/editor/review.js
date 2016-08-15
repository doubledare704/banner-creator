import { activateHtmlPopUp } from '../popUp';


export default function(node) {
  node.addEventListener('click', function (e) {
    fetch(node.dataset.url,
      {credentials: 'same-origin'})
      .then((res) => res.text())
      .then((text) => {
        activateHtmlPopUp({child: text})
      });
  });
};
