import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';


const BAZOOKA_PREFIX = 'backgrounds-admin';


class Tab extends React.Component {

    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
    }

    click() {
      this.props.onClick( this.props.name );
      return false;
    }

    render() {
        const activeClass = (this.props.isSelected ? 'active' : '');

        return (
            <li className={activeClass} onClick={this.click}><a data-toggle="tab" href={'#'+this.props.name}>{this.props.title}</a></li>

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
                        <i>{this.props.inactiveOrDeleteButton}</i>
                    </button>
                </td>
           </tr>
        );
    }
}


class Table extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const buttonName = this.props.backgroundStatus ? "Inactive" : "Delete";

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
                    this.props.backgrounds.map((tablerow) =>
                            <TableRow
                                key={tablerow.id}
                                tablerow={tablerow}
                                onTableRowDelete={this.props.onTableRowRemove}
                                inactiveOrDeleteButton={buttonName}
                            />
                    )
                }
                </tbody>
            </table>
        );
    }
}


class BackgroundsAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.handleTableRowRemove = this.handleTableRowRemove.bind(this);
        this.tabClick = this.tabClick.bind(this);

        this.state = {
            backgrounds: this.props.backgroundsArray,
            selectedTab: "active"
        };
    }

    tabClick(key) {
        this.setState({
            selectedTab: key
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
        const TABS = {
             active: "Активные фоны",
            unactive: "Неактивные фоны"
        };

        return (
            <div>
                <ul className= "nav nav-tabs">
                    {Object.keys(TABS).map((key) =>
                            <Tab key={key} onClick={this.tabClick} name={key} title={TABS[key]} isSelected={this.state.selectedTab === key}/>
                    )}
                </ul>
                <Table
                    backgroundStatus={this.state.selectedTab === 'active'}
                    backgrounds={this.state.backgrounds.filter((background) => {
                         return  background.active === (this.state.selectedTab === 'active');
                    })}
                    onTableRowRemove={this.handleTableRowRemove}
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