//load fabric
let fabric = require('fabric').fabric;

import Editor from './editor.js';


let editor = new Editor('main', 960, 420);

const fileInput = document.getElementById('input');
const downloadLink = document.getElementById('download');
const addbutton = document.getElementById('addButt');
const backgroundsBtn = document.getElementById('backgroundsBtn');
const addtexts = document.querySelectorAll('#rightcol ul li');
const filetoeditor = document.getElementById('inputted');
const deleteFabricItem = document.getElementById('del_item');


//deletes custom object from canvas
deleteFabricItem.addEventListener('click', function () {
    let activeObject = editor.canv.getActiveObject(),
        activeGroup = editor.canv.getActiveGroup();
    editor.deleteObject(activeObject, activeGroup);
});


addbutton.addEventListener('click', function () {
    editor.addButton(5);
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
        console.log(imgratio);

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
    editor.downloadImage(link);
}, false);

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

