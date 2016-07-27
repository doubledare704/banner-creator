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

class DeleteButton extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            deleted: false
        };
      }

        onClick = () => {
            this.setState({deleted: !this.state.deleted});
        };

        render() {
            return (
                <div>
                    <div className="btn btn-default">
                        <i className="glyphicon glyphicon-trash"/>
                        <span onClick={this.onClick} >Delete</span>
                    </div>
                    { this.state.deleted ? <DeleteConfirm id={this.props.id} handleDelete={this.props.handleDelete}/> : null }
                </div>
            )
        }
    }

class RenameInput extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            title: this.props.title
        }
    }

    handleTitleChange = (event) => {
        this.setState({
            title: event.target.value
        });
    };

    render(){
        return (
            <div>
                <input type="text" onChange={this.handleTitleChange} required/>
                <input type="submit" value="Rename"
                       onClick={this.props.handleRename(this.props.id, this.state.title)}
                />
            </div>
            );
        }
    }

class RenameButton extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            renamed: false
        };
      }

        onClick = () => {
            this.setState({renamed: !this.state.renamed});
        };

        render() {
            return (
                <div>
                    <div className="btn btn-default">
                        <i className="glyphicon glyphicon-pencil"/>
                        <span onClick={this.onClick} >Rename</span>
                    </div>
                    { this.state.renamed ? <RenameInput title={this.props.title} id={this.props.id} handleRename = {this.props.handleRename}/> : null }
                </div>
            )
        }
    }

class Image extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            title: this.props.title,
            src: this.props.preview,
            previewed: false,
            failed: false
        }
    }

    handlePreview = () =>{
        const src = this.state.previewed ? this.props.preview : this.props.url;
        this.setState({
            previewed: !this.state.previewed, src: src
        });
    };

    handleRename = (id, title) => {
        return () => {
            fetch("/rename/", {
                credentials:'same-origin',
                method : "POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({ id: id, title: title})
            }).then((response)=>{
                if(response.status != 200){
                    this.setState({failed: true});
                    this.setState({status: response.status});
                    return response.status
                }
                this.setState({status: response.status});
                this.setState({title: title});
            })
        }
    };

    render(){
        return (
            <div className="col-sm-6 col-md-4">
                <div className="thumbnail">
                    <img src={this.state.src}  />
                        <div className="caption">
                            <h3> {this.state.title} </h3>
                            <p> {this.props.url} </p>
                            <p> ID:  {this.props.id} </p>
                            <DeleteButton id={this.props.id} handleDelete= {this.props.handleDelete} />
                            <a onClick={this.handlePreview} className="btn btn-default" role="button">
                            Preview
                            </a>
                                <RenameButton
                                    title={this.props.title}
                                    id={this.props.id}
                                    handleRename={this.handleRename}
                                />
                    </div>
                </div>
            </div>
            );
        }
    }

class WarningMessage extends React.Component {
    constructor(props) {
        super(props);
    }
    render (){
        return(
             <div className="form-group">
                <h3>Something is wrong, Status: {this.props.status} </h3>
            </div>
        )
    }
}

class ImagesList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            displayedImages: this.props.imageArray,
            failed: false,
            status: null
        };
    }

    handleDelete = (id) =>{
        return () => {
            fetch("/delete/",{
                credentials:'same-origin',
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({id: id})
            }).then((response) => {
                if (response.status != 200){
                    this.setState({failed: true});
                    this.setState({status: response.status});
                    return response.status
                }
                this.setState({status: response.status});

                const displayedImages = this.state.displayedImages.filter(
                    (el) => el.id != id
                );
                this.setState({
                    displayedImages: displayedImages
                    });
            });
        }
    };
    

    handleSearch = (event) => {
        let searchQuery = event.target.value.toLowerCase();
        let displayedImages = this.props.imageArray.filter(function(el) {
            let searchValue = el.title.toLowerCase();
            return searchValue.indexOf(searchQuery) != -1;
        });

        this.setState({
            displayedImages: displayedImages
        });
    };

    render() {
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
                           this.state.displayedImages.map((el) =>
                           {
                            return <Image
                                key={ el.id }
                                id={ el.id }
                                title={ el.title }
                                url={ el.url }
                                preview={ el.preview }
                                handleDelete={ this.handleDelete }
                            />;
                           })
                        }
                    </ul>
            </div>
        );
    }
}

export default function (node) {
    const { imageArray } = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <ImagesList imageArray={ imageArray }/>,
        node
    );
}
