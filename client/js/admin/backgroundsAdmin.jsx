import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import {activatePopUp} from '../popUp.js';
import csrfToken from '../csrfHelper.js';


const BAZOOKA_PREFIX = 'backgrounds-admin';

class Button extends React.Component {
    render() {
        return (
            <button className="btn btn-default" onClick={this.props.clickAction}>
                <i>{this.props.name}</i>
            </button>
        )
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
            return <Button name="Активировать" clickAction={this.props.onRowActivate(this.props.tablerow)}/>
        }
    }

    render() {
        const buttonName = this.props.backgroundStatus ? "Деактивировать" : "Удалить";

        return (
            <tr>
                <td>
                    {this.props.tablerow.title}
                </td>
                <td>
                    <img src={this.props.tablerow.preview} alt="cat" />
                </td>
                <td className="for-delete">
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
            <table className="table text-center" id="backgrounds-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Картинка</th>
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
            backgrounds: this.props.backgrounds
        };
    }

    handleTableRowRemove = (tablerow) => {
        return () => {

            //if the background is active, we change status on inactive
            if (tablerow.active === true) {
                const index = this.state.backgrounds.indexOf(tablerow);

                fetch(`/admin/inactivate_image/${this.state.backgrounds[index].id}`,{
                    credentials: 'same-origin',
                    method: "POST",
                    headers: {
                        'X-CSRFToken': csrfToken()
                    }
                })
                    .then((response) => {
                    if (response.status === 200) {
                        activatePopUp({
                            title: "Фон стал неактивным",
                            flash: true
                        });
                        this.state.backgrounds.splice(index, 1);
                        this.setState({
                            backgrounds: this.state.backgrounds
                        });
                    }
                });

            //if the background is inactive we delete this background from DB
            } else {
                const index = this.state.backgrounds.indexOf(tablerow);

                activatePopUp({
                        title: "Вы действительно хотите удалить картинку?",
                        confirm: true,
                        confirmAction:
                            () => {
                                fetch(`/admin/delete_image/${this.state.backgrounds[index].id}`,{
                                    credentials: 'same-origin',
                                    method: "POST",
                                    headers: {
                                        'X-CSRFToken': csrfToken()
                                    },
                                })
                                    .then((response) => {
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

            fetch(`/admin/activate_image/${this.state.backgrounds[index].id}`,{
                credentials: 'same-origin',
                method: "POST",
                headers: {
                'X-CSRFToken': csrfToken()
                }
            })
                .then((response) => {
                if (response.status === 200) {
                    activatePopUp({
                        title: "Фон стал активным",
                        flash: true
                    });
                    this.state.backgrounds.splice(index, 1);
                    this.setState({
                        backgrounds: this.state.backgrounds
                    });
                }
            });
        }
    };

    render() {
        const status = (this.props.selectedTab === 'active');
        return (
            <div>
                <Table
                    backgroundStatus={status}
                    backgrounds={this.state.backgrounds}
                    onTableRowRemove={this.handleTableRowRemove}
                    onTableRowActivate={this.handleActivateRow}
                />
            </div>
        );
    } 
}

export default (node) => {
    let {backgrounds} = h.getAttrs(BAZOOKA_PREFIX, node);
    let {tab} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(

        <BackgroundsAdmin backgrounds = {backgrounds} selectedTab={tab}/>,
        node
    );
}
