import {openBackgroundsList, setBackground, loadBackgroundImages} from './editor/background';
import fabric from './editor/fabmain';
import bg from './editor/backgroundReact';

require('./editor/fabmain.js');
// require('./editor/backgroundReact.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'openBackgroundsList': openBackgroundsList,
    'setBackground': setBackground,
    'loadBackgroundImages': loadBackgroundImages,
    'bg': bg
    
});

var unwatch = Baz.watch();