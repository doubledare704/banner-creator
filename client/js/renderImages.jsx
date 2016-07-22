import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'header';

//onClick={() => this.props.eventStream.onNext({action: 'delete', ind = 2})}


class Rename extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            renamed: false
        };
        this.onClick = this.onClick.bind(this);

      }
        onClick() {
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
                /> : null }
                </div>
            )
        }
    }

class ToRename extends React.Component{

    constructor(props){
        super(props);
        this.handleRename = this.handleRename.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
    }
    handleTitleChange(e){
        this.setState({
            name: e.target.value
        });
    }


    // handleRename(event){
    //
    //     const renameName = this.state.name;
    //     const Id = this.props.id;
    //     const form = {id: Id, name: renameName};
    //
    //     fetch("/rename/",{
    //         method: "POST",headers: {
    //             'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(form)
    //     }).then((response) => {
    //         if(response.status !== 200){
    //             console.log('Looks like there was a problem. Status Code: ' +
    //                 response.status);
    //         }
    //         response.json().then((data) => {
    //         this.state.newImageArray.setAttribute("data-header-image-array",JSON.stringify(data));
    //             alert("ok");
    //         })
    //     })
    // }
    render(){
        return (
            <div>
            <input type="text" data-name="rename" onChange={this.handleTitleChange} required/>
            <input type="submit" value="Rename" onClick={this.handleRename}  role="button"/>
            </div>

        );
    }
}

class Image extends React.Component {
    //
    // constructor(props){
    //     super();
    // }

    // handleDelete(){
    //     const Id = this.props.id;
    //     const form = {id: Id};
    //
    //     fetch("/delete/",{
    //         method: "POST",headers: {
    //             'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(form)
    //     }).then((response) => {
    //         if(response.status !== 200){
    //             console.log('Looks like there was a problem. Status Code: ' +
    //                 response.status);
    //         }
    //         response.json().then((data) => {
    //         this.state.newImageArray.setAttribute("data-header-image-array",JSON.stringify(data));
    //             alert("ok");
    //         })
    //     })
    // }

    render(){

        return (
            <div className="col-sm-6 col-md-4">
            <div className="thumbnail">
            <img src={this.props.preview}  />
            <div className="caption">
            <h3> {this.props.title} </h3>
            <p> {this.props.url} </p>
            <a onClick={this.props.handleDelete(this.props.id)} className="btn btn-default modal-toggle" role="button">
            <i className="glyphicon glyphicon-trash"/>
            <span>Delete</span>
            </a>
            <a href={this.props.url} className="btn btn-default" role="button">
            Preview
            </a>
            <Rename
                title={this.props.title}
                id={this.props.id}
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
            console.log("Hello", id);
            const displayedImages = this.state.displayedImages.filter((el) => el.id != id);
            this.setState({
                displayedImages: displayedImages
            });
        }
    };
    handleRename = (id) => {
        return () => {
            console.log("Rename", id);
            fetch("/rename/",{
                method : "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({ id: id})
            }).then((response)=>{
                if(response.status != 200){
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                }
                response.json().then((data) => {
                    console.log(JSON.stringify(data));
                })
            })
        }



    };
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
            <div id="newImgList" className="form-inline">
                <div className="form-group">
                Search <input type="text" className="search-field" onChange={this.handleSearch} />
                </div>
                <hr/>
                <ul>
                    {
                       this.state.displayedImages.map((el) => {
                            return <Image
                                key={el.id}
                                id={el.id}
                                title={el.title}
                                url={el.url}
                                preview={el.preview}
                                delete={el.delete}
                                rename={el.rename}
                                handleDelete={this.handleDelete}
                                handleRename={this.handleRename}
                            />; // eventStream={this.props.eventStream}
                       })
                    }
                </ul>
            </div>
        );
    }
}


export default function (node) {
    const { imageArray } = h.getAttrs(BAZOOKA_PREFIX, node);

    //const eventStream = Rx.Subject();

    ReactDOM.render(
        <ImagesList imageArray={ imageArray }/>, // eventStream={eventStream}
        node
    );

    // eventStream
    //     .filter(({ action }) => action === 'delete')
    //     .subscribe(({ ind }) => {
    //         imageArray =  imageArray[]

    //             ReactDOM.render(
    //                 <ImagesList imageArray={imageArray} eventStream={eventStream} />,
    //                 node
    //             );
    //     })
}
