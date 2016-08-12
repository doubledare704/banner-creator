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
const allCutted = document.getElementById('from_db');

// loads all cuted backgrounds from db
allCutted.addEventListener('mouseover', function popList() {
    const lister = document.getElementsByClassName('list-cuted');
    fetch('/editor/cut-choose/',
        {
            method: 'get',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
        .then((res) => res.json())
        .then(function ({result}) {
            for (var i = 0; i < result.length; i++) {
                var elem = document.createElement("div");
                elem.innerHTML = "<img class='boxer' src=" + result[i].preview + " href=" + result[i].url + " />";
                lister[0].appendChild(elem);
            }
            allCutted.removeEventListener('mouseover', popList);
            const cut_list = document.querySelectorAll('.list-cuted div img');
            for (let i = 0; i < cut_list.length; i++) {
                cut_list[i].addEventListener('click', function () {
                    let url = this.getAttribute("href");
                    if (url) {
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
                        });
                    }
                });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
});

// save to local storage
beforeCutter.addEventListener('click', function () {
    let bannerStory = editor.canv.toJSON();
    bannerStory = JSON.stringify(bannerStory);
    localStorage.setItem('canvasStory', bannerStory);
    localStorage.setItem('gridSize', document.getElementById('newGrid').value);
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
    const formData = new FormData();
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
            var src = result.src;
            fabric.Image.fromURL(src, (img) => {

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

function resetAll() {
    editor.canv.clear();
    localStorage.clear();
    editor.canv.setBackgroundImage(null, editor.canv.renderAll.bind(editor.canv));
    editor.canv.setWidth(960);
    editor.canv.setHeight(420);
}

function resetCanvas(node) {
    node.addEventListener('click', resetAll);
}

function deleteKeyup(node) {
    node.onload = document.addEventListener('keydown', function (event) {
        var key = event.keyCode || event.charCode;

        if (key == 8 || key == 46) {
            let activeObject = editor.canv.getActiveObject(),
                activeGroup = editor.canv.getActiveGroup();
            editor.deleteObject(activeObject, activeGroup);
            return false;
        }
    }, false);

    //     function () {
    //     var key = event.keyCode || event.charCode;
    //
    //     if (key == 8 || key == 46) {
    //         let activeObject = editor.canv.getActiveObject(),
    //             activeGroup = editor.canv.getActiveGroup();
    //         editor.deleteObject(activeObject, activeGroup);
    //         return false;
    //     }
    // };
}

window.onload = function () {

    if (localStorage['canvasStory']) {
        editor.canv.clear();
        editor.canv.loadFromJSON(localStorage.getItem('canvasStory'), editor.canv.renderAll.bind(editor.canv))
    }
    if (localStorage['file_cuted']) {
        fabric.Image.fromURL(localStorage.getItem('file_cuted'), (img) => {

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
    }
    if (localStorage['gridSize']) {
        editor.setNewGridSize(localStorage.getItem('gridSize'));
        document.getElementById('newGrid').value = localStorage.getItem('gridSize');
    }
};

module.exports = {
    'editor': editor,
    'fabric': fabric,
    'resetCanvas': resetCanvas,
    'deleteKeyup': deleteKeyup
};
