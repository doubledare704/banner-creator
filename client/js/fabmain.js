let fabric = require('fabric').fabric;

const canvas = new fabric.Canvas('c', {width: 1140, height: 800});
const fileInput = document.getElementById('input');
const downloadLink = document.getElementById('download');

fileInput.addEventListener('change', (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    fabric.Image.fromURL(url, (img) => {
        canvas.add(img);
        fileInput.value = ""
    });
});


downloadLink.addEventListener('click', function() {
    const link = this;
    link.href = canvas.toDataURL();
    link.download = 'result.jpg';
}, false);