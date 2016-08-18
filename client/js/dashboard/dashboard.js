import * as helpers from '../helpers.js';


function showBanner(e) {
  const node = e.target;
  let nodeParent = node.parentNode;
  if (nodeParent.nodeName !== 'DIV') { nodeParent = nodeParent.parentNode }
  const imageWrapper = nodeParent.lastElementChild;
  const imageNode = imageWrapper.lastElementChild;
  if (helpers.isHidden(imageWrapper)) {
    const imgSrcAttr = imageNode.getAttribute('imgSrc');
    imageNode.setAttribute('src', imgSrcAttr);
    imageWrapper.style.display = 'block';
  }
  else {
    imageWrapper.style.display = 'none';
  }
}

export default function (node) {
  node.addEventListener('click', showBanner)
};