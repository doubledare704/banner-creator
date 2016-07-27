import React from 'react';
import ReactDOM from 'react-dom';

var Header = React.createClass({
  render: function() {
    return (
      <h1>Upload new File</h1>
    );
  }
});

export default function (node) {
    ReactDOM.render(
        <Header />,
        node
    );
}
