import {sendingReview, fabric} from './editor/fabmain';
import {reloadHistory, saveToHistory} from './editor/history';
import backgroundsList from './editor/background';

require('./../css/main.styl');
require('./editor/fabmain.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'backgroundsList': backgroundsList,
    'reloadHistory': reloadHistory,
    'sendingReview': sendingReview,
    'saveToHistory': saveToHistory
});

Baz.watch();
