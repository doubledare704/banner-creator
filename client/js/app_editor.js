import {openBackgroundsList, setBackground, loadBackgroundImages} from './editor/background';
import fabric from './editor/fabmain';
const styluses = require('./../css/main.styl');

import {reloadHistory} from  './editor/history'

require('./editor/fabmain.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'openBackgroundsList': openBackgroundsList,
    'setBackground': setBackground,
    'loadBackgroundImages': loadBackgroundImages,
    'history': reloadHistory
});

var unwatch = Baz.watch();
