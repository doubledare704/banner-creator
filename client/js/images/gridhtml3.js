let canv = document.getElementsByClassName("canvas-container")[0];
let gridButton = document.getElementById("htmlgrid3");
let clicked = false;

let goods = document.createElement("DIV");
let discount = document.createElement("DIV");
let title = document.createElement("DIV");
let price = document.createElement("DIV");

discount.className = "editor-gridhtml gridhtml-footer";
discount.style.cssText = "top: 4%; left: 50%; height: 21%; width: 44%;";

goods.className = "editor-gridhtml gridhtml-footer";
goods.style.cssText = "top: 14%; left: 5.5%; height: 55%; width: 89%;";

title.className = "editor-gridhtml gridhtml-footer";
title.style.cssText = "top: 77%; left: 5.5%; height: 4%; width: 89%;";

price.className = "editor-gridhtml gridhtml-footer";
price.style.cssText = "top: 85%; left: 5.5%; height: 6%; width: 89%;";


let prnt = function (){
    clicked =!clicked;
    if(clicked){
        canv.appendChild(goods);
        canv.appendChild(discount);
        canv.appendChild(title);
        canv.appendChild(price);
    }
    else{
        goods.parentNode.removeChild(goods);
        discount.parentNode.removeChild(discount);
        title.parentNode.removeChild(title);
        price.parentNode.removeChild(price);
    }

};

 export default function (){
    gridButton.addEventListener('click', prnt);
}





