import {h} from 'bazooka';
import {csrfToken} from './helpers';
import {activatePopUp} from './popUp.js';

const BAZOOKA_PREFIX = 'users';

function ConfigLoginPopup(socialType) {
    return (ev) => {
        ev.preventDefault();
        const signinWin = window.open(`/login/${socialType}`, "SignIn", "width=780,height=410,toolbar=0," +
            "scrollbars=0,status=0,resizable=0,location=0,menuBar=0");
        setTimeout(() => CheckLoginStatus(signinWin), 2000);
        signinWin.focus();
        return false;
    };
}

function CheckLoginStatus(signinWin) {
    if (signinWin.closed) {
        location.reload();
    }
    else setTimeout(() => CheckLoginStatus(signinWin), 500);
}

function LogoutClick(e) {
    e.preventDefault();
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'X-CSRFToken': csrfToken()
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(({redirectTo})=> {
            location.href = redirectTo;
        })
        .catch((response) => {
            console.error(response.message);
            activatePopUp({
                title: `Ошибка сервера`,
                flash: true,
            });
        });
}

export function loginClick(node) {
    const {socialNetwork} = h.getAttrs(BAZOOKA_PREFIX, node);
    node.onclick = ConfigLoginPopup(socialNetwork);
}

export function logoutClick(node) {
    node.onclick = LogoutClick;
}
