import React from 'react';
import ReactDOM from 'react-dom';


export default function (node) {
        var Rename = React.createClass({
        getInitialState: function() {
            return { showResults: false };
        },
        onClick: function() {
            this.setState({ showResults: true });
        },
        render: function() {
            return (
                <div>
                    <input type="submit" value="Rename" onClick={this.onClick} />
                    { this.state.showResults ? <Results /> : null }
                </div>
            );
        }
    });
    
    var Results = React.createClass({
        render: function() {
            return (
                <div id="results" className="Rename-results">
                    Some Results <input type="text"/>
                    <input type="submit" value="Rename"  role="button"/>
                </div>
            );
        }
    });
    ReactDOM.render(<Rename />, node);
}

