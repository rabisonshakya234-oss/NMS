const express = require('express');
const controller = require('../controller/userController');
const validate = require('../validator/validators');
const { protect } = require('../middleware/AuthMiddleware');
const { authorize } = require('../middleware/RoleMiddleware');


const router = express.Router();

router.use(protect); // every route below needs a logged-in user

router.get('/me', controller.getProfile);
router.patch('/me', validate.updateProfile, controller.updateProfile);
router.get('/', authorize('admin'), validate.listNotes, controller.listUsers); // page & limit check

module.exports = router;
