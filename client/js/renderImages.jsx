import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'header';

export default function (node) {
    let {imageArray} = h.getAttrs(BAZOOKA_PREFIX, node);
    var Image = React.createClass({
            render: function() {
                return (
                    <div className="col-sm-6 col-md-4">
                        <div className="thumbnail">

                        <img src={this.props.preview}/>
                        <div className="caption">
                            <h3> {this.props.title} </h3>
                            <p> {this.props.url} </p>
                            <a href={this.props.delete} className="btn btn-default modal-toggle" role="button">
                                <i className="glyphicon glyphicon-trash"/>
                                <span>Delete</span>
                            </a>
                            <a href="#" className="btn btn-default " role="button">
                        <i className="glyphicon glyphicon-pencil"/>
                         <span>Rename</span></a>
                    <a href={this.props.url} className="btn btn-default" role="button">
                        Preview
                    </a>
                        </div>
                        </div>
                        </div>
                );
            }
        });

        var ImagesList = React.createClass({
            getInitialState: function() {
                return {
                    displayedImages: imageArray
                };
            },

            handleSearch: function(event) {
                var searchQuery = event.target.value.toLowerCase();
                var displayedImages = imageArray.filter(function(el) {
                    var searchValue = el.title.toLowerCase();
                    return searchValue.indexOf(searchQuery) !== -1;
                });

                this.setState({
                    displayedImages: displayedImages
                });
            },

            render: function() {
                return (
                    <div className="form-inline">
                        <div className="form-group">
                        Search <input type="text" className="search-field" onChange={this.handleSearch} />
                        </div>
                        <hr/>
                        <ul>
                            {
                               this.state.displayedImages.map(function(el) {
                                    return <Image
                                        key={el.id}
                                        title={el.title}
                                        url={el.url}
                                        preview={el.preview}
                                        delete={el.delete}
                                    />;
                               })
                            }
                        </ul>
                    </div>
                );
            }
        });
    ReactDOM.render(
        <ImagesList />,
        node
    );
}
