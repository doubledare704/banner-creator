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
        this.addCommentCloud = this.addCommentCloud.bind(this);
        this.fileInput = this.fileInput.bind(this);
    }

    componentDidMount() {
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        this.editor = new Editor(canvas, this.props.width, this.props.height);
        this.fileInput();
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

    fileInput(){
        console.log(this.props.imageUrl);
        this.editor.addImage(this.props.imageUrl);
    }

    render() {
        return (<div>
                    <div className="btn btn-default">
                        <i className="glyphicon glyphicon-text-height"/>
                        <span onClick={this.addText}>екст</span>
                    </div>

                    <div className="btn btn-default">
                        <i className="glyphicon glyphicon-arrow-right"/>
                        <span onClick={this.addArrow}>Стрелка</span>
                    </div>

                    <div className="btn btn-default">
                        <i className="glyphicon glyphicon-unchecked"/>
                        <span onClick={this.addRectangle}>Квадрат</span>
                    </div>

                    <div className="btn btn-default">
                        <i className="glyphicon glyphicon-unchecked"/>
                        <span onClick={this.addEllipse}>Елипс</span>
                    </div>

                    <div className="btn btn-default">
                        <i className="glyphicon glyphicon-new-window"/>
                        <span onClick={this.addCommentCloud}>Хмарка</span>
                    </div>

                    <div className="btn btn-default">
                        <i className="glyphicon glyphicon-trash"/>
                        <span onClick={this.deleteObject}>Удали</span>
                    </div>

                    <canvas id="main" ref="canvas"></canvas>

                     <div className="form-group">
                          <label for="comment">Коментарий:</label>
                          <textarea className="form-control" name="comment" rows="5" id="comment"></textarea>
                    </div>

                    <form className="form-inline" action="" method="post">
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
                        <div className="btn btn-success form-group btn-wrapper">
                            <i className="glyphicon glyphicon-envelope"/>
                            <input type="submit" value=" Одправить"  role="button" />
                     </div>
                    </form>


                </div>
        );
    }
}

export default function (node) {
    const { imageUrl } = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <EditorWindow width={910} height={500} imageUrl={imageUrl} />,
        node
    );
}
