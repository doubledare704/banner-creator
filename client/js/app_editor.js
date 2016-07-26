import fabric from './editor/fabmain';
import backgroundsList from './editor/background';

require('./editor/fabmain.js');

const Baz = require('bazooka');

Baz.register({
    'fabric': fabric,
    'backgroundsList': backgroundsList
    
});

var unwatch = Baz.watch();