let canv = document.getElementsByClassName("canvas-container")[0];
let gridButton = document.getElementById("htmlgrid2");
let clicked = false;

let goods = document.createElement("DIV");
let title = document.createElement("DIV");
let price = document.createElement("DIV");

goods.className = "editor-gridhtml gridhtml-footer";
goods.style.cssText = "top: 5.5%; left: 5.5%; height: 62%; width: 89%;";

title.className = "editor-gridhtml gridhtml-footer";
title.style.cssText = "top: 74.5%; left: 5.5%; height: 4%; width: 89%;";

price.className = "editor-gridhtml gridhtml-footer";
price.style.cssText = "top: 82.5%; left: 5.5%; height: 6%; width: 89%;";


let prnt = function (){
    clicked =!clicked;
    if(clicked){
        canv.appendChild(goods);
        canv.appendChild(title);
        canv.appendChild(price);
    }
    else{
        goods.parentNode.removeChild(goods);
        title.parentNode.removeChild(title);
        price.parentNode.removeChild(price);
    }

};

 export default function (){
    gridButton.addEventListener('click', prnt);
}





