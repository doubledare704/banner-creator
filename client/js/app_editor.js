import {openBackgroundsList, setBackground, loadBackgroundImages} from './editor/background';
import {sendingReview, fabric} from './editor/fabmain';
import {reloadHistory, saveToHistory} from './editor/history';

require('./../css/main.styl');
require('./editor/fabmain.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'openBackgroundsList': openBackgroundsList,
    'setBackground': setBackground,
    'loadBackgroundImages': loadBackgroundImages,
    'reloadHistory': reloadHistory,
    'sendingReview': sendingReview,
    'saveToHistory': saveToHistory
});

Baz.watch();
