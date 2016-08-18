export default function (node) {
  node.addEventListener('click', (e) => {
    e.stopPropagation();
  })
}