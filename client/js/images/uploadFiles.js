import React from 'react';
import {csrfToken} from '../helpers';
import {activatePopUp} from '../popUp.js';

function uploadFiles (){
    let filesInpt = document.getElementById('image-form');
    let form = new FormData(filesInpt);
    let files = document.getElementById('input');
    let x, y=0;
    let all = files.files.length;
    let progr = document.createElement("DIV");
    progr.className ="progress-bar progress-bar-striped";
    progr.role = "progressbar";

    let bar = document.getElementById("demo");
    bar.className="progress";
    bar.appendChild(progr);

    for(let i = 0; i<files.files.length; i++){

        form.delete('file');
        form.append('file', files.files[i]);
        fetch("/upload",{
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'X-CSRFToken': csrfToken()
        },
        body: form
    }).then(response => {
            if(response.status === 400){
                    activatePopUp({title: <h4 className="text-center"> Нет файла: {response.status} {response.statusText}  </h4>});
                    return response.status;
                }
            if (!response.ok) {
                activatePopUp({
                    title: <h4 className="text-center">Что-то не так, ошибка: {response.status} {response.statusText} </h4>
                });
                return response.status;
            }
            x=((i+1)/all)*100;
            progr.style.cssText = `width: ${x}%;`;
            progr.innerHTML = `${i+1} из ${all} Загружено`;
            y++;
            if(y===all){
                console.log(y);
                activatePopUp({child: <h4 className="text-center">Загружено {y} из {all} файлов </h4> ,
                    confirm: true,
                    confirmAction: () => {files.value = ""; progr.style.cssText = `width: 0%;`;}
                });

            }
        })

    }
}

export default function (node) {
    node.addEventListener('click', e => {
         e.preventDefault();
        uploadFiles();
     })
}