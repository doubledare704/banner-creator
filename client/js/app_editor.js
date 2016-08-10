import {fabric} from './editor/fabmain';
import {reloadHistory, saveToHistory} from './editor/history';
import {setGrid, setGridSize} from './editor/grids'
import backgroundsList from './editor/background';
import openReviewModal from './editor/review';
import sendToReview from './editor/reviewModal';
import oldToReview from './editor/reviewAgain';

require('./../css/main.styl');
require('./editor/fabmain.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'backgroundsList': backgroundsList,
    'openReviewModal': openReviewModal,
    'sendToReview': sendToReview,
    'reloadHistory': reloadHistory,
    'saveToHistory': saveToHistory,
    'oldToReview': oldToReview,
    'setGrid': setGrid,
    'setGridSize': setGridSize
});

Baz.watch();
