import { editor } from './fabmain';

const modal = document.getElementById('reviewModal');

function sendToReview(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  // append image as base64 string
  formData.append('file', editor.canv.toDataURL("image/png", 1.0));
  fetch('/api/review',
    {
      method: 'POST',
      credentials: 'same-origin',
      body: formData
    }
  )
  .then(function (response) {
    if (response.status === 201) {
      // show popup with success message here
    }
    else {
      // show popup with error message here
    }
    });
  modal.style.display = "none";
}

module.exports = function (node) {
  node.addEventListener('submit', sendToReview)
};