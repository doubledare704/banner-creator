import {fabric, resetCanvas, deleteKeyup, redoUndo, setColorObjs} from './editor/fabmain';
import {reloadHistory, saveToHistory} from './editor/history';
import {setGrid, setGridSize} from './editor/grids';
import backgroundsList from './editor/background';
import openReviewModal from './editor/review';
import sendToReview from './editor/reviewModal';
import {logoutClick} from './authHelper';
import {setOriginalZoom, keysListen, setNormalZoom, zoomOuter} from './editor/zoom';
import {dropDown} from './projects/dropdown';

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
    'setGrid': setGrid,
    "authLogout": logoutClick,
    'setGridSize': setGridSize,
    'setOriginalZoom': setOriginalZoom,
    'keysListen': keysListen,
    'setNormalZoom': setNormalZoom,
    'zoomOuter': zoomOuter,
    'resetCanvas': resetCanvas,
    'deleteKeyup': deleteKeyup,
    'redoUndo': redoUndo,
    'dropDown': dropDown,
    'setColorObjs':setColorObjs
});

Baz.watch();
