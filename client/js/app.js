import renderImages from './images/renderImages.jsx';
import backgroundsAdmin from './admin/backgroundsAdmin.jsx';
import reviewAdmin from './admin/reviewsAdmin.jsx';

require('./../css/main.styl');
const Baz = require('bazooka');

Baz.register({
    backgroundsAdmin: backgroundsAdmin,
    renderImages: renderImages,
    reviewAdmin: reviewAdmin
});

Baz.watch();
