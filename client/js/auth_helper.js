function showLoginPopup(ev) {
    console.log(ev);
    const signinWin = window.open(`/login/${ev.target.dataset.usersSocialNetwork}`, "SignIn", "width=780,height=410,toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0");
    setTimeout(() => CheckLoginStatus(signinWin), 2000);
    signinWin.focus();
    return false;
}

function CheckLoginStatus(signinWin) {
    if (signinWin.closed) {
        location.reload();
    }
    else setTimeout(() => CheckLoginStatus(signinWin), 500);
}

function loginClick(node) {
    node.onclick = showLoginPopup;
}

module.exports = {
    bazFunc: loginClick,
};