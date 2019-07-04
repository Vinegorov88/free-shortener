let express = require('express');
let router = express.Router();

let homeController = require('../controllers/homeController');
let urlController = require('../controllers/urlController');
let authController = require('../controllers/authController');
let isLoggedIn = require('../middlewares/isLoggedIn');
let isNotLoggedIn = require('../middlewares/isNotLoggedIn');
let profileController = require('../controllers/profileController');

router.get('/', homeController.home);
router.get('/auth/register', isNotLoggedIn, authController.register);
router.post('/auth/register', isNotLoggedIn, authController.handleRegister);
router.get('/auth/login', isNotLoggedIn, authController.login);
router.post('/auth/login', isNotLoggedIn, authController.handleLogin);
router.get('/auth/logout', isLoggedIn, authController.logout);
router.get('/profile/links/browse', isLoggedIn, profileController.browse);
router.get('/profile/links/show/:id', isLoggedIn, profileController.show);
router.get('/profile/links/edit/:id', isLoggedIn, profileController.edit);
router.post('/profile/links/change/:id', isLoggedIn, profileController.change);
router.post('/url/short', urlController.createURL);
router.get('/:key', urlController.redirect);

module.exports = router;