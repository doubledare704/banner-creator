//load fabric
let fabric = require('fabric').fabric;

import Editor from './editor.js';


let editor = new Editor('main', 960, 420);

const canvas = editor.canv;
editor.setBackground('http://www.planwallpaper.com/static/images/abstract-background-design.jpg');
//I will clean it in future
//random position for future objects
// function getRandomPos(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
//working ids from template
// const textid = document.getElementById('custom_text');
// const fontsid = document.getElementById('fonts');
// const sizeid = document.getElementById('sizes');
// const fileInput = document.getElementById('input');
const downloadLink = document.getElementById('download');
const showside = document.getElementById('justaddtext');
const addbutton = document.getElementById('addButt');
const backgroundsBtn = document.getElementById('backgroundsBtn');
const addtexts = document.querySelectorAll('#rightcol ul li');
console.log(addtexts);
// const color = document.getElementById('colors');
// const wcanvas = document.getElementById('wcanv'); //width for canvas editor


//initial canvas
// const canvas = new fabric.Canvas('c', {width: 1140, height: 800});
// const inputText = new fabric.IText('Some text', {
//     left: 400,
//     top: 400,
//     textAlign: 'center'
// });
// canvas.add(inputText).renderAll();
// canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
//
// wcanvas.addEventListener('change', function () {
//     let coef = 0.7;
//     canvas.setWidth(this.value);
//     canvas.setHeight(this.value * coef);
//     canvas.calcOffset();
//     iWantThemAll();
// });
//
// color.addEventListener('change', function () {
//     let obj = canvas.getActiveObject();
//     if (obj) {
//         obj.setColor(this.value);
//         canvas.renderAll();
//     }
// });
addbutton.addEventListener('click', function () {
    editor.addButton(5);
});

showside.addEventListener('click', function () {
    let el = document.getElementById('rightcol');
    el.style.display = el.style.display == "block" ? "" : "block";
    // editor.setFont('Roboto', 35, '#000');
});


for (var i = 0; i < addtexts.length; i++) {
    addtexts[i].addEventListener('click', function () {
        let sizes = this.getAttribute("data-size");
        let texting = this.getAttribute("data-text");
        let typings = this.getAttribute("data-type");
        if(typings){
            editor.setPrice('Roboto', sizes, '#000', texting);
        }
        else {
            editor.setFont('Roboto', sizes, '#000', texting);
        }
    });
}
// fileInput.addEventListener('change', (e) => {
//     const url = URL.createObjectURL(e.target.files[0]);
//     fabric.Image.fromURL(url, (img) => {
//         canvas.add(img);
//         fileInput.value = ""
//     });
// });
// textid.addEventListener('keyup', function () {
//     let obj = canvas.getActiveObject();
//     if (obj) {
//         obj.setText(this.value);
//         canvas.renderAll();
//     }
// });
//
// fontsid.addEventListener('change', function () {
//     let obj = canvas.getActiveObject();
//     if (obj) {
//         obj.setFontFamily(this.value);
//         canvas.renderAll();
//     }
// });
//
// sizeid.addEventListener('change', function () {
//     let obj = canvas.getActiveObject();
//     if (obj) {
//         obj.setFontSize(this.value);
//         canvas.renderAll();
//     }
// });
//
const canv = document.getElementById('main');
downloadLink.addEventListener('click', function () {
    const link = this;
    // link.href = editor.getImgData();
    link.href = canv.toDataURL();
    link.download = 'result.jpg';

    // editor.canv.deactivateAll().renderAll();
    // window.open(editor.canv.toDataURL());
    // editor.downloadImage(this);
}, false);
//
// function iWantThemAll() {
//     //adding group
//     let objs = [];
//     //get all the objects into an array
//     objs = canvas._objects.filter(function (obj) {
//         return obj;
//     });
//
//     //group all the objects
//     let alltogetherObj = new fabric.Group(objs, {
//         top: 300, left: 300,
//         originX: 'center',
//         originY: 'center'
//     });
//     //clear previous objects
//     for (let i = 0; i < objs.length; i++) {
//         canvas.remove(objs[i]);
//     }
//
//     canvas.add(alltogetherObj);
//     canvas.renderAll();
//
//     alltogetherObj.destroy();
//     let items = alltogetherObj.getObjects();
//     canvas.remove(alltogetherObj);
//     for (var i = 0; i < items.length; i++) {
//         canvas.add(items[i]);
//     }
//
//     canvas.renderAll();
// }


//check visibility helper
function isHidden(el) {
    const style = window.getComputedStyle(el);
    return (style.display === 'none')
}

backgroundsBtn.addEventListener('click', function () {
    const bgList = document.getElementById('backgroundsList');
    if (!isHidden(bgList)) {
        // If it is visible then just hide it and change section's background color
        bgList.style.display = 'none';
        this.parentNode.style.backgroundColor = 'white';
    }
    else {
        // change section's background color
        this.parentNode.style.backgroundColor = 'grey';
        // if it's not visible then load all the background images from server and append them in a list
        fetch('/api/backgrounds/').then(function (response) {
            response.json().then(function (data) {
                const ulNode = document.getElementById('backgroundsList');
                ulNode.innerHTML = '';
                // iterate over the list of images, create corresponding li nodes for them
                for (const img of data.backgroundImages) {
                    const liNode = document.createElement('li');
                    liNode.innerHTML = `<img src='/uploads/${img.name}'/>`;
                    liNode.addEventListener('click', function () {
                        const imgSrc = this.firstElementChild.getAttribute('src');
                        editor.setBackground(imgSrc);
                    });
                    ulNode.appendChild(liNode);
                }
                bgList.style.display = 'block';
            })
    })}
});
