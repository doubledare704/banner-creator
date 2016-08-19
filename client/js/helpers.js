import React from 'react';

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

    const setLabelText = () => {
        const label = document.querySelector('input.upload[type="file"]+label');
        uploadButton.files.length === 1 ? label.innerText = uploadButton.files[0].name :
            label.innerText = `Выбрано файлов: ${uploadButton.files.length}`;
    };

    if (uploadButton.files.length > 0) {
        setLabelText();
    }
    uploadButton.onchange = setLabelText;
}

export function csrfToken() {
    return document.querySelector('meta[name=csrf-token]').getAttribute('content');
}

export function SuccessAlert(props) {
    return (
      <p className="alert alert-success">
          {props.text}
      </p>
)}

export function ErrorAlert(props) {
    return (
      <p className="alert alert-danger">
          {props.text}
      </p>
)}
