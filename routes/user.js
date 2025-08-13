const express = require('express');
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap.js');
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middlewares/middleware.js');
const userController = require('../controllers/user.js');
const user = require('../models/user.js');



router.route('/signup')
.get(userController.renderSignupForm)
.post(userController.signup)



router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    userController.login
    )


router.get('/logout', userController.logout)



module.exports = router;









module.exports = router;