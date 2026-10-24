const express = require('express');
const controller = require('../controller/noteController');
const validate = require('../validator/validators');
const { protect } = require('../middleware/AuthMiddleware');


const router = express.Router();

router.use(protect); // notes are private: every route needs a logged-in user

router.post('/', validate.createNote, controller.createNote);
router.get('/', validate.listNotes, controller.listNotes);

// These fixed paths must stay above '/:id'
router.get('/tags', controller.listTags);
router.get('/export', validate.exportFormat, controller.exportNotes);
router.post('/bulk', validate.bulkAction, controller.bulkAction);

router.get('/:id', validate.noteId, controller.getNote);
router.patch('/:id', validate.noteId, validate.updateNote, controller.updateNote);
router.delete('/:id', validate.noteId, controller.deleteNote);

router.patch('/:id/autosave', validate.noteId, validate.updateNote, controller.autosaveNote);
router.patch('/:id/pin', validate.noteId, controller.togglePin);
router.patch('/:id/archive', validate.noteId, controller.toggleArchive);
router.get('/:id/export', validate.noteId, validate.exportFormat, controller.exportNotes);

module.exports = router;
