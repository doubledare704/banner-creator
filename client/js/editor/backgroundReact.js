import React from 'react';
import ReactDOM from 'react-dom';
import { h } from 'bazooka';

import { editor } from './fabmain.js';

const BAZOOKA_PREFIX = 'bg';

const BackgroundImage = React.createClass({
  setBackground: function () {
    editor.setBackground(this.props.imageOriginal)
  },
  render: function () {
    return (
      <li onClick={this.setBackground}>
        <img src={this.props.imagePreview}/>
      </li>
    )
  }
});


const BackgroundsList = React.createClass({
  getInitialState: function () {
    return {
      images: [],
      page: 1,
      blocked: false
    }
  },
  getImages: function() {
    const { viewUrl } = this.props.urls;

    if (this.state.blocked) {
      return;
    }
    this.setState({
      blocked: true
    });
    fetch(viewUrl + this.state.page, {credentials: 'same-origin'})
    .then((response) => {
      if (response.status == 200) {
        response.json().then(({ backgroundImages }) => {
          console.log(backgroundImages);
          this.setState({
            images: this.state.images.concat(backgroundImages),
            blocked: false,
            page: this.state.page + 1})
        })
      }
      else {
        this.setState({
          blocked: false
        })
      }
    })
  },
  componentDidMount: function() {
    this.getImages()
  },
  onListScroll: function (e) {
    if (e.target.scrollTop == (e.target.scrollHeight - e.target.offsetHeight)) {
      this.getImages();
    }
  },
  render: function () {
    const { imgUrl } = this.props.urls;
    return (
      <ul onScroll={this.onListScroll} id="backgroundsList2">
        {this.state.images.map(function(image, i) {
          return <BackgroundImage imagePreview={imgUrl + image.preview} key={i}
                                  imageOriginal={imgUrl + image.name}/>
        })}
      </ul>
    )
  }
});

const BackgroundsContainer = React.createClass({
  getInitialState: function () {
    return {
      displayList: false
    }
  },
  changeDisplay: function () {
    console.log(this.state.displayList);
    this.setState({
      displayList: !this.state.displayList
    })
  },
  render: function () {
    return (
      <div>
        <a href="#" onClick={this.changeDisplay}>
          <i className="material-icons">image</i>
          <span className="detail">Фоны</span>
        </a>
        <div className={!this.state.displayList ? 'hidden': ''} id="backgroundsContainer2">
          <BackgroundsList urls={this.props.urls} />
        </div>
      </div>
    )
  }
});

module.exports = function(node) {
  const VIEW_URLS = h.getAttrs(BAZOOKA_PREFIX, node);
  ReactDOM.render(<BackgroundsContainer urls={VIEW_URLS} />, node);
};

