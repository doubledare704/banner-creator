import fabric from './editor/fabmain';
import bg from './editor/background';

require('./editor/fabmain.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'bg': bg
    
});

var unwatch = Baz.watch();