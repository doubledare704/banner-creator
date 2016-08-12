import React from 'react';

import {activatePopUp} from '../popUp';


function Banner(props) {
    return (
        <img className="img-responsive" src={props.src}/>
    )
}

export default function(node) {
  node.addEventListener('click', function (e) {
    e.stopPropagation();
    activatePopUp({child: <Banner src={node.dataset.bannerUrl}/>})
  })
}
