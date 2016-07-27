import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import Editor from '../editor/editor.js';

const BAZOOKA_PREFIX = 'body';

class EditorWindow extends React.Component {
    constructor(props){
        super(props);
        this.addText = this.addText.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
        this.addArrow = this.addArrow.bind(this);
        this.addRectangle = this.addRectangle.bind(this);
        this.addEllipse = this.addEllipse.bind(this);
    }

    componentDidMount() {
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        this.editor = new Editor(canvas, this.props.width, this.props.height);
    }

    addText() {
        this.editor.setFont('Roboto',36, "red","Пиши сюда");
    }

    deleteObject() {
         let activeObject = this.editor.canv.getActiveObject(),
             activeGroup = this.editor.canv.getActiveGroup();
        this.editor.deleteObject(activeObject, activeGroup);
    }

    addArrow() {
        this.editor.addArrow();
    }

    addRectangle() {
        this.editor.addRectangle();
    }

    addEllipse() {
        this.editor.addEllipse();
    }

    render() {
        return (<div>
                <div className="btn btn-primary">
                    <i className="glyphicon glyphicon-text-height"/>
                    <span onClick={this.addText}>екст</span>
                </div>
                <div className="btn btn-primary">
                    <i className="glyphicon glyphicon-arrow-right"/>
                    <span onClick={this.addArrow}>стрілка</span>
                </div>
                <div className="btn btn-primary">
                    <i className="glyphicon glyphicon-unchecked"/>
                    <span onClick={this.addRectangle}>квадрат</span>
                </div>
                <div className="btn btn-primary">
                    <i className="glyphicon glyphicon-unchecked"/>
                    <span onClick={this.addEllipse}>еліпс</span>
                </div>
                <div className="btn btn-danger">
                    <i className="glyphicon glyphicon-trash"/>
                    <span onClick={this.deleteObject}>видали</span>
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
