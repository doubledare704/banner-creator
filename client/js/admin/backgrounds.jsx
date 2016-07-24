var React = require('react');
var ReactDOM = require('react-dom');


var activePictures = React.createClass({displayName: 'active_section',
    render: function() {
        return (
            <li className="active"><a data-toggle="tab" href="#active-pictures">Активные картинки</a></li>
        );
    }
});


var inactivePictures = React.createClass({displayName: 'active_section',
    render: function() {
        return (
            <li className="inactive"><a data-toggle="tab" href="#inactive-pictures">Неактивные картинки</a></li>
        );
    }
});


var Table = React.createClass({displayName: 'table',
    render: function() {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.data.rows.map(function(row, i) {
                        return (
                            <tr key={'table-item'+i}>
                                <td>{row.name}</td>
                                <td>{row.image}</td>
                                <td>
                                    <button id= {'button'+i} className="btn btn-default"><i className="glyphicon glyphicon-trash"></i> Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
});


var tab = React.createClass({
    render: function() {
        return (
            <div>
                <ul className= "nav nav-tabs">
                    <activePictures/>
                    <inactivePictures/>
                </ul>
                <Table data={tableModel}/>
            </div>
        );
    }
});


var tableModel = {
    rows: [{
        "id" : "1",
        "name": "Chase",
        "image": "Image1",
        "active": "t"
    },
    {
        "id" : "2",
        "name": "Sasha",
        "image": "Image2",
        "active": "f"
    }],

};


ReactDOM.render(
  React.createElement(tab, tableModel),
  document.getElementById('react')
);
