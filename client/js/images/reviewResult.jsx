import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'body';

class Comments extends React.Component{
    constructor(props){
        super(props);

    }
    
    render(){
        const divStyle = {
            left: this.props.style.left,
            top: this.props.style.top,
            position: "absolute"
        };
        const pStyle ={
            marginLeft: '7px',
            marginTop: '0px',
            backgroundColor: '#f5f5f5',
            whiteSpace: 'pre'
        };
        return(
            <div className = "dashboard-user-media-body" style={ divStyle }>
                <p className = "dashboard-well"><div style={ pStyle }>{this.props.text}</div></p>
            </div>

        );
    }
}

class ReviewResult extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show: true
        };
        this.showComment = this.showComment.bind(this);
    }

    showComment(){
        this.setState({show: !this.state.show});
    }

    render(){
        const btn = this.state.show ? "glyphicon glyphicon-eye-close" : "glyphicon glyphicon-eye-open";
        return(
            <div>
                <button onClick={this.showComment} className="btn btn-primary form-group btn-wrapper tooltipp" data-tooltip="спрячь/покажи">
                    <i className={btn}/>
                </button>
                <div className="dashboard-comment-wrapper" style={{backgroundImage: `url(${this.props.imageUrl})`}}>
                    { this.state.show ? this.props.reviewComments.map(el => {return <Comments key={ el.comment_id } style={ el.style } text={ el.text }/>;}): null }
                </div>
            </div>
        );
    }
}

export default function (node){
    const {imageUrl, reviewComments} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <ReviewResult
            reviewComments={reviewComments}
            imageUrl={imageUrl}
        />,
        node
    );
}