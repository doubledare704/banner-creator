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

// export default function () {
//     class Rename extends React.Component{
//         constructor(){
//             super();
//             this.state = {
//                 renamed:false
//             };
//             this.handleClick = this.HandleClick.bind(this);
//         }
//         handleClick(){
//             this.setState({renamed: !this.state.renamed});
//         }
//         render (){
//             return(
//                 <div>
//                         <input type="submit" value="Rename" onClick={this.onClick} />
//                         { this.state.showResults ? <Results /> : null }
//                     </div>
//             )
//         }
//     }
//
//
// }
    // var Rename = React.createClass({
    //         getInitialState: function() {
    //             return { showResults: false };
    //         },
    //         onClick: function() {
    //             this.setState({ showResults: true });
    //         },
    //         render: function() {
    //             return (
    //                 <div>
    //                     <input type="submit" value="Rename" onClick={this.onClick} />
    //                     { this.state.showResults ? <Results /> : null }
    //                 </div>
    //             );
    //         }
    //     });
    //
    //      var Results = React.createClass({
    //         render: function() {
    //             return (
    //                 <div id="results" className="Rename-results">
    //                     Rename <input type="text" name="rename"/>
    //                     <input type="submit" value="Rename"  role="button"/>
    //                 </div>
    //             );
    //         }
    //     });