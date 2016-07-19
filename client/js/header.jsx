import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'header';

var Header = React.createClass({
  render: function() {
    return (
      <h1>Upload new File</h1>
    );
  }
});

export default function (node) {
    let {headerText, id} = h.getAttrs(BAZOOKA_PREFIX, node);
    console.log(h.getAttrs(BAZOOKA_PREFIX, node));
    console.log(h.getAttrs(node));
    console.log(headerText, id);
    ReactDOM.render(
        <Header />,
        node
    );
}