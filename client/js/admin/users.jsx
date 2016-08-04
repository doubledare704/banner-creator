import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import moment from 'moment';
import classNames from 'classnames';
import {activatePopUp, deactivatePopUp} from '../popUp.js';

const BAZOOKA_PREFIX = 'users';

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            removed: false,
            user: this.props.user,
            isUserEditMode: false,
        };

        this.showEditPopup = this.showEditPopup.bind(this);
        this.rem = this.rem.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.onPopupClose = this.onPopupClose.bind(this);
    }

    rem() {
        let {user} = this.state;
        PopUp.change({
            title: `Вы действительно хотите удалить пользователя ${user.first_name} ${user.last_name}?`,
            confirm: true,
            flash: true,
            confirmAction: ()=> {
                fetch(`/admin/users/${this.state.user.id}`, {
                    method: 'DELETE',
                    credentials: 'same-origin',
                    data: `csrf_token=${encodeURIComponent(this.props.csrfToken)}`
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                        this.setState({
                            removed: true
                        })
                    })
                    .catch((response) => {
                        console.error(response.message);
                        PopUp.change({
                            title: `Ошибка сервера`,
                            confirm: false,
                            flash: true,
                        });
                    });
            }
        });
    }

    saveUser(e) {
        e.preventDefault();
        fetch(`/admin/users/${this.state.user.id}`, {
            method: 'PUT',
            credentials: 'same-origin',
            body: new FormData(event.target)
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((user)=> {
                this.setState({
                    user: user
                });
                this.onPopupClose()
            })
            .catch((response) => {
                console.error(response.message);
                activatePopUp({
                    title: `Ошибка сервера`,
                    confirm: false,
                    flash: true,
                });
            });
    }

    onPopupClose() {
        // this.setState({isUserEditMode: false})
        deactivatePopUp()
    }

    showEditPopup() {
        //     flash={false}>
        //     <form className="form-horizontal" onSubmit={this.saveUser}>
        //         <div className='form-group'>
        //             <input type="hidden" name="csrf_token" defaultValue={this.props.csrfToken}/>
        //         </div>
        //         <div className='form-group'>
        //             <label className="col-sm-2">First Name</label>
        //             <div className="col-sm-10">
        //                 <input type="text" name="first_name" defaultValue={user.first_name} className="form-control"/>
        //             </div>
        //         </div>
        //         <div className='form-group'>
        //             <label className="col-sm-2">Last Name</label>
        //             <div className="col-sm-10">
        //                 <input type="text" name="last_name" defaultValue={user.last_name} className="form-control"/>
        //             </div>
        //         </div>
        //         <div className='form-group'>
        //             <label className="col-sm-2">User role</label>
        //             <div className="col-sm-6">
        //                 <select name="role" className="form-control"
        //                         defaultValue={user.role}>
        //                     {
        //                         this.props.rolesList.map((role) => (
        //                                 <option value={role}>{role}</option>
        //                             )
        //                         )
        //                     }
        //                 </select>
        //             </div>
        //         </div>
        //         <div className='form-group'>
        //             <button type="submit" className='btn btn-success'>Save</button>
        //             <a className='btn btn-default' onClick={PopUp.onClose}>Close</a>
        //         </div>
        //     </form>
        // </PopUp>
        this.setState({isUserEditMode: true});
        let {user}= this.state;
        activatePopUp({
            confirm: true,
            title: "Изменение данных пользователя",
            flash: false,
            closeAction: this.onPopupClose,
            child: <div>
                <form className="form-horizontal" onSubmit={this.saveUser}>
                    <div className='form-group'>
                        <input type="hidden" name="csrf_token" defaultValue={this.props.csrfToken}/>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-2">First Name</label>
                        <div className="col-sm-10">
                            <input type="text" name="first_name" defaultValue={user.first_name}
                                   className="form-control"/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-2">Last Name</label>
                        <div className="col-sm-10">
                            <input type="text" name="last_name" defaultValue={user.last_name}
                                   className="form-control"/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="col-sm-2">User role</label>
                        <div className="col-sm-6">
                            <select name="role" className="form-control"
                                    defaultValue={user.role}>
                                {
                                    this.props.rolesList.map((role) => (
                                            <option value={role}>{role}</option>
                                        )
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className='form-group'>
                        <button type="submit" className='btn btn-success'>Save</button>
                        <a className='btn btn-default' onClick={this.onPopupClose}>Close</a>
                    </div>
                </form>
            </div>
        });
    }

    render() {
        let {user, removed, isUserEditMode}= this.state;
        return (
            <tr>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{moment(user.registration_date).format("DD-MM-YYYY HH:mm")}</td>
                <td>{user.auth_by}</td>
                <td>
                    <a className={classNames('btn btn-default', {'hidden': removed})}
                       onClick={this.showEditPopup}>
                        <i className="glyphicon glyphicon-pencil"/>
                        Edit
                    </a>
                    <a className={classNames('btn btn-danger', {
                        'disabled': user.id === this.props.currentUserId,
                        'hidden': removed
                    })} onClick={this.rem}><i
                        className="glyphicon glyphicon-trash"/> Delete
                    </a>
                    <a className={classNames('btn btn-default disabled', {'hidden': !removed})}><i
                        className="glyphicon glyphicon-remove"/> Deleted
                    </a>
                </td>
            </tr>
        )
    }
}

const UsersList = (props) => {
    return <div>
        <table className="table">
            <thead>
            <tr>
                <th>Name</th>
                <th>E-mail</th>
                <th>Role</th>
                <th>Registration date</th>
                <th>Auth by</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
                props.usersList.map((user) => {
                    return <User
                        key={`user_${user.id}`}
                        user={user}
                        rolesList={props.rolesList}
                        csrfToken={props.csrfToken}
                        currentUserId={props.currentUserId}
                    />;
                })
            }
            </tbody>
        </table>
    </div>
};

export default function (node) {
    let {usersList, usersRoles, csrfToken, currentUserId} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <UsersList
            usersList={usersList}
            rolesList={usersRoles}
            csrfToken={csrfToken}
            currentUserId={currentUserId}
        />,
        node
    );
}
