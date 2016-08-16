export default  function (node) {
  node.addEventListener('click', function (e) {
      window.location.href = node.dataset.reviewUrl;
  })
};