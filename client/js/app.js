import inactiveImg from './admin/inactiveImg.js'
import deleteImg from './admin/deleteFromDB.js'
// import fabric from './fabmain'

// var editor = require('./editor.js');
import users from './admin/users.jsx';
var styluses = require('./../css/main.styl');
var Baz = require('bazooka');


Baz.register({
    'inactiveImg': inactiveImg,
    'deleteImg': deleteImg,
    // 'fabric': fabric,
    'usersList': users
});

var unwatch = Baz.watch();

