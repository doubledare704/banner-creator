import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import {ImagesList, Image} from '../images/renderImages.jsx';
import {activatePopUp} from '../popUp.js';
import {csrfToken} from '../helpers';

const BAZOOKA_PREFIX = 'backgrounds';

class Backgrounds extends ImagesList {

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
        console.log(this.state.displayedImages);
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
                        title: <h2 className="text-center">Что-то не так, ошибка: {response.status} </h2>
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
                    title: <h2 className="text-center"> Удален </h2>,
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
                        title: <h2 className="text-center">Что-то не так, ошибка: {response.status} </h2>
                    });
                    return response.status;
                }

                const renameEl = this.props.imageArray.filter(
                    el => (el.id == id)
                );
                renameEl[0].title = title;
                this.setState({displayedImages: this.props.imageArray});
                activatePopUp({
                    title: <h2 className="text-center"> Переименовано </h2>,
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
        const filteredImages = this.props.imageArray.filter((el) => el.title.toLowerCase().indexOf(this.state.searchQuery) !== -1);
        return (
            <div>
                <div><h2>Загрузка фонов</h2></div>
                <form id="image-form" className="form-inline" formEncType="multipart/form-data">
                    <div className="row">
                        <div className="form-group col-lg-6">
                                <button className="btn btn-default" data-bazooka="uploadButton">
                                    <i className="glyphicon glyphicon-cloud-upload"/> Выберите файлы
                                </button>
                                <input id="input" className="upload" type="file" name="file[]"
                                       accept="image/gif, image/jpeg, image/jpg, image/png" multiple="true" hidden="true"/>
                                <label id="custom-upload-button-label" htmlFor="input"/>
                        </div>
                        <div>
                            <input name="project" hidden="true" value={this.props.projectId}/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="form-group col-lg-3">
                            <input data-bazooka="uploadFiles" className="btn btn-primary" type="submit"
                                   value="Загрузить"/>
                        </div>
                        <div id="demo"></div>
                    </div>
                </form>
                <hr/>
                <div className="form-inline">
                    <div className="form-group">
                        <input type="text" placeholder="Поиск..." className="form-control"
                               onChange={this.handleSearch}/>
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

    export default function (node) {
        const {imageArray, projectId} = h.getAttrs(BAZOOKA_PREFIX, node);

        ReactDOM.render(
        <Backgrounds imageArray={imageArray} projectId={projectId}/>,
        node
        );
    }
