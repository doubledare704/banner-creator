import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'body';

class Comments extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        const style = this.props.style;
        const name = this.props.name;
        return(
            <div name={name} style={style}>
                {this.props.text}
            </div>

        );
    }
}

class ReviewResult extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="comment-wrapper" style={{backgroundImage: `url(${this.props.imageUrl})`}}>
                {
                    this.props.reviewComments.map(el => {
                        return <Comments
                            key={ el.id }
                            name={ el.name }
                            text={ el.text }
                            style={ el.style }
                        />;
                    })
                }
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