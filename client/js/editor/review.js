import { editor } from './fabmain';

const modal = document.getElementById('reviewModal');
const closeModal = document.getElementsByClassName('close')[1];

const sendReviewBtn = document.getElementById('submitReview');

sendReviewBtn.addEventListener('click', sendImage);

closeModal.onclick = ()=> {
    modal.style.display = "none";
};

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
}});

function sendImage() {
  const file = editor.canv.toDataURL("image/png", 1.0);
  const random_name = Math.random().toString(36).substr(2, 10) + '.png';
  const commentNode = document.getElementById('reviewComment');
  const comment = commentNode.value;
  const data = {
    file: file,
    comment: comment
  };
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
      response.json().then(function (data) {
        console.log(data)
      })
    });
  modal.style.display = 'none';
}

module.exports = function(node) {
  node.addEventListener('click', function (e) {
    modal.style.display = 'block';
  });
};