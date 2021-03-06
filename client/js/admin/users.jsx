import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import moment from 'moment';
import classNames from 'classnames';
import {activatePopUp, deactivatePopUp} from '../popUp.js';
import {csrfToken} from '../helpers';

const BAZOOKA_PREFIX = 'users';

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user
        };

        this.showEditPopup = this.showEditPopup.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.reactivate = this.reactivate.bind(this);
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
                        user.active = false;
                        this.setState({
                            user: user
                        });
                    })
                    .catch((response) => {
                        console.error(response.message);
                        activatePopUp({
                            title: `Ошибка сервера`,
                            flash: true,
                        });
                    });
            }
        });
    }

    saveUser(e) {
        e.preventDefault();
        fetch(`/admin/users/${this.state.user.id}`, {
            method: 'POST',
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
                deactivatePopUp();
            })
            .catch((response) => {
                console.error(response.message);
                activatePopUp({
                    title: `Ошибка сервера`,
                    flash: true,
                });
            });
    }

    reactivate(e) {
        let {user} = this.state;
        e.preventDefault();
        fetch(`/admin/users/${user.id}`, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'X-CSRFToken': csrfToken()
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                user.active = true;
                this.setState({
                    user: user
                });
            })
            .catch((response) => {
                console.error(response.message);
                activatePopUp({
                    title: `Ошибка сервера`,
                    flash: true,
                });
            });
    }

    showEditPopup() {
        this.setState({isUserEditMode: true});
        let {user}= this.state;
        activatePopUp({
            title: "Изменение данных пользователя",
            closeAction: deactivatePopUp,
            child: <form className="form-horizontal" onSubmit={this.saveUser}>
                <div className='form-group'>
                    <label className="col-sm-2">Имя</label>
                    <div className="col-sm-10">
                        <input type="text" name="first_name" defaultValue={user.first_name}
                               className="form-control"/>
                    </div>
                </div>
                <div className='form-group'>
                    <label className="col-sm-2">Фамилия</label>
                    <div className="col-sm-10">
                        <input type="text" name="last_name" defaultValue={user.last_name}
                               className="form-control"/>
                    </div>
                </div>
                <div className='form-group'>
                    <label className="col-sm-2">Роль</label>
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
                    <button type="submit" className='btn btn-success'>Сохранить</button>
                    <a className='btn btn-default' onClick={deactivatePopUp}>Закрыть</a>
                </div>
            </form>
        });
    }

    render() {
        let {user}= this.state;
        return (
            <tr>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{moment(user.registration_date).format("DD-MM-YYYY HH:mm")}</td>
                <td>{user.auth_by}</td>
                <td>
                    <a className={classNames('btn btn-default btn-sm', {'hidden': !user.active})}
                       onClick={this.showEditPopup}><i className="glyphicon glyphicon-pencil"/> Изменить</a>
                    <a className={classNames('btn btn-danger btn-sm', {
                        'disabled': user.id === this.props.currentUserId,
                        'hidden': !user.active
                    })} onClick={this.removeUser}><i
                        className="glyphicon glyphicon-trash"/> Удалить
                    </a>
                    <a className={classNames('btn btn-default btn-sm', {'hidden': user.active})}
                       onClick={this.reactivate}><i className="glyphicon glyphicon-repeat"/> Восстановить
                    </a>
                </td>
            </tr>
        )
    }
}

const UsersList = (props) => (
    <div>
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
);

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
