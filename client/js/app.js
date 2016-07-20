import inactiveImg from './admin/inactiveImg.js'
import deleteImg from './admin/deleteFromDB.js'
import reactTab from './admin/reactTab.jsx'


//var editor = require('./editor.js');
//var fabric = require('./fabmain.js');
var styluses = require('./../css/main.styl');
var Baz = require('bazooka');


Baz.register({
    'inactiveImg': inactiveImg,
    'deleteImg': deleteImg,
    'reactTab': reactTab
});


var unwatch = Baz.watch();

