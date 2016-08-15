// check whether an element isn't visible on page
export function isHidden(elem) {
    const style = window.getComputedStyle(elem);
    return (style.display === 'none');
}


export function uploadButton(node) {
    node.onclick = (e) => {
        e.preventDefault();
        e.target.nextElementSibling.click();
    };
    const uploadButton = node.nextElementSibling;
    const setLabelText = () =>(uploadButton.labels[0].innerText = uploadButton.files[0].name);
    if (uploadButton.files.length > 0) {
        setLabelText();
    }
    uploadButton.onchange = setLabelText;
}

export function csrfToken () {
    document.querySelector('meta[name=csrf-token]').getAttribute('content');
}
