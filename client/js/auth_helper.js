import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'users';

function ConfigLoginPopup(social_type) {
    return (ev) => {
        ev.preventDefault();
        console.log(ev);
        const signinWin = window.open(`/login/${social_type}`, "SignIn", "width=780,height=410,toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0");
        setTimeout(() => CheckLoginStatus(signinWin), 2000);
        signinWin.focus();
        return false;
    }
}

function CheckLoginStatus(signinWin) {
    if (signinWin.closed) {
        location.reload();
    }
    else setTimeout(() => CheckLoginStatus(signinWin), 500);
}

function ConfigLogoutClick(csrfToken) {
    return (e) => {
        e.preventDefault();
        fetch('/logout', {
            method: 'POST',
            credentials: 'same-origin',
            body: 'csrf_token=' + encodeURIComponent(csrfToken)
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(({redirect_to})=> {
                location.href = redirect_to
            })
            .catch((response) => {
                console.error(response.message);
                popup.change({
                    title: `Ошибка сервера`,
                    confirm: false,
                    flash: true,
                });
            });
    }
}

export function loginClick(node) {
    const {socialNetwork} = h.getAttrs(BAZOOKA_PREFIX, node);
    node.onclick = ConfigLoginPopup(socialNetwork);
}

export function logoutClick(node) {
    const {csrfToken} = h.getAttrs(BAZOOKA_PREFIX, node);
    node.onclick = ConfigLogoutClick(csrfToken);
}
