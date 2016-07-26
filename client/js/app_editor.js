import {sendingReview} from './editor/fabmain';
import {reloadHistory, saveToHistory} from './editor/history';
import fabric from './editor/fabmain';
import backgroundsList from './editor/background';

const styluses = require('./../css/main.styl');

require('./editor/fabmain.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'backgroundsList': backgroundsList,
    'reloadHistory': reloadHistory,
    'sendingReview': sendingReview,
    'saveToHistory': saveToHistory
});

var unwatch = Baz.watch();
