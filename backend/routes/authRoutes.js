const express = require('express');
const controller = require('../controller/authController');
const validate = require('../validator/validators');
const { protect } = require('../middleware/AuthMiddleware');
const { forgotPasswordLimiter, authLimiter } = require('../middleware/rateLimiterMiddleware');


const router = express.Router();

router.post('/register', authLimiter, validate.register, controller.register);
router.post('/login', authLimiter, validate.login, controller.login);
router.post('/logout', protect, controller.logout);
router.post('/forgot-password', forgotPasswordLimiter, validate.forgotPassword, controller.forgotPassword);
router.post('/reset-password/:token', authLimiter, validate.resetPassword, controller.resetPassword);
router.patch('/change-password', protect, validate.changePassword, controller.changePassword);

module.exports = router;