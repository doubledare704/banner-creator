import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import moment from 'moment';

const BAZOOKA_PREFIX = 'users';


class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: true,
            user: this.props.user
        };

        this.remove_user = this.remove_user.bind(this);
    }

    remove_user() {
        fetch(`/admin/users/${this.state.user.id}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
            })
            .then(() => {
                this.setState({
                    active: false
                });
            })
            .catch(response => {
                console.log(response.statusText)
            });
    }

    render() {
        return (
            <tr className={this.state.active ? '' : 'danger'}>
                <td>{this.state.user.first_name} {this.state.user.last_name}</td>
                <td>{this.state.user.email}</td>
                <td>{this.state.user.role}</td>
                <td>{moment(this.state.user.registration_date).format("DD-MM-YYYY HH:mm")}</td>
                <td>{this.state.user.auth_by}</td>
                <td>
                    <a className={this.state.active ? "btn btn-default" : "btn btn-default disabled"}><i
                        className="glyphicon glyphicon-pencil"/> Edit</a>
                    <a className={this.state.active ? "btn btn-default" : "btn btn-default disabled"}
                       onClick={this.remove_user}><i
                        className="glyphicon glyphicon-trash"/> Delete
                    </a>
                </td>
            </tr>
        );
    }
}

// will contain not only table, 2 popups (for user editing and remove confirm) too
class UsersList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: this.props.usersList
        };

        this.changeState = this.changeState.bind(this);
        this.updateList = this.updateList.bind(this);
    }

    changeState(new_state) {
        this.setState({
            users: new_state
        });
    }

    updateList() {
        fetch('/admin/users.json', {
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response
            })
            .then(response => {
                response.json().then(json => {
                    this.changeState(json)
                })
            })
            .catch(response => {
                console.log(response)
            });
    }

    render() {
        return (
            <tbody>
            {
                this.state.users.map(user => {
                    return <User
                        key={`user_${user.id}`}
                        update={this.updateList}
                        user={user}
                    />;
                })
            }
            </tbody>
        );
    }
}


class UsersPanel extends React.Component {
    render() {
        return (
            <div>
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
                    <UsersList
                        usersList={this.props.usersList}
                    />
                </table>
            </div>
        );
    }
}

export default function (node) {
    let {usersList} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <UsersPanel usersList={usersList}/>,
        node
    );
}