//load fabric
let fabric = require('fabric').fabric;

//working ids from template
const textid = document.getElementById('custom_text');
const fontsid = document.getElementById('fonts');
const sizeid = document.getElementById('sizes');
const fileInput = document.getElementById('input');
const downloadLink = document.getElementById('download');

//initial canvas
const canvas = new fabric.Canvas('c', {width: 1140, height: 800});
const inputText = new fabric.IText('Some text', {
    left: 400,
    top: 400,
    textAlign: 'center'
});
canvas.add(inputText).renderAll();
canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));

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
