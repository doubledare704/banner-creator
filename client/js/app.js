import inactiveImg from './admin/inactiveImg.js'
import deleteImg from './admin/deleteFromDB.js'


//var editor = require('./editor.js');
//var fabric = require('./fabmain.js');
var styluses = require('./../css/main.styl');
var Baz = require('bazooka');
var backgrounds = require('./admin/backgrounds.jsx');


Baz.register({
    'inactiveImg': inactiveImg,
    'deleteImg': deleteImg,
    'reactTab': reactTab,
});


var unwatch = Baz.watch();

