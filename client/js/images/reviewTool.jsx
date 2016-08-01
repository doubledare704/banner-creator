import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import Editor from '../editor/editor.js';

const BAZOOKA_PREFIX = 'body';

class EditorWindow extends React.Component {
    constructor(props){
        super(props);
        this.state={
            text: "Пиши сюда"
        };
        this.addText = this.addText.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
        this.addArrow = this.addArrow.bind(this);
        this.addRectangle = this.addRectangle.bind(this);
        this.addEllipse = this.addEllipse.bind(this);
        this.addCommentCloud = this.addCommentCloud.bind(this);
        this.onInput = this.onInput.bind(this);
        this.fileInput = this.fileInput.bind(this);
        this.getMouseCoords = this.getMouseCoords.bind(this);
    }

    componentDidMount() {
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        this.editor = new Editor(canvas, this.props.width, this.props.height);
    }

    addText() {
        this.editor.setFont('Roboto', 36, "red", "Пиши сюда");
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

    addCommentCloud(){
        this.editor.addCommentCloud( "Пиши сюда");
    }

    onInput(event){
        //this.setState({text: event.target.value});
        this.editor.setTextInItext(event.target.value);
    }

    fileInput(){
        console.log('clicke');
        this.editor.addImage('http://127.0.0.1:5000/uploads/5644682c54c611e694b5507b9dfbe65a.jpg');
    }
    getMouseCoords(event) {
      var pointer = this.editor.canv.getPointer(event.e);
      var posX = pointer.x;
      var posY = pointer.y;
      console.log(posX+", "+posY);    // Log to console
    }

    render() {
        return (<div>
                    <div className="btn btn-primary">
                        <i className="glyphicon glyphicon-text-height"/>
                        <span onClick={this.addText}>екст</span>
                    </div>

                    <div className="btn btn-primary">
                        <i className="glyphicon glyphicon-arrow-right"/>
                        <span onClick={this.addArrow}>Стрелка</span>
                    </div>

                    <div className="btn btn-primary">
                        <i className="glyphicon glyphicon-unchecked"/>
                        <span onClick={this.addRectangle}>Квадрат</span>
                    </div>

                    <div className="btn btn-primary">
                        <i className="glyphicon glyphicon-unchecked"/>
                        <span onClick={this.addEllipse}>Елипс</span>
                    </div>

                    <div className="btn btn-primary">
                        <i className="glyphicon glyphicon-new-window"/>
                        <span onClick={this.addCommentCloud}>Хмарка</span>
                    </div>

                    <div className="btn btn-default">
                        <span onClick={this.fileInput}>File Input</span>
                    </div>

                    <div className="btn btn-default">
                        <span onClick={this.getMouseCoords}>coords</span>
                    </div>

                    <div className="btn btn-danger">
                        <i className="glyphicon glyphicon-trash"/>
                        <span onClick={this.deleteObject}>Удали</span>
                    </div>

                    <canvas id="main" ref="canvas"></canvas>

                     <div className="form-group">
                          <label for="comment">Коментарий:</label>
                          <textarea className="form-control" rows="5" id="comment"></textarea>
                    </div>

                    <form className="form-inline">
                       <div className="form-group">
                            <span className="btn-wrapper" >
                                ПЛОХО: <input type="radio" name="status" value="bad"/>
                            </span>
                        </div>
                        <div className="form-group">
                            <span className="btn-wrapper" >
                                ХОРШО: <input type="radio" name="status" value="good"/>
                            </span>
                        </div>
                    </form>

                    <div className="btn btn-success form-group btn-wrapper">
                            <i className="glyphicon glyphicon-envelope"/>
                            <span>  одправить</span>
                     </div>
                </div>
        );
    }
}

export default function (node) {
    const { imageArray } = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <EditorWindow width={910} height={500} />,
        node
    );
}
