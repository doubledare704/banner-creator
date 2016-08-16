import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import Editor from '../editor/editor.js';
import {disableControls} from '../editor/editor.js';
import {activatePopUp} from '../popUp.js';

const BAZOOKA_PREFIX = 'body';

class EditorWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            countComment:0,
            commentOn: true,
            commentsArr: []
        };
        this.addText = this.addText.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
        this.addArrow = this.addArrow.bind(this);
        this.addRectangle = this.addRectangle.bind(this);
        this.addEllipse = this.addEllipse.bind(this);
        this.fileInput = this.fileInput.bind(this);
        this.sendToReview = this.sendToReview.bind(this);
        this.addDot = this.addDot.bind(this);
        this.accepted = this.accepted.bind(this);
        this.notAccepted = this.notAccepted.bind(this);
        this.clickComment = this.clickComment.bind(this);
        this.getComments = this.getComments.bind(this);
    }

    componentDidMount() {
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        this.editor = new Editor(canvas, this.props.width, this.props.height);
        this.fileInput();
    }

    addText() {
        this.editor.setFont("Roboto", 28, "#000", "...замечание", "#ff9900", 0.6);
        this.editor.addDot();
    }

    addDot() {
        this.editor.addDot();
        this.setState({commentOn: !this.state.commentOn});
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

    fileInput() {
        this.editor.setBackground(this.props.imageUrl);
    }

    sendToReview(status, commentClouds){
        const img_id = this.props.imageId;
        const comment = this.refs.comment.value;
        let canvas = this.editor.canv;
        let objs = canvas.getObjects();
        this.editor.filterAndDelete(objs);
        let activeObject = this.editor.canv.getActiveObject(),
            activeGroup = this.editor.canv.getActiveGroup();
        disableControls(activeObject, activeGroup);
        const formData = new FormData();
        let imageReview = this.editor.canv.toJSON();
        formData.append('id', img_id);
        formData.append('status', status);
        formData.append('comment', comment);
        formData.append('commentClouds', commentClouds);
        // append image as base64 string
        formData.append('file', this.editor.canv.toDataURL("image/png", 1.0));
        formData.append('file_json', JSON.stringify(imageReview));
        fetch("/review_action/",
            {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            }
        ).then(response => {
            if (!response.ok) {
                activatePopUp({
                    title: <p>Что-то не так, ошибка: {response.status} </p>
                });
                return response.status;
            }
            activatePopUp({
                title: <h3 className="text-center">"Отправлено, перейти обратно в кабинет ?" </h3>,
                confirm: true,
                confirmAction: () => window.location.href = "/"
            });

        })
    }

    clickComment(event){
        if(!this.state.commentOn){
            console.log("NOOOOO!");
            event.stopPropagation();
            return ''
        }
        let node = event.target;
        let commentParentDiv=node.parentNode.parentNode;
        let X = ((event.clientX-node.getBoundingClientRect().left)/960)*100;
        let Y = ((event.clientY-node.getBoundingClientRect().top)/420)*100;
        let commentDiv = document.createElement("DIV");
        commentDiv.style.cssText = `left: ${X}%; top: ${Y}%; position: absolute;`;

        let commentInput = document.createElement("TEXTAREA");
        commentInput.name = `comment${this.state.countComment}`;
        commentInput.style.cssText = 'margin-left: 15px; margin-top: -5px; color: #fff; background-color: rgba(113,113,113,0.7); height: 100%;';
        //commentInput.placeholder = "Прокоментировать";

        let icon = document.createElement("IMG");
        icon.src = this.props.pointerUrl;
        icon.style.cssText = "position: absolute; left: 1%; top: 1%; height: 20px; width: 20px;";

        let close = document.createElement("DIV");
        close.className = "glyphicon glyphicon-remove";
        close.addEventListener('click', e => e.target.parentNode.parentNode.removeChild(e.target.parentNode));

        commentDiv.appendChild(icon);
        commentDiv.appendChild(document.createElement("BR"));
        commentDiv.appendChild(commentInput);
        commentDiv.appendChild(close);
        commentDiv.addEventListener('click', e => e.stopPropagation());
        commentParentDiv.appendChild(commentDiv);
        // this.setState(
        //     {
        //         commentsArr: this.state.commentsArr.push(
        //             {
        //                 'id': this.state.countComment,
        //                 'style':
        //                 {
        //                     'left': X,
        //                     'top': Y,
        //                     'position': "absolute",
        //                     'margin-left': "15px",
        //                     'margin-top': "-5px",
        //                     'color': "#fff",
        //                     'background-color': "rgba(113,113,113,0.7)",
        //                     'height': "100%"
        //                 }
        //             }
        //         )
        //     });
        this.setState({countComment: this.state.countComment+1});
        console.log(this.props.pointerUrl);
    }
    
    getComments(){
        let commentsArray = document.getElementsByTagName("TEXTAREA");
        //console.log(commentsArray);
        let commentClouds = [];
        if(commentsArray.length > 1) {
            for (let i = 0; i < commentsArray.length - 1; i++) {
                commentClouds.push(
                {
                    id: i,
                    name: commentsArray[i].name,
                    text: commentsArray[i].value,
                    style: commentsArray[i].attributes[1].value
                });
            }
        }
        return JSON.stringify(commentClouds)
    }

    accepted(){
        const status = "accepted";
        this.sendToReview(status, this.getComments());

    }

    notAccepted(){
        const status = "not_accepted";
        //this.getComments();
        this.sendToReview(status, this.getComments());

    }

    render() {
        return (<div>
                    <div onClick={this.clickComment} className="comment-wrapper">
                        <canvas id="main" ref="canvas"></canvas>
                    </div>

                    <div className="btn btn-default btn-wrapper">
                        <i className="glyphicon glyphicon-text-height"/>
                        <span onClick={this.addText}>екст</span>
                    </div>

                    <div className="btn btn-default btn-wrapper">
                        <i className="glyphicon glyphicon-certificate"/>
                        <span onClick={this.addDot}> Точка</span>
                    </div>

                    <div className="btn btn-default btn-wrapper">
                        <i className="glyphicon glyphicon-arrow-right"/>
                        <span onClick={this.addArrow}>Стрелка</span>
                    </div>

                    <div className="btn btn-default btn-wrapper">
                        <i className="glyphicon glyphicon-unchecked"/>
                        <span onClick={this.addRectangle}>Прямоуголник</span>
                    </div>

                    <div className="btn btn-default btn-wrapper">
                        <i className="glyphicon glyphicon-unchecked"/>
                        <span onClick={this.addEllipse}>Елипс</span>
                    </div>

                    <div className="btn btn-danger btn-wrapper">
                        <i className="glyphicon glyphicon-trash"/>
                        <span onClick={this.deleteObject}>Удали</span>
                    </div>

                    <div className="col-lg-10">
                         <div className="form-group">
                          <label for="comment">Коментарий:</label>
                          <textarea className="form-control" ref="comment" name="main_comment" rows="5" id="comment"></textarea>
                        </div>
                        <form className="form-inline" action="" method="post">

                            <div className="btn btn-danger form-group btn-wrapper">
                                <i className="glyphicon glyphicon-remove"/>
                                <span onClick={this.notAccepted}> Не Принят</span>
                            </div>

                            <div className="btn btn-success form-group btn-wrapper">
                                <i className="glyphicon glyphicon-ok"/>
                                <span onClick={this.accepted}> Принят</span>
                            </div>
                        </form>
                    </div>


            </div>
        );
    }
}

export default function (node) {
    const { imageUrl, imageId, pointerUrl } = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <EditorWindow
            width = {960}
            height = {420}
            imageUrl = {imageUrl}
            imageId = {imageId}
            pointerUrl = {pointerUrl}
        />,
        node
    );
}
