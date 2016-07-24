import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';


const BAZOOKA_PREFIX = 'header';


class Tab extends React.Component {
    render() {
        return (
            <li className={this.props.name} onClick={this.props.onClick}><a data-toggle="tab" href={'#'+this.props.name}>{this.props.title}</a></li>
        );
    }
}


class TableRow extends React.Component {

    constructor(props) {
        super(props);
        this.handleTableRowRemove = this.handleTableRowRemove.bind(this);
    }

    handleTableRowRemove() {
      this.props.onTableRowDelete( this.props.tablerow );
      return false;
    }

    render() {
        let onClickAction = this.onClickDel;

        return (
            <tr className={this.props.tablerow.active} >
                <td>
                    {this.props.tablerow.title}
                </td>
                <td>
                    <img src={this.props.tablerow.preview} alt="cat" />
                </td>
                <td>
                    <button className="btn btn-default" onClick={this.handleTableRowRemove}>
                        <i className="glyphicon glyphicon-trash"/>
                        <i>{this.props.inactiveOrDelete}</i>
                    </button>
                </td>
           </tr>
        );
    }
}


class Table extends React.Component {

    constructor(props) {
        super(props);

        this.handleTableRowRemove = this.handleTableRowRemove.bind(this);
    }

    handleTableRowRemove(tablerow){
      this.props.onTableRowRemove( tablerow );
    }

    render() {
        let tablerows = [];
        let that = this;
        this.props.backgrounds.forEach(function(tablerow) {
            tablerows.push(<TableRow key={tablerow.id} tablerow={tablerow} onTableRowDelete={that.handleTableRowRemove} inactiveOrDelete={that.props.inactiveOrDelete}/> );
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
}


class Head extends React.Component {
    constructor(props) {
        super(props);

        this.inactiveTabClick = this.inactiveTabClick.bind(this);
        this.activeTabClick = this.activeTabClick.bind(this);
        this.activeBackgrounds = this.activeBackgrounds.bind(this);
        this.inactiveBackgrounds = this.inactiveBackgrounds.bind(this);
        this.handleTableRowRemove = this.handleTableRowRemove.bind(this);

        this.state = {
            globalBackgrounds: this.props.backgroundsArray,
            backgrounds: this.props.backgroundsArray.filter(function(el) {
                if ( el.active == 'True' ) {
                    return el;
                }
            }),
            firstTabClassName: "active",
            secondTabClassName: "inactive",
            inactiveOrDelete: " Inactive"
        };
    }


    activeBackgrounds() {
        return this.state.globalBackgrounds.filter(function(el) {
            if ( el.active == 'True' ) {
                return el;
            }
        });
    }

    inactiveBackgrounds() {
        return this.state.globalBackgrounds.filter(function(el) {
            if ( el.active == 'False' ) {
                return el;
            }
        });
    }

    inactiveTabClick() {
        this.setState({
            backgrounds: this.inactiveBackgrounds(),
            firstTabClassName: "inactive",
            secondTabClassName: "active",
            inactiveOrDelete: " Delete"
        });
    }

    activeTabClick() {
        this.setState({
            backgrounds: this.activeBackgrounds(),
            firstTabClassName: "active",
            secondTabClassName: "inactive",
            inactiveOrDelete: " Inactive"
        });
    }

    handleTableRowRemove( tablerow ) {
        let index = -1;
        let clength = this.state.backgrounds.length;

        for( var i = 0; i < clength; i++ ) {
            if( this.state.backgrounds[i].id === tablerow.id ) {
                index = i;
                break;
            }
        }

        let that = this;

        if ( tablerow.active == 'True' ) {
            fetch(
                `/admin/inactiveImg/` + that.state.backgrounds[index].id,
                { method: "POST" }
            ).then(function (response) {
                if ( response.status == 200 ) {
                    that.state.backgrounds[index].active = "False";
                    that.state.backgrounds.splice( index, 1 );
                    that.setState( {backgrounds: that.state.backgrounds} );
                }
            });

        } else {
            fetch(
                `/admin/deleteImg/` + that.state.backgrounds[index].id,
                { method: "POST" }
            ).then(function (response) {
                if ( response.status == 204 ) {
                    let clength = that.state.globalBackgrounds.length;

                    for (var i = 0; i < clength; i++) {
                        if (that.state.globalBackgrounds[i].id === tablerow.id) {
                            that.state.globalBackgrounds.splice(i, 1);
                            break;
                        }
                    }

                    that.state.backgrounds.splice(index, 1);
                    that.setState({
                        globalBackgrounds: that.state.globalBackgrounds,
                        backgrounds: that.state.backgrounds
                    });
                }
            });
        }

    }


    render() {
        return (
            <div>
                <ul className= "nav nav-tabs">
                    <Tab onClick={this.activeTabClick} name={this.state.firstTabClassName} title="Активные фоны"/>
                    <Tab onClick={this.inactiveTabClick} name={this.state.secondTabClassName} title="Неактивные фоны"/>
                </ul>
                <Table backgrounds={this.state.backgrounds} onTableRowRemove={this.handleTableRowRemove} inactiveOrDelete={this.state.inactiveOrDelete}/>
            </div>
        );
    }
}


export default function (node) {
    let {backgroundsArray} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <Head backgroundsArray = {backgroundsArray} />,
        node
    );
}