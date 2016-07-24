import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';


const BAZOOKA_PREFIX = 'backgrounds-admin';


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

    handleTableRowRemove(tablerow) {
      this.props.onTableRowRemove(tablerow);
    }

    render() {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.props.backgrounds.map((tablerow) => {
                        if ( tablerow.active === this.props.backgroundStatus ) {
                            return <TableRow
                                key={tablerow.id}
                                tablerow={tablerow}
                                onTableRowDelete={this.handleTableRowRemove}
                                inactiveOrDelete={this.props.inactiveOrDelete}
                            />
                        }

                    })
                }
                </tbody>
            </table>
        );
    }
}


class BackgroundsAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.inactiveTabClick = this.inactiveTabClick.bind(this);
        this.activeTabClick = this.activeTabClick.bind(this);
        this.handleTableRowRemove = this.handleTableRowRemove.bind(this);

        this.state = {
            backgrounds: this.props.backgroundsArray,
            backgroundStatus: true,
            firstTabClassName: "active",
            secondTabClassName: "inactive",
            inactiveOrDelete: " Inactive"
        };
    }

    inactiveTabClick() {
        this.setState({
            backgroundStatus: false,
            firstTabClassName: "inactive",
            secondTabClassName: "active",
            inactiveOrDelete: " Delete"
        });
    }

    activeTabClick() {
        this.setState({
            backgroundStatus: true,
            firstTabClassName: "active",
            secondTabClassName: "inactive",
            inactiveOrDelete: " Inactive"
        });
    }

    handleTableRowRemove( tablerow ) {
        const index = this.state.backgrounds.indexOf(tablerow);

        //if the background is active, we change status on inactive
        if (tablerow.active === true) {
            fetch(
                `/admin/inactiveImg/` + this.state.backgrounds[index].id,
                {method: "POST"}
            ).then( (response) => {
                if (response.status === 200) {
                    this.state.backgrounds[index].active = false;
                    this.setState({backgrounds: this.state.backgrounds});
                }
            });

        //if the background is inactive we delete this background from DB
        } else {
            fetch(
                `/admin/deleteImg/` + this.state.backgrounds[index].id,
                {method: "POST"}
            ).then( (response) => {
                if (response.status === 204) {
                    this.state.backgrounds.splice(index, 1);
                    this.setState({backgrounds: this.state.backgrounds});
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
                <Table
                    backgroundStatus={this.state.backgroundStatus}
                    backgrounds={this.state.backgrounds}
                    onTableRowRemove={this.handleTableRowRemove}
                    inactiveOrDelete={this.state.inactiveOrDelete}
                />
            </div>
        );
    }
}


export default (node) => {
    let {backgrounds} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <BackgroundsAdmin backgroundsArray = {backgrounds} />,
        node
    );
}