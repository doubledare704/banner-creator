//load fabric
let fabric = require('fabric').fabric;

import Editor from './editor.js';
import {disableControls} from './editor.js';

let editor = new Editor('main', 960, 420);

const fileInput = document.getElementById('input');
const downloadLink = document.getElementById('download');
const addbutton = document.getElementById('addButt');
const addtexts = document.querySelectorAll('#rightcol ul li');
const filetoeditor = document.getElementById('inputted');
const deleteFabricItem = document.getElementById('del_item');

// deletes custom object from canvas
deleteFabricItem.addEventListener('click', function () {
    let activeObject = editor.canv.getActiveObject(),
        activeGroup = editor.canv.getActiveGroup();
    editor.deleteObject(activeObject, activeGroup);
});

addbutton.addEventListener('click', function () {
    editor.addButton();
});

for (var i = 0; i < addtexts.length; i++) {
    addtexts[i].addEventListener('click', function () {
        let sizes = this.getAttribute("data-size");
        let texting = this.getAttribute("data-text");
        let typings = this.getAttribute("data-type");
        if (typings) {
            editor.setPrice('Roboto', sizes, '#000', texting);
        }
        else {
            editor.setFont('Roboto', sizes, '#000', texting);
        }
    });
}

fileInput.addEventListener('click', function () {
    document.getElementById('inputted').click();
    return false;
});

filetoeditor.addEventListener('change', (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    fabric.Image.fromURL(url, (img) => {

        let originalsize = img.getOriginalSize();
        let imgratio = img.width / img.height;
        let newsize = [editor.canv.width * 0.5, editor.canv.width * 0.5 / imgratio];

        if (originalsize.width > editor.canv.width || originalsize.height > editor.canv.height) {
            img.set({
                width: newsize[0],
                height: newsize[1]
            })
        }
        editor.canv.add(img);
        filetoeditor.value = ""
    });
});

downloadLink.addEventListener('click', function () {
    const link = this;
    let activeObject = editor.canv.getActiveObject(),
        activeGroup = editor.canv.getActiveGroup();
    editor.downloadImage(link, activeObject, activeGroup);
}, false);

module.exports = {
    'editor': editor,
    'fabric': fabric
};
