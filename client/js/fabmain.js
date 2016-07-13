//load fabric
let fabric = require('fabric').fabric;


//random position for future objects
function getRandomPos(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//working ids from template
const textid = document.getElementById('custom_text');
const fontsid = document.getElementById('fonts');
const sizeid = document.getElementById('sizes');
const fileInput = document.getElementById('input');
const downloadLink = document.getElementById('download');
const addtext = document.getElementById('justaddtext');
const color = document.getElementById('colors');
const wcanvas = document.getElementById('wcanv'); //width for canvas editor


//initial canvas
const canvas = new fabric.Canvas('c', {width: 1140, height: 800});
const inputText = new fabric.IText('Some text', {
    left: 400,
    top: 400,
    textAlign: 'center'
});
canvas.add(inputText).renderAll();
canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));

wcanvas.addEventListener('change', function () {
    let coef = 0.7;
    canvas.setWidth(this.value);
    canvas.setHeight(this.value * coef);
    canvas.calcOffset();
    iWantThemAll();
});

color.addEventListener('change', function () {
    let obj = canvas.getActiveObject();
    if (obj) {
        obj.setColor(this.value);
        canvas.renderAll();
    }
});
addtext.addEventListener('click', function () {
    let object = new fabric.IText("NEW TEXT", {
        fontFamily: "Arial",
        left: getRandomPos(500, 700),
        top: getRandomPos(300, 400),
        fontSize: 24,
        textAlign: "left",
        fill: "#000000"
    });
    canvas.add(object);
    canvas.renderAll();
});
fileInput.addEventListener('change', (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    fabric.Image.fromURL(url, (img) => {
        canvas.add(img);
        fileInput.value = ""
    });
});
textid.addEventListener('keyup', function () {
    let obj = canvas.getActiveObject();
    if (obj) {
        obj.setText(this.value);
        canvas.renderAll();
    }
});

fontsid.addEventListener('change', function () {
    let obj = canvas.getActiveObject();
    if (obj) {
        obj.setFontFamily(this.value);
        canvas.renderAll();
    }
});

sizeid.addEventListener('change', function () {
    let obj = canvas.getActiveObject();
    if (obj) {
        obj.setFontSize(this.value);
        canvas.renderAll();
    }
});

downloadLink.addEventListener('click', function () {
    const link = this;
    link.href = canvas.toDataURL();
    link.download = 'result.jpg';
}, false);

function iWantThemAll() {
    //adding group
    let objs = [];
    //get all the objects into an array
    objs = canvas._objects.filter(function (obj) {
        return obj;
    });

    //group all the objects
    let alltogetherObj = new fabric.Group(objs, {
        top: 300, left: 300,
        originX: 'center',
        originY: 'center'
    });
    //clear previous objects
    for (let i = 0; i < objs.length; i++) {
        canvas.remove(objs[i]);
    }

    canvas.add(alltogetherObj);
    canvas.renderAll();

    alltogetherObj.destroy();
    let items = alltogetherObj.getObjects();
    canvas.remove(alltogetherObj);
    for (var i = 0; i < items.length; i++) {
        canvas.add(items[i]);
    }

    canvas.renderAll();
}
