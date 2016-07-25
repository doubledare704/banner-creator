import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'header';


class ToRename extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            name: this.props.title
        }
    }

    handleTitleChange = (event) => {
        this.setState({
            name: event.target.value
        });
    };

    render(){
        return (
            <div>
            <input type="text" onChange={this.handleTitleChange} required/>
            <input type="submit" value="Rename" onClick={this.props.handleRename(this.props.id, this.state.name)}  role="button"/>
            </div>
            );
        }
    }

class Rename extends React.Component{

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
            const text = this.state.renamed ? <span className="label label-danger">click to close</span> : 'Rename';
            return (
                <div className="btn btn-default">
                <i className="glyphicon glyphicon-pencil"/>
                <span onClick={this.onClick} >{ text }</span>
                { this.state.renamed ? <ToRename
                    title={this.props.title}
                    id={this.props.id}
                    handleRename = {this.props.handleRename}
                /> : null }
                </div>
            )
        }
    }

class Image extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: this.props.title,
            src: this.props.preview,
            previewed: true
        }
    }

    handlePreview = () =>{
        this.setState({previewed: !this.state.previewed});
        this.state.previewed ? this.setState({src: this.props.url}) : this.setState({src: this.props.preview});
    };

    handleRename = (id, name) => {
        return () => {
            fetch("/rename/",{
                method : "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({ id: id, name: name})
            }).then((response)=>{
                if(response.status != 200){
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                }
                response.json().then((data) => {
                    console.log(JSON.stringify(data));
                });
                this.setState({name: name});
            })
        }
    };

    render(){
        return (
            <div className="col-sm-6 col-md-4">
            <div className="thumbnail">
            <img src={this.state.src}  />
            <div className="caption">
            <h3> {this.state.name} </h3>
            <p> {this.props.url} </p>
            <a onClick={this.props.handleDelete(this.props.id)} className="btn btn-default modal-toggle" role="button">
            <i className="glyphicon glyphicon-trash"/>
            <span>Delete</span>
            </a>
            <a onClick={this.handlePreview} className="btn btn-default" role="button">
            Preview
            </a>
            <Rename
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

class ImagesList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
        displayedImages: this.props.imageArray
        };
    }

    handleDelete = (id) =>{
        return () => {
            fetch("/delete/",{
               method: "POST", headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({id: id})
            }).then((response) => {
                if (response.status != 200){
                    console.log('Looks like there was a problem. Status Code: ' +
                     response.status);
                }
                  response.json().then((data) => {
                    console.log(JSON.stringify(data));
                });
                const displayedImages = this.state.displayedImages.filter(
                    (el) => el.id != id
                );
                this.setState({
                    displayedImages: displayedImages
                    });
                console.log(JSON.stringify(displayedImages.concat(displayedImages)));
            });
        }
    };

    // handleUpload = (file, title, width, height) => {
    //
    // };

    handleSearch = (event) => {
        let searchQuery = event.target.value.toLowerCase();
        let displayedImages = this.props.imageArray.filter(function(el) {
            let searchValue = el.title.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });

        this.setState({
            displayedImages: displayedImages
        });
    };

    render() {
        return (
            <div>
                <div className="form-group">
                <input type="text" placeholder="Search..." className="search-field" onChange={this.handleSearch} />
                </div>
                <hr/>
                <ul>
                    {
                       this.state.displayedImages.map((el) =>
                       {
                        return <Image
                            key={el.id}
                            id={el.id}
                            title={el.title}
                            url={el.url}
                            preview={el.preview}
                            handleDelete={this.handleDelete}
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
