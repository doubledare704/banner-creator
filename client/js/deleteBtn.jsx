import React from 'react';
import ReactDOM from 'react-dom';


export default function(node) {
    class DeleteButton extends React.Component {
        constructor() {
            super();
            this.state = {
                deleted: false
            };
            this.handleClick = this.handleClick.bind(this);
        }

        handleClick() {
            this.setState({deleted: !this.state.deleted});
        }

        render() {
            const text = this.state.deleted ? 'deleted' : 'haven\'t deleted';
            return (
                <div className="btn btn-default modal-toggle" role="button" onClick={this.handleClick}>
                    <i className="glyphicon glyphicon-trash"/>
                                <span>U {text}</span>
                </div>
            );
        }
    }

    ReactDOM.render(
        <DeleteButton />,
        node
    );
}