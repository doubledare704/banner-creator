import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import moment from 'moment';
import classNames from 'classnames';
import {activatePopUp, deactivatePopUp} from '../popUp.js';
import csrfToken from '../csrfHelper.js'

const BAZOOKA_PREFIX = 'users';

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            removed: false,
            user: this.props.user
        };

        this.showEditPopup = this.showEditPopup.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.saveUser = this.saveUser.bind(this);
    }

    removeUser() {
        let {user} = this.state;
        activatePopUp({
            title: `Вы действительно хотите удалить пользователя ${user.first_name} ${user.last_name}?`,
            confirm: true,
            confirmAction: ()=> {
                fetch(`/admin/users/${this.state.user.id}`, {
                    method: 'DELETE',
                    credentials: 'same-origin',
                    headers: {
                        'X-CSRFToken': csrfToken()
                    }
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
                        activatePopUp({
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
            headers: {
                'X-CSRFToken': csrfToken()
            },
            body: new FormData(e.target)
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
                deactivatePopUp()
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

    showEditPopup() {
        this.setState({isUserEditMode: true});
        let {user}= this.state;
        activatePopUp({
            confirm: false,
            title: "Изменение данных пользователя",
            closeAction: deactivatePopUp,
            child: <form className="form-horizontal" onSubmit={this.saveUser}>
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
                    <div className='form-group text-center'>
                        <button type="submit" className='btn btn-success'>Save</button>
                        <a className='btn btn-default' onClick={deactivatePopUp}>Close</a>
                    </div>
                </form>
        });
    }

    render() {
        let {user, removed}= this.state;
        return (
            <tr>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{moment(user.registration_date).format("DD-MM-YYYY HH:mm")}</td>
                <td>{user.auth_by}</td>
                <td>
                    <a className={classNames('btn btn-default btn-sm', {'hidden': removed})}
                       onClick={this.showEditPopup}><i className="glyphicon glyphicon-pencil"/> Изменить</a>
                    <a className={classNames('btn btn-danger btn-sm', {
                        'disabled': user.id === this.props.currentUserId,
                        'hidden': removed
                    })} onClick={this.removeUser}><i
                        className="glyphicon glyphicon-trash"/> Удалить
                    </a>
                    <a className={classNames('btn btn-default disabled', {'hidden': !removed})}><i
                        className="glyphicon glyphicon-remove"/>Удалено
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
                <th>Имя</th>
                <th>E-mail</th>
                <th>Роль</th>
                <th>Дата регистрации</th>
                <th>Соцсеть</th>
                <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            {
                props.usersList.map((user) => {
                    return <User
                        key={`user_${user.id}`}
                        user={user}
                        rolesList={props.rolesList}
                        currentUserId={props.currentUserId}
                    />;
                })
            }
            </tbody>
        </table>
    </div>
};

export default function (node) {
    let {usersList, usersRoles, currentUserId} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <UsersList
            usersList={usersList}
            rolesList={usersRoles}
            currentUserId={currentUserId}
        />,
        node
    );
}
