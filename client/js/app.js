import renderImages from './images/renderImages.jsx';
import backgroundsAdmin from './admin/backgroundsAdmin.jsx';
import showBanner from './dashboard/dashboard';
import loginClick from './auth_helper'
import reviewTool from './images/reviewTool.jsx'
import users from './admin/users.jsx';

const styluses = require('./../css/main.styl');
const Baz = require('bazooka');

Baz.register({
    'backgroundsAdmin': backgroundsAdmin,
    'renderImages': renderImages,
    'showBanner': showBanner,
    'loginClick': loginClick,
    'reviewTool': reviewTool,
    'usersList': users
});


const unwatch = Baz.watch();
