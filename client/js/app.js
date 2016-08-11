import renderImages from './images/renderImages.jsx';
import backgroundsAdmin from './admin/backgroundsAdmin.jsx';
import showBanner from './dashboard/dashboard';
import {loginClick, logoutClick} from './auth_helper'
import reviewTool from './images/reviewTool.jsx'
import reviewAdmin from './admin/reviewsAdmin.jsx';
import users from './admin/users.jsx';
import toggleProfileForm from './profile/profile';
import goToReview from './dashboard/designer_review';
import showBannerPopup from './dashboard/designer_dashboard_banner';

require('./../css/main.styl');
const Baz = require('bazooka');

Baz.register({
    'backgroundsAdmin': backgroundsAdmin,
    'renderImages': renderImages,
    'reviewTool': reviewTool,
    'showBanner': showBanner,
    'loginClick': loginClick,
    'reviewAdmin': reviewAdmin,
    'usersList': users,
    'toggleProfileForm': toggleProfileForm,
    'auth_logout': logoutClick,
    'auth_login': loginClick,

    // dashboard
    'goToReview': goToReview,
    'showBannerPopup': showBannerPopup
});

Baz.watch();
