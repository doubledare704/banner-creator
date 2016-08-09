import * as helpers from '../helpers';

function toggleComment(e){
    const node = e.target;
    const parentNode = node.parentNode;
    const comentContainer = parentNode.lastElementChild;
    if(helpers.isHidden(comentContainer)){
        comentContainer.stile.display = 'block';
    }
    else {
        comentContainer.style.display = 'none';
    }
}

export default function (node) {
    node.addEndEventListener('click', toggleComment)
}
