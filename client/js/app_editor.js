import {sendingReview} from './editor/fabmain';
import {reloadHistory, saveToHistory} from './editor/history';
import fabric from './editor/fabmain';
import backgroundsList from './editor/background';
import openReviewModal from './editor/review';
import sendToReview from './editor/reviewModal';

const styluses = require('./../css/main.styl');

require('./editor/fabmain.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'backgroundsList': backgroundsList,
    'openReviewModal': openReviewModal,
    'sendToReview': sendToReview,
    'reloadHistory': reloadHistory,
    'sendingReview': sendingReview,
    'saveToHistory': saveToHistory
});

const unwatch = Baz.watch();
