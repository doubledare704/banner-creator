
function printPonter(e){
    let node = e.target;
    let img_id = node.id;
    let X = e.clientX;
    let Y = e.clientY;
    let sX = e.screenX;
    let sY = e.screenY;
    let coordsCl = "clien - X: " + X + ", Y coords: " + Y;
    let coordsSc = "screen - sX: " + sX + ", sY coords: " + sY;
    console.log(coordsCl, coordsSc, 'img id:',img_id);
    let commentInput = document.createElement("TEXTAREA");
    commentInput.style.cssText = `left: ${X}px; top: ${Y}px; position: absolute; font-family: Arial, sans-serif; font-size: 13px;text-align: left;line-height: 120%;`;
    let textComment =  document.createTextNode("comment");
    commentInput.appendChild(textComment);
    node.parentNode.appendChild(commentInput);
}

export default function (node) {
    node.addEventListener('click', printPonter)
    
}