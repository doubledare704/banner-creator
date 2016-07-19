import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'header';


export default function (node) {
    let {id} = h.getAttrs(BAZOOKA_PREFIX, node);
    console.log(h.getAttrs(BAZOOKA_PREFIX, node));
    console.log(id[0].id, id[1].name);
    var RenderImages = React.createClass({
        render: function() {
            return (
                <img src={id[0].preview}/>
            );
        }
    });
    ReactDOM.render(
        <RenderImages />,
        node
    );
}