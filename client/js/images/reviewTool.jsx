import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import Editor from '../editor/editor.js';

const BAZOOKA_PREFIX = 'body';
const fabric = require('fabric').fabric;



class EditorWindow extends React.Component {
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        this._editor = new Editor(canvas, this.props.width, this.props.height);
    }

    addText() {
        this._editor.setFont('Roboto',16, "#000","text");
    }
    
    render() {
        return (<div>
                <div className="btn btn-default">
                    <i className="glyphicon glyphicon-pencil"/>
                    <span onClick={this.addText}>Text</span>
                </div>
                <canvas id="main" ref="canvas"></canvas>
            </div>

        );
    }
}

export default function (node) {
    const { imageArray } = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <EditorWindow width={960} height={500} />,
        node
    );
}