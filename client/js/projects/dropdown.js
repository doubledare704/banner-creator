// dropdown for base html
function toggleMenu() {
    const menutoggle = document.getElementById('dropmenu');
    menutoggle.classList.toggle('blocker')
}

function dropDown(node) {
    node.addEventListener('click', toggleMenu);
}

module.exports = {
    'dropDown': dropDown
};