import {editor} from './fabmain.js';

const backgroundsBtn = document.getElementById('backgroundsBtn');
const backgroundsList = document.getElementById('backgroundsList');
const backgroundImagesLoader = makeBackgroundImagesLoader();

// check visibility helper
function isHidden(el) {
    const style = window.getComputedStyle(el);
    return (style.display === 'none')
}

// synchronous loader for making requests and tracking page numbers
function makeBackgroundImagesLoader() {
    let page = 1;
    let blocked = false;
    return function () {
        if (!blocked) {
            blocked = true;
            fetch(`/api/backgrounds/${page}`).then(function (response) {
                if (response.status == 200) {
                    response.json().then(function (data) {
                        populateBackgroundsList(data.backgroundImages);
                        backgroundsList.style.display = 'block';
                        page += 1;
                        blocked = false;
                        })
                }
                else {
                    backgroundsList.style.display = 'block';
                    blocked = false;
                }
            })
        }}
}

function populateBackgroundsList(images) {
    // creates appropriate liNodes with an images inside and appends them to the list
    for (const img of images) {
        const liNode = document.createElement('li');
        liNode.innerHTML = `<img src='/uploads/${img.preview}' origin-src="/uploads/${img.name}"/>`;
        liNode.setAttribute('data-bazooka', 'setBackground');
        backgroundsList.appendChild(liNode);
    }
}

function loadBackgroundImages() {
    if (!isHidden(backgroundsList)) {
        // if it is visible then just hide it and change section's background color
        backgroundsList.style.display = 'none';
        this.parentNode.style.backgroundColor = 'white';
    }
    else {
        // change section's background color
        this.parentNode.style.backgroundColor = 'grey';
        // if it's not visible then load images
        backgroundImagesLoader();
}}

function setBackground() {
    // sets image as a background on the canvas
    const imgSrc = this.firstElementChild.getAttribute('origin-src');
    editor.setBackground(imgSrc);
}

function loadImagesOnScroll() {
    // loads images if a bottom of the list is reached
    if (backgroundsList.scrollTop == (backgroundsList.scrollHeight - backgroundsList.offsetHeight)) {
        backgroundImagesLoader();
    }
}

// bazooka
function openBackgroundsList(node) {
    node.addEventListener('click', loadBackgroundImages);
}

function loadBackgroundImagesOnScroll(node) {
    node.addEventListener('scroll', loadImagesOnScroll)
}

function setBackgroundOnClick(node) {
    node.addEventListener('click', setBackground)
}


module.exports = {'openBackgroundsList': openBackgroundsList,
                  'setBackground': setBackgroundOnClick,
                  'loadBackgroundImages': loadBackgroundImagesOnScroll
};
