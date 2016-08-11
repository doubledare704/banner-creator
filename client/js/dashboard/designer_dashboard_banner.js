import React from 'react';

import {activatePopUp} from '../popUp';


function MegaImg(props) {
    return (
        <img className="img-responsive" src={props.src}/>
    )
}

export default function(node) {
  node.addEventListener('click', function (e) {
    e.stopPropagation();
    activatePopUp({child: <MegaImg src={node.dataset.bannerUrl}/>})
  })
}
