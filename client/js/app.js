import renderImages from './images/renderImages.jsx';
import backgroundsAdmin from './admin/backgroundsAdmin.jsx';
import loginClick from './auth_helper'
import reviewTool from './images/reviewTool.jsx'

const styluses = require('./../css/main.styl');
const Baz = require('bazooka');

Baz.register({
    'backgroundsAdmin': backgroundsAdmin,
    'renderImages': renderImages,
    'loginClick': loginClick,
    'reviewTool': reviewTool
});


const unwatch = Baz.watch();