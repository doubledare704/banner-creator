import * as helpers from '../helpers';


function toggleProfileForm(e) {
  const node = e.target;
  const parentNode = node.parentNode;
  const formContainer = parentNode.lastElementChild;
  if (helpers.isHidden(formContainer)) {
    formContainer.style.display = 'block';
  }
  else {
    formContainer.style.display = 'none';
  }
}

export default function (node) {
  node.addEventListener('click', toggleProfileForm)
}
