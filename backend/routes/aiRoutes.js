const express = require('express');
const controller = require('../controller/aiController');
const validate = require('../validator/validators');

const { aiLimiter } = require('../utils/rateLimiter');
const { protect } = require('../middleware/AuthMiddleware');

const router = express.Router();

// POST /api/ai/ask  { "question": "What did I plan for the trip?" }
router.post('/ask', protect, aiLimiter, validate.askQuestion, controller.askNotes);

module.exports = router;
