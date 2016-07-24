import header from './header.jsx';
import renderImages from './renderImages.jsx';
import reactTab from './admin/reactTab.jsx'

var styluses = require('./../css/main.styl');
var Baz = require('bazooka');


Baz.register({
    'reactTab': reactTab,
    'header': header,
    'renderImages':renderImages
});


var unwatch = Baz.watch();