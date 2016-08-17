import renderImages from './images/renderImages.jsx';
import backgroundsAdmin from './admin/backgroundsAdmin.jsx';
import projectsPanel from './admin/projects.jsx';
import showBanner from './dashboard/dashboard';
import {loginClick, logoutClick} from './authHelper';
import reviewTool from './images/reviewTool.jsx';
import users from './admin/users.jsx';
import toggleProfileForm from './profile/profile';
import goToReview from './dashboard/designer_review';
import showBannerPopup from './dashboard/designer_dashboard_banner';
import deleteReview from './dashboard/dashboard_delete_review';
import deleteBanner from './dashboard/dashboard_delete_banner';
import handleCreateProjectClick from './admin/create_project_field';
import {uploadButton} from './helpers';
import uploadFont from './admin/upload_font';
import uploadFiles from './images/uploadFiles';
import reviewResult from './images/reviewResult.jsx';

require('./../css/main.styl');
const Baz = require('bazooka');

Baz.register({
    'backgroundsAdmin': backgroundsAdmin,
    'renderImages': renderImages,
    'reviewTool': reviewTool,
    'showBanner': showBanner,
    'usersList': users,
    'toggleProfileForm': toggleProfileForm,
    "authLogout": logoutClick,
    'authLogin': loginClick,
    'createProject': handleCreateProjectClick,
    'uploadButton': uploadButton,
    'projectsPanel': projectsPanel,
    'uploadFont': uploadFont,
    'goToReview': goToReview,
    'showBannerPopup': showBannerPopup,
    'deleteReview': deleteReview,
    'deleteBanner': deleteBanner,
    'uploadFiles' : uploadFiles,
    'reviewResult': reviewResult
});

Baz.watch();
