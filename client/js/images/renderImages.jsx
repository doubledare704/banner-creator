import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import {activatePopUp} from '../popUp.js';
import {csrfToken, SuccessAlert, ErrorAlert} from '../helpers';

const BAZOOKA_PREFIX = 'body';

class DeleteButton extends React.Component {

    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
      }

    onDelete() {
        activatePopUp({child:<ErrorAlert text="Удалить?"/>,
        confirm: true,
        confirmAction: this.props.handleDelete(this.props.id)
        });
    }

    render() {
        return (
            <div className="btn-wrapper">
                <button onClick={this.onDelete} className="btn btn-danger">
                    <i className="glyphicon glyphicon-trash"/>
                </button>
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
            <div>
                Новое имя: <input type="text" ref="rename" onChange={this.onInput}  required/>
                <button onClick={this.props.handleRename(this.props.id, this.state.newtitle)}
                        className="btn btn-primary btn-wrapper">
                    <i className="glyphicon glyphicon-pencil"/>
                </button>

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
                { this.state.renamed ? activatePopUp({
                    child: <h3 className="text-center"><RenameInput id={this.props.id} handleRename={this.props.handleRename}/></h3>,
                    flash: false }) : null }
                <button onClick={this.onClick} className="btn btn-primary btn-wrapper">
                    <i className="glyphicon glyphicon-pencil"/>
                </button>
            </div>
        );
    }
}

export class Image extends React.Component {

    constructor(props) {
        super(props);
        this.handlePreview = this.handlePreview.bind(this);
    }

    handlePreview() {
        activatePopUp({
            child: <div className="img-popup" style={{backgroundImage: `url(${this.props.url})`}}></div>,
            flash: false
        });
    }

    render() {
        return (
            <div className="col-lg-6">
                <div className="thumbnail">
                    <div onClick={this.handlePreview}
                         className="img-wrapper dashboard-banner-preview"
                         style={{backgroundImage: `url(${this.props.preview})`}}>
                        </div>
                        <div className="caption">
                           <h6> {this.props.title} </h6>
                            <div className="text-right">
                                    <RenameButton
                                        title={this.props.title}
                                        id={this.props.id}
                                        handleRename={this.props.handleRename}
                                    />
                                <DeleteButton id={this.props.id} handleDelete= {this.props.handleDelete} />
                            </div>
                    </div>
                </div>
            </div>
            );
        }
    }

export class ImagesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displayedImages: this.props.imageArray,
            searchQuery: ''
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleRename = this.handleRename.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.imageUpload = this.imageUpload.bind(this);
    }

    handleDelete(id) {
        return () => {
            fetch("/delete/", {
                credentials: 'same-origin',
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken()
                },
                body: JSON.stringify({id: id})
            }).then(response => {
                if (response.status !== 200) {
                    activatePopUp({
                       child: <ErrorAlert text="Произошла ошибка. Попробуйте повторить попытку."/>,
                        flash: true
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
                    child: <SuccessAlert text="Удален"/>,
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
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken()
                },
                body: JSON.stringify({id: id, title: title})
            }).then(response => {
                if (response.status !== 200) {
                    activatePopUp({
                       child: <ErrorAlert text="Произошла ошибка. Попробуйте повторить попытку."/>,
                        flash: true
                    });
                    return response.status;
                }

                const renameEl = this.props.imageArray.filter(
                    el => (el.id == id)
                );
                renameEl[0].title = title;
                this.setState({displayedImages: this.props.imageArray});
                activatePopUp({
                    child: <SuccessAlert text="Переименовано "/>,
                    flash: true
                })
            });
        };
    }

    handleSearch(event) {
        let searchQuery = event.target.value.toLowerCase();
        this.setState({searchQuery});
    }

    imageUpload(){
        let form = new FormData(this.refs.imageform);
        let files = this.refs.fileInput.files;
        let x, y=0;
        let all = files.length;
        let progr = document.createElement("DIV");
        progr.className ="progress-bar progress-bar-striped";
        progr.role = "progressbar";

        let bar = document.getElementById("bar");
        bar.className="progress";
        bar.style.cssText = "display: block;";
        bar.appendChild(progr);

        for(let i = 0; i<all; i++){

            form.delete('file');
            form.append('file', files[i]);
            fetch("/upload",{
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-CSRFToken': csrfToken()
            },
            body: form
        }).then(response => {
                if(response.status === 400){
                        activatePopUp({
                            child: <ErrorAlert text="Нет файла"/>,
                            flash: true
                        });
                        return response.status;
                    }
                if (!response.ok) {
                    activatePopUp({
                        child: <ErrorAlert text="Произошла ошибка. Попробуйте повторить попытку."/>,
                        flash: true
                    });
                    return response.status;
                }
                x=((i+1)/all)*100;
                progr.style.cssText = `width: ${x}%;`;
                progr.innerHTML = `${i+1} из ${all} Загружено`;
                y++;
                if(y===all){
                    activatePopUp({child: <h4 className="text-center">Загружено {y} из {all} файлов </h4> ,
                        confirm: true,
                        confirmAction: () => {
                                fetch("/refresh/",{
                                method: 'GET',
                                credentials: 'same-origin',
                                headers:{
                                    'X-CSRFToken': csrfToken()
                                }
                            })
                                    .then(response => response.json())
                                    .then(data => {
                                        this.setState({displayedImages: data});
                                        this.refs.filelable.innerHTML="";
                                        progr.style.cssText = "width: 0%;";
                                        bar.style.cssText = "display: none;";
                                    })
                        }
                    });
                }
            }).then()

        }
    }

    render() {
        const projects = this.props.projects;
        const filteredImages = this.state.displayedImages.filter(
            (el) => el.title.toLowerCase().indexOf(this.state.searchQuery) !==-1
        );
        return (
            <div>
                <div><h2>Загрузка фонов</h2></div>
                  <form ref="imageform"  className="form-inline"  enctype="multipart/form-data" >
                    <div className="row">
                      <div className="form-group col-lg-3">
                        <label><span>Выберите проект: </span>
                          <select name="project" className="form-control">
                              {projects.map(function(project) {
                                  return <option key={project.id} value={project.id}>{project.name}</option>;
                                })}
                          </select>
                        </label>
                      </div>
                        <br/>
                        <div className="form-group col-lg-6">
                                <button className="btn btn-default" data-bazooka="uploadButton">
                                    <i className="glyphicon glyphicon-cloud-upload"/> Выберите файлы
                                </button>
                                <input id="input" ref="fileInput" className="upload" type="file" name="file[]"
                                       accept="image/gif, image/jpeg, image/jpg, image/png" multiple="true" hidden="true"/>
                                <label id="custom-upload-button-label" ref="filelable" htmlFor="input"/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="form-group col-lg-3">
                        <input onClick={this.imageUpload} className="btn btn-primary"  value="Загрузить"/>
                      </div>
                        <div id="bar" ></div>
                    </div>
                  </form>
                  <hr/>
                <div className="form-inline">
                        <div className="form-group">
                            <input type="text" placeholder="Поиск..."
                                   className="form-control"
                                   onChange={this.handleSearch}
                            />
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
    const {imageArray,projects} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <ImagesList imageArray={ imageArray } projects={ projects }/>,
        node
    );
}
