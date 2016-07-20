import inactiveImg from './admin/inactiveImg.js'
import deleteImg from './admin/deleteFromDB.js'
import fabric from './fabmain'
import {openBackgroundsList, setBackground, loadBackgroundImages} from './background'

// var editor = require('./editor.js');
var styluses = require('./../css/main.styl');
var Baz = require('bazooka');


Baz.register({
    'inactiveImg': inactiveImg,
    'deleteImg': deleteImg,
    'fabric': fabric,
    'openBackgroundsList': openBackgroundsList,
    'setBackground': setBackground,
    'loadBackgroundImages': loadBackgroundImages
});

var unwatch = Baz.watch();

