var infoClicked = function (ev) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var img = document.getElementsByClassName(ev.target.id);
            var table = document.getElementById("inactiveImg").tBodies[0];

            table.appendChild(img[0]);
        }
    };
    xhttp.open("POST",  "/admin/inactiveImg/" + ev.target.id, true);
    xhttp.send(null);
};

function inactiveImg(node) {
    node.onclick = infoClicked;
}

module.exports = {
    bazFunc: inactiveImg,
};