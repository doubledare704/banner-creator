import {openBackgroundsList, setBackground, loadBackgroundImages} from './editor/background';
import fabric from './editor/fabmain';
const styluses = require('./../css/main.styl');

require('./editor/fabmain.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'openBackgroundsList': openBackgroundsList,
    'setBackground': setBackground,
    'loadBackgroundImages': loadBackgroundImages
});

var unwatch = Baz.watch();
