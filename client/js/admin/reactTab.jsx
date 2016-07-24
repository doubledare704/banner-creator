import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';


const BAZOOKA_PREFIX = 'header';


export default function (node) {
    let {backgroundsArray} = h.getAttrs(BAZOOKA_PREFIX, node);
    

    let Tab = React.createClass({
        render: function() {
            return (
                <li className={this.props.name} onClick={this.props.onClick}><a data-toggle="tab" href={'#'+this.props.name}>{this.props.title}</a></li>
            );
        }
    });

        let ActivePictures = React.createClass({displayName: 'active_section',
        render: function() {
            return (
                <li className="active" onClick={this.props.onClick}><a data-toggle="tab" href="#active-pictures">Активные картинки</a></li>
            );
        }
    });


    let InactivePictures = React.createClass({displayName: 'active_section',
        render: function() {
            return (
                <li className="inactive" onClick={this.props.onClick}><a data-toggle="tab" href="#inactive-pictures">Неактивные картинки</a></li>
            );
        }
    });


    let TableRow = React.createClass({

        handleTableRowRemove: function() {
          this.props.onTableRowDelete( this.props.tablerow );
          return false;
        },

        render: function() {
            let onClickAction = this.onClickDel;

            return (
                <tr className={this.props.tablerow.active} >
                    <td>
                        {this.props.tablerow.title}{this.props.tablerow.active}
                    </td>
                    <td>
                        <img src={this.props.tablerow.preview} alt="cat" />
                    </td>
                    <td>
                        <button className="btn btn-default" onClick={this.handleTableRowRemove}>
                            <i className="glyphicon glyphicon-trash"/>
                            <i>Delete</i>
                        </button>
                    </td>
               </tr>
            );
        }
    });


    let Table = React.createClass({displayName: 'table',

        handleTableRowRemove: function(tablerow){
          this.props.onTableRowRemove( tablerow );
        },

        render: function() {
            let tablerows = [];
            let that = this;
            this.props.backgrounds.forEach(function(tablerow) {
                tablerows.push(<TableRow key={tablerow.id} tablerow={tablerow} onTableRowDelete={that.handleTableRowRemove} /> );
            });

            return (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>{tablerows}</tbody>
                </table>
            );
        }
    });


    let Head = React.createClass({

        getInitialState: function() {
            let backgrounds = backgroundsArray.filter(function(el) {
                if ( el.active == 'True' ) {
                    return el;
                }
            });

            return {
                backgrounds : backgrounds
            };
        },


        inactiveTabClick: function() {
            let backgrounds = backgroundsArray.filter(function(el) {
                if ( el.active == 'False' ) {
                    return el;
                }
            });
            this.setState({
                backgrounds: backgrounds
            });

        },


        activeTabClick: function() {
            let backgrounds = backgroundsArray.filter(function(el) {
                if ( el.active == 'True' ) {
                    return el;
                }
            });
            this.setState({
                backgrounds: backgrounds
            });

        },


        render: function() {
            return (
                <div>
                    <ul className= "nav nav-tabs">
                        <Tab onClick={this.activeTabClick} name="active" title="Активные фоны"/>
                        <Tab onClick={this.inactiveTabClick} name="inactive" title="Неактивные фоны"/>
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