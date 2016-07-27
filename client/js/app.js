import renderImages from './images/renderImages.jsx';
import backgroundsAdmin from './admin/backgroundsAdmin.jsx';
import reviewTool from './images/reviewTool.jsx'

const styluses = require('./../css/main.styl');
const Baz = require('bazooka');

Baz.register({
    'backgroundsAdmin': backgroundsAdmin,
    'renderImages': renderImages,
    'reviewTool': reviewTool
});


const unwatch = Baz.watch();