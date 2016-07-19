var fabric = require('./fabmain.js');
var styluses = require('./../css/main.styl');
var Baz = require('bazooka');

import header from './header.jsx';

Baz.register({
    'header': header,
});

var unwatch = Baz.watch();
