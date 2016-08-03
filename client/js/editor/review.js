const modal = document.getElementById('reviewModal');
const closeModal = document.getElementsByClassName('close')[1];


closeModal.onclick = () => {
    modal.style.display = "none";
};

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
}});

module.exports = function(node) {
  node.addEventListener('click', function (e) {
    modal.style.display = 'block';
  });
};
