import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import moment from 'moment';

const BAZOOKA_PREFIX = 'users';


class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
                this.props.update();
            })
            .catch(response => {
                console.log(response.statusText)
            });
    }

    render() {
        return (
            <tr>
                <td>{this.state.user.first_name} {this.state.user.last_name}</td>
                <td>{this.state.user.email}</td>
                <td>{this.state.user.role}</td>
                <td>{moment(this.state.user.registration_date).format("DD-MM-YYYY HH:mm")}</td>
                <td>{this.state.user.auth_by}</td>
                <td>
                    <button className="btn btn-default"><i className="glyphicon glyphicon-pencil"/> Edit</button>
                    <a href="#openModal" className="btn btn-default" onClick={this.remove_user}><i
                        className="glyphicon glyphicon-trash"/> Delete
                    </a>
                </td>
            </tr>
        );
    }
}

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
                        update={this.updateList}
                        user={user}
                    />;
                })
            }
            </tbody>
        );
    }
}

export default function (node) {
    let {usersList} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
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
            <UsersList usersList={usersList}/>
        </table>,
        node
    );
}