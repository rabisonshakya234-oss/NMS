const express = require('express');
const controller = require('../controller/reminderController');
const validate = require('../validator/validators');
const { protect } = require('../middleware/AuthMiddleware');


const router = express.Router();

router.use(protect);

router.post('/', validate.createReminder, controller.createReminder); // { noteId, remindAt }
router.get('/', controller.listReminders);
router.delete('/:id', validate.reminderId, controller.deleteReminder);

module.exports = router;
