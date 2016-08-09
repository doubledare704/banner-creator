import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'body';


class ImageSlider extends React.Component{
    constructor(){
        super();
        
    }
    render(){
        return(
            <div></div>
        )
    }
}

export default function(node){
    const { imageArray } = h.getAttrs(BAZOOKA_PREFIX, node);
    ReactDOM.render(
        <ImageSlider />,
        node
    )
}