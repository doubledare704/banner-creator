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
const use = document.getElementsByClassName("use");


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
// this is added
function addImg(){
    let myImg = this.id;
    fabric.Image.fromURL(myImg, function(oImg) {
        let l = Math.random() * (500 - 0) + 0;
        let t = Math.random() * (500 - 0) + 0;
           // oImg.scale(0.2);
        oImg.set({'left':l});
                  oImg.set({'top':t});
            canvas.add(oImg);
        });
};
for (let i = 0; i < use.length; i++) {
    use[i].addEventListener('click', addImg, false);
}
// end of added
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
