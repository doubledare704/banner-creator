const resultPreview = document.getElementById('result_review');
const modals = document.getElementById('myModal');
const span = document.getElementsByClassName("close")[0];

//show result
resultPreview.addEventListener('click', () => {
    modals.style.display = "block";
});

//hide result
span.onclick = ()=> {
    modals.style.display = "none";
};
window.onclick = (e) => {
    if (e.target == modals) {
        modals.style.display = "none";
    }
};