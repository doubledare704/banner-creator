import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'header';


export default function (node) {
    let {backgroundsArray} = h.getAttrs(BAZOOKA_PREFIX, node);

    const ActivePictures = React.createClass({displayName: 'active_section',
        render: function() {
            console.log('click');
            return (
                <li className="active" onClick={this.props.onClickAct}><a data-toggle="tab" href="#active-pictures">Активные картинки</a></li>
            );
        }
    });


    const InactivePictures = React.createClass({displayName: 'active_section',
        render: function() {
            return (
                <li className="inactive" onClick={this.props.onClickInAct}><a data-toggle="tab" href="#inactive-pictures">Неактивные картинки</a></li>
            );
        }
    });


    const Table = React.createClass({displayName: 'table',
        render: function() {
            return (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                       this.props.backgrounds.map(function(el) {
                            return
                            <tr className={el.title}>
                                <td>
                                    {el.title}{el.active}
                                </td>
                                <td>
                                    <img className="img-responsive" src={el.url} alt="cat" width="150" height="100" />
                                </td>
                                <td>

                                    <button className="btn btn-default">
                                        <i className="glyphicon glyphicon-trash"/>
                                        <i>Delete</i>
                                    </button>
                                </td>
                           </tr>;
                        })
                    }
                    </tbody>
                </table>
            );
        }
    });


    const Head = React.createClass({

        getInitialState: function() {
            var backgrounds = backgroundsArray.filter(function(el) {
                if ( el.active == 'True' ) {
                    return el;
                }
            });

            return { backgrounds : backgrounds
            };
        },


        inactiveTabClick: function() {
            var backgrounds = backgroundsArray.filter(function(el) {
                if ( el.active == 'False' ) {
                    return el;
                }
            });
            this.setState({
                backgrounds: backgrounds
            });

        },


        activeTabClick: function() {
            var backgrounds = backgroundsArray.filter(function(el) {
                if ( el.active == 'True' ) {
                    return el;
                }
            });
            this.setState({
                backgrounds: backgrounds
            });

        },


        render: function() {
            var activeTabClick = this.activeTabClick;
            var inactiveTabClick = this.inactiveTabClick;

            return (
                <div>
                    <ul className= "nav nav-tabs">
                        <ActivePictures onClickAct={activeTabClick}/>
                        <InactivePictures onClickInAct={inactiveTabClick}/>
                    </ul>
                    <Table backgrounds={this.state.backgrounds}/>
                </div>
            );
        }
    });


    ReactDOM.render(
        <Head />,
        node
    );
}