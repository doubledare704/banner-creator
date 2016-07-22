import inactiveImg from './admin/inactiveImg.js';
import deleteImg from './admin/deleteFromDB.js';
import reactTab from './admin/reactTab.jsx';
import header from './header.jsx';
import renderImages from './renderImages.jsx';

var Baz = require('bazooka');

Baz.register({
    'inactiveImg': inactiveImg,
    'deleteImg': deleteImg,
    'reactTab': reactTab,
    'header': header,
    'renderImages': renderImages
});


var unwatch = Baz.watch();