import inactiveImg from './admin/inactiveImg.js';
import deleteImg from './admin/deleteFromDB.js';
import header from './header.jsx';
import renderImages from './renderImages.jsx';
var styluses = require('./../css/main.styl');
var Baz = require('bazooka');


Baz.register({
    'inactiveImg': inactiveImg,
    'deleteImg': deleteImg,
    'header': header,
    'renderImages':renderImages
});


var unwatch = Baz.watch();