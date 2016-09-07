let canv = document.getElementsByClassName("canvas-container")[0];
let gridButton1 = document.getElementById("htmlgrid1");
let clicked1 = false;

let logo1 = document.createElement("DIV");
let title1 = document.createElement("DIV");
let price1 = document.createElement("DIV");
let goods1 = document.createElement("DIV");
let button1 = document.createElement("DIV");

logo1.className = "editor-gridhtml gridhtml-footer";
logo1.style.cssText = "top: 9%; left: 18%; height: 20%; width: 14%;";

title1.className = "editor-gridhtml gridhtml-footer";
title1.style.cssText = "top: 35.5%; left: 5.5%; height: 15%; width: 42%;";

price1.className = "editor-gridhtml gridhtml-footer";
price1.style.cssText = "top: 55.5%; left: 5.5%; height: 6%; width: 42%;";

goods1.className = "editor-gridhtml gridhtml-footer";
goods1.style.cssText = "top: 10.5%; left: 50%; height: 78%; width: 44%;";

button1.className = "editor-gridhtml gridhtml-footer";
button1.style.cssText = "top: 72.5%;  left: 5.5%; height: 14%; width: 42%;";

let prnt1 = function (){
    console.log("CLICKED");
    clicked1 =!clicked1;
    if(clicked1){
        canv.appendChild(logo1);
        canv.appendChild(title1);
        canv.appendChild(price1);
        canv.appendChild(goods1);
        canv.appendChild(button1);
    }
    else{
        logo1.parentNode.removeChild(logo1);
        title1.parentNode.removeChild(title1);
        price1.parentNode.removeChild(price1);
        goods1.parentNode.removeChild(goods1);
        button1.parentNode.removeChild(button1);
    }

};

 export default function (){
    gridButton1.addEventListener('click', prnt1);
}





