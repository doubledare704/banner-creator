import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'body';

function Image(props){
    return(
        <div>
            <button onClick={this.props.handlePrevious}>Назад</button>
            <div className="img-wrapper" style={{backgroundImage: `url(${this.props.currentImage.url})`}} >
            </div>
            <button onClick={this.props.handleNotAccepted}>Плохо</button>
            <button onClick={this.props.handleAccepted}>ОК</button>
        </div>
    );
}

class ImageSlider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            image_idx: 0,
            reviewImage: this.props.imageArray,
            currentImage: null
        };
        this.handleAccepted = this.handleAccepted.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNotAccepted = this.handleNotAccepted.bind(this);
        
    }

    handleAccepted(){

        if((length(this.state.reviewImage) !== 0) && (this.state.image_idx < length(this.state.reviewImage)) ){
            this.setSatet({currentImage: this.state.reviewImage[this.state.image_idx]});
            this.setSate({image_idx: image_idx+1});
            // code when review Accepted
        }
    }

    handleNotAccepted(){

        if((length(this.state.reviewImage) !== 0) && (this.state.image_idx < length(this.state.reviewImage)) ){
            this.setSatet({currentImage: this.state.reviewImage[this.state.image_idx]});
            this.setSate({image_idx: image_idx+1});
            // code when review NotAccepted
        }
    }

    handlePrevious(){
        if((length(this.state.reviewImage) !== 0) && (this.state.image_idx < length(this.state.reviewImage)) ){
            this.setSatet({currentImage: this.state.reviewImage[this.state.image_idx]});
            this.setSate({image_idx: image_idx-1});
        }
    }
    render(){
        return(
            <div>
                <Image
                    currentImage={this.state.currentImage}
                    handleAccepted={this.handleAccepted}
                    handleNotAccepted={this.handleNotAccepted}
                    handlePrevious={this.handlePrevious}
                />
            </div>
        )
    }
}

export default function(node){
    const { imageArray } = h.getAttrs(BAZOOKA_PREFIX, node);
    ReactDOM.render(
        <ImageSlider imageArray={imageArray}/>,
        node
    )
}