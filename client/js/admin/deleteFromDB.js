var infoClicked = function (ev) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            if (length.ev.target.id > 0) {
                var img = document.getElementsByClassName(ev.target.id);
                img[0].style.display = "none";
            }
        }
    };
    xhttp.open("POST", "/admin/deleteImg/" + ev.target.id, true);
    xhttp.send(null);

};

function deleteImg(node) {
    node.onclick = infoClicked;
}

module.exports = {
    bazFunc: deleteImg,
};