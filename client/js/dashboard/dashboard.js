import * as helpers from '../helpers.js';


function showBanner(e) {
  const node = e.target;
  const parentNode = node.parentNode;
  const imageNode = parentNode.lastElementChild;
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