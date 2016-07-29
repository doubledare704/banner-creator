require('./admin/popUp.js');
import renderImages from './images/renderImages.jsx';
import backgroundsAdmin from './admin/backgroundsAdmin.jsx';
import loginClick from './auth_helper'
import reviewTool from './images/reviewTool.jsx'
import reviewAdmin from './admin/reviewsAdmin.jsx';
import users from './admin/users.jsx';

require('./../css/main.styl');
const Baz = require('bazooka');

Baz.register({
    backgroundsAdmin: backgroundsAdmin,
    renderImages: renderImages,
    reviewAdmin: reviewAdmin,
    'reviewTool': reviewTool,
    'loginClick': loginClick
    'usersList': users
});

Baz.watch();

const unwatch = Baz.watch();