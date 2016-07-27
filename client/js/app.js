import renderImages from './images/renderImages.jsx';
import backgroundsAdmin from './admin/backgroundsAdmin.jsx';

require('./../css/main.styl');
const Baz = require('bazooka');

Baz.register({
    backgroundsAdmin: backgroundsAdmin,
    header: header,
    renderImages: renderImages
});

Baz.watch();
