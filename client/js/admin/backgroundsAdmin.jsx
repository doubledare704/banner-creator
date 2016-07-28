import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import {popup} from './popUp.js';


const BAZOOKA_PREFIX = 'backgrounds-admin';
const TABS = {
     active: "Активные фоны",
    inactive: "Неактивные фоны"
};

class Button extends React.Component {
    render() {
        return (
            <button className="btn btn-default" onClick={this.props.clickAction}>
                <i>{this.props.name}</i>
            </button>
        )
    }
}


class Tab extends React.Component {
    render() {
        const activeClass = (this.props.isSelected ? 'active' : '');

        return (
            <li className={activeClass} onClick={this.props.onClick( this.props.name )}><a data-toggle="tab" href={'#'+this.props.name}>{this.props.title}</a></li>

        );
    }
}


class TableRow extends React.Component {

    constructor(props) {
        super(props);
        this.addActivateButton = this.addActivateButton.bind(this);
    }

    //if background is inactive, we add the button which activate them
    addActivateButton() {
        if ( !this.props.tablerow.active ) {
            return <Button name="Activate" clickAction={this.props.onRowActivate(this.props.tablerow)}/>
        }
    }

    render() {
        const buttonName = this.props.backgroundStatus ? "Inactivate" : "Delete";

        return (
            <tr className={this.props.tablerow.active} >
                <td>
                    {this.props.tablerow.title}
                </td>
                <td>
                    <img src={this.props.tablerow.preview} alt="cat" />
                </td>
                <td>
                    <Button name={buttonName} clickAction={this.props.onTableRowDelete(this.props.tablerow)}/>
                </td>
                <td>
                    {this.addActivateButton()}
                </td>
           </tr>
        );
    }
}


class Table extends React.Component {
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
                    this.props.backgrounds.map((tablerow) =>
                            <TableRow
                                key={tablerow.id}
                                tablerow={tablerow}
                                onTableRowDelete={this.props.onTableRowRemove}
                                backgroundStatus={this.props.backgroundStatus}
                                onRowActivate={this.props.onTableRowActivate}
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

        this.state = {
            backgrounds: this.props.backgroundsArray,
            selectedTab: "active"
        };
    }

    tabClick = (key) => {
        return () => {
            this.setState({
                selectedTab: key
            });
        }
    };

    handleTableRowRemove = (tablerow) => {
        return () => {
            const index = this.state.backgrounds.indexOf(tablerow);

            //if the background is active, we change status on inactive
            if (tablerow.active === true) {
                fetch(
                    `/admin/inactivate_image/` + this.state.backgrounds[index].id,
                    {method: "POST"}
                ).then((response) => {
                    if (response.status === 200) {
                        this.state.backgrounds[index].active = false;
                        this.setState({backgrounds: this.state.backgrounds});
                        popup({
                            data: "Фон стал неактивным"
                        });
                    }
                });

                //if the background is inactive we delete this background from DB
            } else {
                popup({
                        data: "Вы действительно хотите удалить картинку?",
                        confirm: true,
                        confirmAction:
                            () => {
                                fetch(
                                    `/admin/delete_image/` + this.state.backgrounds[index].id,
                                    {method: "POST"}
                                ).then((response) => {
                                    if (response.status === 204) {
                                        this.state.backgrounds.splice(index, 1);
                                        this.setState({backgrounds: this.state.backgrounds});
                                    }
                                });
                            }
                });

            }
        }
    };

    //change the status of background to "active"
    handleActivateRow = (tablerow) => {
        return () => {
            const index = this.state.backgrounds.indexOf(tablerow);

            fetch(
                `/admin/activate_image/` + this.state.backgrounds[index].id,
                {method: "POST"}
            ).then((response) => {
                if (response.status === 200) {
                    this.state.backgrounds[index].active = true;
                    this.setState({backgrounds: this.state.backgrounds});
                    popup({
                        data: "Фон стал активным"
                    });
                }
            });
        }
    };

    render() {
        const status = (this.state.selectedTab === 'active');
        return (
            <div>
                <ul className= "nav nav-tabs">
                    {Object.keys(TABS).map((key) =>
                            <Tab key={key} onClick={this.tabClick} name={key} title={TABS[key]} isSelected={this.state.selectedTab === key}/>
                    )}
                </ul>
                <Table
                    backgroundStatus={status}
                    backgrounds={this.state.backgrounds.filter((background) => {
                         return  background.active === (this.state.selectedTab === 'active');
                    })}
                    onTableRowRemove={this.handleTableRowRemove}
                    onTableRowActivate={this.handleActivateRow}
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