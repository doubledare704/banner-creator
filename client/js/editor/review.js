import { editor } from './fabmain';


function sendImage() {
  const file = editor.canv.toDataURL("image/png", 1.0);
  const random_name = Math.random().toString(36).substr(2, 10) + '.png';
  const data = {file: file};
  fetch('/api/review',
    { method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function (response) {
      console.log(response);
      response.JSON().then(function (data) {
        console.log(data)
      })
    })
  ;

}

module.exports = function(node) {
  node.addEventListener('click', function (e) {
    sendImage();

    // node.href = editor.canv.toDataURL("image/png", 1.0);
    // node.download = 'result.png';
  });
};