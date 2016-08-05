import * as helpers from '../helpers.js';


function showBanner(e) {
  const node = e.target;
  let nodeParent = node.parentNode;
  if (nodeParent.nodeName !== 'DIV') { nodeParent = nodeParent.parentNode }
  const imageNode = nodeParent.lastElementChild;
  if (helpers.isHidden(imageNode)) {
    const imgSrcAttr = imageNode.getAttribute('imgSrc');
    imageNode.setAttribute('src', imgSrcAttr);
    imageNode.style.display = 'block';
  }
  else {
    imageNode.style.display = 'none';
  }
}

export default function (node) {
  node.addEventListener('click', showBanner)
};