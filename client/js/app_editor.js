import {fabric, resetCanvas, deleteKeyup} from './editor/fabmain';
import {reloadHistory, saveToHistory} from './editor/history';
import {setGrid, setGridSize} from './editor/grids';
import backgroundsList from './editor/background';
import openReviewModal from './editor/review';
import sendToReview from './editor/reviewModal';
import {logoutClick} from './auth_helper'
import oldToReview from './editor/reviewAgain';
import {setOriginalZoom, keysListen, setNormalZoom, zoomOuter} from './editor/zoom';

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
    "authLogout": logoutClick,
    'setGridSize': setGridSize,
    'setOriginalZoom': setOriginalZoom,
    'keysListen': keysListen,
    'setNormalZoom': setNormalZoom,
    'zoomOuter': zoomOuter,
    'resetCanvas': resetCanvas,
    'deleteKeyup': deleteKeyup
});

Baz.watch();
