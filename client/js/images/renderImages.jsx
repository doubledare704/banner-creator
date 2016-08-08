import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import {activatePopUp} from '../popUp.js';

const BAZOOKA_PREFIX = 'body';

class DeleteButton extends React.Component {

    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
      }

    onDelete() {
        activatePopUp({child: <h2>Удалить?</h2> ,
        confirm: true,
        confirmAction: this.props.handleDelete(this.props.id)
        });
    }

    render() {
        return (
            <div className="btn-wrapper">
                <div className="btn btn-default">
                    <i className="glyphicon glyphicon-trash"/>
                    <span onClick={this.onDelete} >Удали</span>
                </div>
            </div>
        );
    }
}

class RenameInput extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            newtitle: 'noname'
        };
        this.onInput = this.onInput.bind(this);
    }

    onInput() {
        this.setState({newtitle: this.refs.rename.value})
    }

    render() {
        return (
            <div className="btn-wrapper">
                <input type="text" ref="rename" onChange={this.onInput}  required/>
                <input type="submit" value="Переименуй" 
                       onClick={this.props.handleRename(this.props.id, this.state.newtitle)}
                />
            </div>
            );
        }
    }


class RenameButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            renamed: false
        };
        this.onClick = this.onClick.bind(this);
      }

    onClick() {
        this.setState({renamed: !this.state.renamed});
    }

    render() {
        return (
            <div className="btn-wrapper">
                { this.state.renamed ? activatePopUp({child: <h2> <RenameInput id={this.props.id} handleRename = {this.props.handleRename}/> </h2>    ,
                    flash: false }) : null }
                <div className="btn btn-default">
                    <i className="glyphicon glyphicon-pencil"/>
                    <span onClick={this.onClick} >Переименуй</span>
                </div>
            </div>
        );
    }
}

class Image extends React.Component {

    constructor(props) {
        super(props);
        this.handlePreview = this.handlePreview.bind(this);
    }

    handlePreview() {
        activatePopUp({
            child: <div className="img-popup" style={{backgroundImage: `url(${this.props.url})`}} ></div>,
            flash: false
        });
    }

    render() {
        return (
            <div className="col-lg-6">
                <div className="thumbnail">
                    <div className="img-wrapper" style={{backgroundImage: `url(${this.props.preview})`}} >
                        </div>
                        <div className="caption">
                           <h6> {this.props.title} </h6>
                            <a onClick={this.handlePreview} className="btn btn-default btn-wrapper" role="button">
                            Смотри
                            </a>
                                <RenameButton
                                    title={this.props.title}
                                    id={this.props.id}
                                    handleRename={this.props.handleRename}
                                />
                            <DeleteButton id={this.props.id} handleDelete= {this.props.handleDelete} />
                    </div>
                </div>
            </div>
            );
        }
    }

class ImagesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displayedImages: this.props.imageArray,
            searchQuery: ''
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleRename = this.handleRename.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleDelete(id) {
        return () => {
            fetch("/delete/", {
                credentials: 'same-origin',
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id})
            }).then(response => {
                if (response.status !== 200) {
                    activatePopUp({
                       title: <h2>Што то не так ошибка {response.status} </h2>
                    });
                    return response.status;
                }
                const displayedImages = this.props.imageArray.filter(
                    el => el.id !== id
                );
                this.props.imageArray = displayedImages;
                this.setState({
                    displayedImages: displayedImages
                    });
                activatePopUp({
                    title: <h2> Удален </h2>,
                    flash: true
                });
            });
        };
    }

    handleRename(id, title) {
        return () => {
            fetch("/rename/", {
                credentials: 'same-origin',
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id, title: title})
            }).then(response => {
                if (response.status !== 200) {
                    activatePopUp({
                       title: <h2>Што то не так ошибка  {response.status} </h2>
                    });
                    return response.status;
                }

                const renameEl = this.props.imageArray.filter(
                    el => (el.id == id)
                );
                renameEl[0].title = title;
                this.setState({displayedImages: this.props.imageArray});
                activatePopUp({
                    title: <h2> Переименовано </h2>,
                    flash: true
                })
            });
        };
    }

    handleSearch(event) {
        let searchQuery = event.target.value.toLowerCase();
        this.setState({searchQuery});
    }

    render() {
        const filteredImages = this.props.imageArray.filter((el) => el.title.toLowerCase().indexOf(this.state.searchQuery) !==-1);
        return (
            <div>
                <div className="form-inline">
                        <div className="form-group">
                            <input type="text" placeholder="Поиск..." className="search-field" onChange={this.handleSearch} />
                        </div>
                </div>
                     <hr/>
                    <div>
                        {
                           filteredImages.map(el => {
                               return <Image
                                   key={ el.id }
                                   id={ el.id }
                                   title={ el.title }
                                   url={ el.url }
                                   preview={ el.preview }
                                   handleDelete={ this.handleDelete }
                                   handleRename={this.handleRename}
                               />;
                           })
                        }
                    </div>
            </div>
        );
    }
}

export default function(node) {
    const {imageArray} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <ImagesList imageArray={ imageArray }/>,
        node
    );
}
