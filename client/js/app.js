var fabric = require('./fabmain.js');
var styluses = require('./../css/main.styl');
var React = require('react');
var ReactDOM = require('react-dom');

 var Header = React.createClass({
  render: function() {
    return (
      <h1>Upload new File</h1>
    );
  }
});
ReactDOM.render(
  <Header />,
  document.getElementById('content')
);


