import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'header';

//onClick={() => this.props.eventStream.onNext({action: 'delete', ind = 2})}


class Rename extends React.Component{
    constructor() {
        super();
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
                <div  onClick={this.handleRename} className="btn btn-default">
                <i className="glyphicon glyphicon-pencil"/>
                <span onClick={this.onClick} >{ text }</span>
                { this.state.renamed ? <ToRename /> : null }
                </div>
            )
        }
    }

class ToRename extends React.Component{

    constructor(){
        super();
        this.handleRename = this.handleRename.bind(this);
    }


    handleRename(){

        console.log('xyu');
        //const data = {file: canvas.toDataURL()};
        const renameName = this.value;
        const form = {id: 47, name: renameName};
        console.log(JSON.stringify(form),this.props.img_rename);
        fetch("/rename/",{
            method: "POST",headers: {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
        }).then((response) => {
            if(response.status !== 200){
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
            }
            response.json().then((data) => {
            console.log(data); });
        })
    }
    render(){
        return (
            <div>
            <input type="text" data-name="rename" onClick={this.handleRename} required/>
            <input type="submit" value="Rename" onClick={this.handleRename}  role="button"/>
            </div>

        );
    }
}

class Image extends React.Component {

    constructor(){
        super();

    }
    handleTitleChange(event){
        this.setState({name: e.target.value });
    }
    render(){

        return (
            <div className="col-sm-6 col-md-4">
            <div className="thumbnail">
            <img src={this.props.preview}  />
            <div className="caption">
            <h3> {this.props.title} </h3>
            <p> {this.props.url} </p>
            <a href={this.props.delete} className="btn btn-default modal-toggle" role="button">
            <i className="glyphicon glyphicon-trash"/>
            <span>Delete</span>
            </a>
            <a href={this.props.url} className="btn btn-default" role="button">
            Preview
            </a>
            <Rename />
            </div>
            </div>
            </div>
        );
    }
    handleRename(){
        console.log("Id: " + this.state.id);
        console.log("Name: " + this.state.name);
        const form = {id: this.props.id, name: this.props.title};
        console.log(JSON.stringify(form));
        fetch("/rename/",{
            method: "POST",headers: {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
        }).then((response) => {
            if(response.status !== 200){
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
            }
            response.json().then((data) => {
            console.log(data); });
        })
    }

}

var ImagesList = React.createClass({
    getInitialState: function() {
        return {
            displayedImages: this.props.imageArray
        };
    },

    handleSearch: function(event) {
        console.log('it works');
        var searchQuery = event.target.value.toLowerCase();
        var displayedImages = this.props.imageArray.filter(function(el) {
            var searchValue = el.title.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });

        this.setState({
            displayedImages: displayedImages
        });
    },
    // handleDel: function (event) {
    //     console.log('syka');
    //     alert('syka');
    //     return () => {
    //         console.log('syka');
    //         const displayedImages = displayedImages.filter((el) => el.id != id);
    //         alert('syka');
    //         this.setState({
    //             displayedImages: displayedImages
    //         });
    //     }
    // },
   

    render() {
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
                                rename={el.rename}

                            />; // eventStream={this.props.eventStream}
                       })
                    }
                </ul>
            </div>
        );
    }
});


export default function (node) {
    const {imageArray} = h.getAttrs(BAZOOKA_PREFIX, node);
    //const eventStream = Rx.Subject();

    ReactDOM.render(
        <ImagesList imageArray={imageArray}/>, // eventStream={eventStream}
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
