import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import moment from 'moment';
import classNames from 'classnames';

const BAZOOKA_PREFIX = 'users';

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            removed: false,
            user: this.props.user
        };

        this.remove_user = this.remove_user.bind(this);
    }

    remove_user() {
        fetch(`/admin/users/${this.state.user.id}`, {
            method: 'DELETE',
            credentials: 'same-origin'
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
                console.error(response.message)
            });
    }

    render() {
        let {user, removed}= this.state;
        return (
            <tr className={classNames({'danger': removed})}>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{moment(user.registration_date).format("DD-MM-YYYY HH:mm")}</td>
                <td>{user.auth_by}</td>
                <td>
                    <a className={classNames('btn btn-default', {'disabled': removed})}><i
                        className="glyphicon glyphicon-pencil"/> Edit</a>
                    <a className={classNames('btn btn-default', {'disabled': removed})}
                       onClick={this.remove_user}><i className="glyphicon glyphicon-trash"/> Delete
                    </a>
                </td>
            </tr>
        );
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
                    />;
                })
            }
            </tbody>
        </table>
    </div>
};

export default function (node) {
    let {usersList} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <UsersList usersList={usersList}/>,
        node
    );
}