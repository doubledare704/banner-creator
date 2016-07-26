import React from 'react';
import ReactDOM from 'react-dom';
import { h } from 'bazooka';

import { editor } from './fabmain.js';


const BAZOOKA_PREFIX = 'bg';

class BackgroundImage extends React.Component {
  constructor(props) {
    super(props);
    this.setBackground = this.setBackground.bind(this)
  }
  setBackground() {
    editor.setBackground(this.props.imageOriginal)
  }
  render() {
    return (
      <li onClick={this.setBackground}>
        <img src={this.props.imagePreview}/>
      </li>
    )
  }
}

class BackgroundsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      page: 1,
      isBlocked: false
    };
    this.getImages = this.getImages.bind(this);
    this.onListScroll = this.onListScroll.bind(this);
  }

  getImages() {
    const { viewUrl } = this.props.urls;

    if (this.state.isBlocked) {
      return;
    }
    this.setState({
      isBlocked: true
    });
    fetch(viewUrl + this.state.page, {credentials: 'same-origin'})
    .then((response) => {
      if (response.status == 200) {
        response.json().then(({ backgroundImages }) => {
          this.setState({
            images: this.state.images.concat(backgroundImages),
            isBlocked: false,
            page: this.state.page + 1})
        })
      }
      else {
        this.setState({
          isBlocked: false
        })
      }
    })
  }

  componentDidMount() {
    this.getImages()
  }

  onListScroll(e) {
    if (e.target.scrollTop == (e.target.scrollHeight - e.target.offsetHeight)) {
      this.getImages();
    }
  }

  render() {
    const { imgUrl } = this.props.urls;
    return (
      <ul onScroll={this.onListScroll} id="backgroundsList">
        {this.state.images.map(function(image, i) {
          return <BackgroundImage imagePreview={imgUrl + image.preview} key={i}
                                  imageOriginal={imgUrl + image.name}/>
        })}
      </ul>
    )
  }
}

class BackgroundsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayList: false };
    this.changeDisplay = this.changeDisplay.bind(this)
  }

  changeDisplay() {
    this.setState({
      displayList: !this.state.displayList
    })
  }

  render() {
    return (
      <div>
        <a href="#" onClick={this.changeDisplay}>
          <i className="material-icons">image</i>
          <span className="detail">Фоны</span>
        </a>
        <div className={!this.state.displayList ? 'hidden': ''} id="backgroundsContainer">
          <BackgroundsList urls={this.props.urls} />
        </div>
      </div>
    )
  }
}


module.exports = function(node) {
  const VIEW_URLS = h.getAttrs(BAZOOKA_PREFIX, node);
  ReactDOM.render(<BackgroundsContainer urls={VIEW_URLS} />, node);
};

