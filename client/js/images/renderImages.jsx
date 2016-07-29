import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'body';
class DeleteConfirm extends React.Component{
     constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="btn btn-danger">
                <div onClick={this.props.handleDelete(this.props.id)}>
                    <i className="glyphicon glyphicon-trash"/>
                    <span>Yes</span>
               </div>
            </div>
        );
    }
 }

class DeleteButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deleted: false
        };
        this.onClick = this.onClick.bind(this);
      }

    onClick() {
        this.setState({deleted: !this.state.deleted});
    }

    render() {
        return (
            <div className="btn-wrapper">
                <div className="btn btn-default">
                    <i className="glyphicon glyphicon-trash"/>
                    <span onClick={this.onClick} >Delete</span>
                </div>
                { this.state.deleted ?
                    <DeleteConfirm id={this.props.id} handleDelete={this.props.handleDelete}/> : null }
            </div>
        );
    }
}

class RenameInput extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            value: ''
        };
        this.onInput = this.onInput.bind(this);
    }

    componentDidMount() {
        this.setState({value: this.refs.rename.value})
    }

    onInput() {
        this.setState({value: this.refs.rename.value})
    }

    render() {
        return (
            <div>
                <input type="text" ref="rename" onChange={this.onInput}  required/>
                <input type="submit" value="Rename"
                       onClick={this.props.handleRename(this.props.id, this.state.value)}
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
                <div className="btn btn-default">
                    <i className="glyphicon glyphicon-pencil"/>
                    <span onClick={this.onClick} >Rename</span>
                </div>
                { this.state.renamed ? <RenameInput id={this.props.id} handleRename = {this.props.handleRename}/> : null }
            </div>
        );
    }
}

class Image extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            src: this.props.preview,
            previewed: false
        };
        this.handlePreview = this.handlePreview.bind(this);
    }

    handlePreview() {
        const src = this.state.previewed ? this.props.preview : this.props.url;
        this.setState({
            previewed: !this.state.previewed, src: src
        });
    }

    render() {
        return (
            <div className="col-sm-6 col-md-4">
                <div className="thumbnail">
                    <div className="img-wrapper" style={{backgroundImage: `url(${this.state.src})`}} >
                        </div>
                        <div className="caption">
                            <h3> {this.props.title} </h3>
                            <p> {this.props.url} </p>
                            <p> ID:{this.props.id} </p>
                            <DeleteButton id={this.props.id} handleDelete= {this.props.handleDelete} />
                            <a onClick={this.handlePreview} className="btn btn-default btn-wrapper" role="button">
                            Preview
                            </a>
                                <RenameButton
                                    title={this.props.title}
                                    id={this.props.id}
                                    handleRename={this.props.handleRename}
                                />
                    </div>
                </div>
            </div>
            );
        }
    }

function WarningMessage(props) {
    return (
        <div className="form-group">
            <h3>Something is wrong, Status: {this.props.status} </h3>
        </div>
    );
}

class ImagesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displayedImages: this.props.imageArray,
            failed: false,
            status: null,
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
                    this.setState({failed: true});
                    this.setState({status: response.status});
                    return response.status;
                }
                this.setState({status: response.status});

                const displayedImages = this.props.imageArray.filter(
                    el => el.id !== id
                );
                this.props.imageArray = displayedImages;
                this.setState({
                    displayedImages: displayedImages
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
                    this.setState({failed: true});
                    this.setState({status: response.status});
                    return response.status;
                }
                this.setState({status: response.status});

                const renameEl = this.props.imageArray.filter(
                    el => (el.id == id)
                );
                renameEl[0].title = title;
                this.setState({displayedImages: this.props.imageArray});
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
                            <input type="text" placeholder="Search..." className="search-field" onChange={this.handleSearch} />
                        </div>
                        {this.state.failed ? <WarningMessage status={this.state.status} /> : null}
                </div>
                     <hr/>
                    <ul>
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
                    </ul>
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
