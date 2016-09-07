let canv = document.getElementsByClassName("canvas-container")[0];
let gridButton = document.getElementById("htmlgrid");
let clicked = false;

let beforeHeader = document.createElement("DIV");
let afterHeader = document.createElement("DIV");
let firstBlock = document.createElement("DIV");
let secondBlock = document.createElement("DIV");
let thirdBlock = document.createElement("DIV");
let afterBlock = document.createElement("DIV");
let betweenHeader = document.createElement("DIV");
let afterPrice = document.createElement("DIV");
let afterButton = document.createElement("DIV");

beforeHeader.className = "editor-gridhtml gridhtml-dash";
beforeHeader.style.cssText = "left: 5.5%; height: 9.1%; width: 88.7%";

afterHeader.className = "editor-gridhtml gridhtml-afterheader";
afterHeader.style.cssText = "top: 14.2%; left: 5.5%; height: 7.2%; width: 88.7%;";

firstBlock.className = "editor-gridhtml gridhtml-dash";
secondBlock.className = "editor-gridhtml gridhtml-dash";
thirdBlock.className = "editor-gridhtml gridhtml-dash";

firstBlock.style.cssText = "top: 21%; left: 5.5%; height: 47.6%; width: 29.7%;";
secondBlock.style.cssText = "top: 21%; left: 35%; height: 47.6%; width: 29.7%;";
thirdBlock.style.cssText = "top: 21%; left: 64.5%; height: 47.6%; width: 29.7%;";

afterBlock.className = "editor-gridhtml gridhtml-dash";
afterBlock.style.cssText = "top: 68.5%;  left: 5.5%; height: 4.7%; width: 88.7%;";

betweenHeader.className = "editor-gridhtml gridhtml-afterheader";
afterPrice.className = "editor-gridhtml gridhtml-afterheader";
afterButton.className = "editor-gridhtml gridhtml-afterheader";
betweenHeader.style.cssText = "top: 75.9%;  left: 10%; height: 2.4%; width: 81.3%;";
afterPrice.style.cssText = "top: 83%;  left: 5.5%; height: 4.7%; width: 88.7%;";
afterButton.style.cssText = "top: 95%;  left: 5.5%; height: 4.7%; width: 88.7%;";

let prnt = function (){
    clicked =!clicked;
    if(clicked){
        canv.appendChild(beforeHeader);
        canv.appendChild(afterHeader);
        canv.appendChild(firstBlock);
        canv.appendChild(secondBlock);
        canv.appendChild(thirdBlock);
        canv.appendChild(afterBlock);
        canv.appendChild(betweenHeader);
        canv.appendChild(afterPrice);
        canv.appendChild(afterButton);
    }
    else{
        beforeHeader.parentNode.removeChild(beforeHeader);
        afterHeader.parentNode.removeChild(afterHeader);
        firstBlock.parentNode.removeChild(firstBlock);
        secondBlock.parentNode.removeChild(secondBlock);
        thirdBlock.parentNode.removeChild(thirdBlock);
        afterBlock.parentNode.removeChild(afterBlock);
        betweenHeader.parentNode.removeChild(betweenHeader);
        afterPrice.parentNode.removeChild(afterPrice);
        afterButton.parentNode.removeChild(afterButton);
    }

};

 export default function (){
    gridButton.addEventListener('click', prnt);
}





