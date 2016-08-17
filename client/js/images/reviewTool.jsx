import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import {activatePopUp} from '../popUp.js';
import {csrfToken} from '../helpers'

const BAZOOKA_PREFIX = 'body';

class ReviewWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            countComment:0,
            commentsArr: []
        };
        this.accepted = this.accepted.bind(this);
        this.notAccepted = this.notAccepted.bind(this);
        this.clickComment = this.clickComment.bind(this);
        this.getComments = this.getComments.bind(this);
    }

    sendToReview(status, commentClouds){
        const img_id = this.props.imageId;

        const formData = new FormData();

        formData.append('id', img_id);
        formData.append('status', status);
        formData.append('comment', comment);
        formData.append('commentClouds', commentClouds);
        // append image as base64 string
        formData.append('file', ); // file Id or something
        fetch("/review_action/",
            {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                'X-CSRFToken': csrfToken()
                },
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
        
        let node = event.target;
        //let commentParentDiv=node.parentNode.parentNode;
        let X = ((event.clientX-node.getBoundingClientRect().left)/960)*100 + 2;
        let Y = ((event.clientY-node.getBoundingClientRect().top)/420)*100 -5;
        let commentDiv = document.createElement("DIV");
        commentDiv.className = "dashboard-media-body";
        commentDiv.style.cssText = `left: ${X}%; top: ${Y}%; position: absolute;`;

        let commentInput = document.createElement("TEXTAREA");
        commentInput.name = `comment${this.state.countComment}`;
        commentInput.style.cssText = 'margin-left: 13px; margin-top: -5px; background-color: #f5f5f5; border: 1px solid #f5f5f5; height: 100%;';
        commentInput.placeholder = "Коммент...";


        let sp = document.createElement("SPAN");
        let xt = document.createTextNode("x");
        sp.className = "label label-danger";
        sp.style.cssText = "top: -5%; left: 5%; margin-left: 4px;";
        sp.appendChild(xt);
        sp.addEventListener('click', e => e.target.parentNode.parentNode.removeChild(e.target.parentNode));

        let p = document.createElement("P");
        p.className = "dashboard-well";
        p.appendChild(commentInput);
        p.appendChild(sp);


        commentDiv.appendChild(p);
        commentDiv.addEventListener('click', e => e.stopPropagation());
        node.appendChild(commentDiv);
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
    }

    getComments(){
        let commentsArray = document.getElementsByClassName("dashboard-media-body");

        console.log(commentsArray);
        
        let commentClouds = [];
        if(commentsArray.length > 0) {
            for (let i = 0; i < commentsArray.length; i++) {
                commentClouds.push(
                {
                    id: i,
                    style: {
                        left: commentsArray[i].style.left,
                        top: commentsArray[i].style.top
                    }

                });
            }
        }
        console.log(commentClouds);
        // return JSON.stringify(commentClouds)
    }

    accepted(){
        const status = "accepted";
        this.sendToReview(status, this.getComments());

    }

    notAccepted(){
        console.log('CLICKED');
        const status = "not_accepted";
        this.getComments();
        //this.sendToReview(status, this.getComments());

    }

    render() {
        return (<div>
                    <div onClick={this.clickComment} className="dashboard-comment-wrapper" style={{backgroundImage: `url(${this.props.imageUrl})`}}>
                    </div>

                    <div className="col-lg-10">
                            <button onClick={this.notAccepted} className="btn btn-danger form-group btn-wrapper">
                                <i className="glyphicon glyphicon-remove"/>
                            </button>

                            <button onClick={this.accepted} className="btn btn-success form-group btn-wrapper">
                                <i className="glyphicon glyphicon-ok"/>
                            </button>
                    </div>
            </div>
        );
    }
}

export default function (node) {
    const { imageUrl, imageId } = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <ReviewWindow
            imageUrl = {imageUrl}
            imageId = {imageId}
        />,
        node
    );
}
