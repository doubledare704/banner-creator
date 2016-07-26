import {openBackgroundsList, setBackground, loadBackgroundImages} from './editor/background';
import {sendingReview} from './editor/fabmain';
import {reloadHistory, saveToHistory} from './editor/history';
import fabric from './editor/fabmain';

const styluses = require('./../css/main.styl');

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

var unwatch = Baz.watch();
