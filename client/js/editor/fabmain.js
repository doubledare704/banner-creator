//load fabric
let fabric = require('fabric').fabric;

import Editor from './editor.js';

let editor = new Editor('main', 960, 420);

const fileInput = document.getElementById('input');
const downloadLink = document.getElementById('download');
const addbutton = document.getElementById('addButt');
const addtexts = document.querySelectorAll('#rightcol ul li');
const filetoeditor = document.getElementById('inputted');
const deleteFabricItem = document.getElementById('del_item');
const beforeCutter = document.getElementById('cutters');


// save to local storage
beforeCutter.addEventListener('click', function () {
    let bannerStory = editor.canv.toJSON();
    bannerStory = JSON.stringify(bannerStory);
    console.log(bannerStory);
    localStorage.setItem('canvasStory', bannerStory);
});

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

filetoeditor.addEventListener('change', () => {
    event.preventDefault();
    const formData = new FormData(document.getElementById('upload-file')[0]);
    formData.append('file', filetoeditor.files[0]);
    fetch('/editor/local/',
        {
            method: 'POST',
            credentials: 'same-origin',
            body: formData
        }
    )
        .then((res) => res.json())
        .then(function ({result}) {
            console.log(result);
            var src = result.src;
            fabric.Image.fromURL(src, (img) => {

                let originalsize = img.getOriginalSize();
                console.log(originalsize);
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
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
});

downloadLink.addEventListener('click', function () {
    const link = this;
    let activeObject = editor.canv.getActiveObject(),
        activeGroup = editor.canv.getActiveGroup();
    editor.downloadImage(link, activeObject, activeGroup);
}, false);

window.onload = function () {

    if (localStorage['canvasStory']) {
        editor.canv.clear();
        editor.canv.loadFromJSON(localStorage.getItem('canvasStory'), editor.canv.renderAll.bind(editor.canv))
        console.log(localStorage.getItem('canvasStory'))
    }
    if (localStorage['file_cuted']) {
        console.log(localStorage.getItem('file_cuted'));
        fabric.Image.fromURL(localStorage.getItem('file_cuted'), (img) => {

            let originalsize = img.getOriginalSize();
            console.log(originalsize);
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
    }
};

module.exports = {
    'editor': editor,
    'fabric': fabric
};
