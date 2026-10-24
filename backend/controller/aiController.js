const asyncHandler = require('../utils/asyncHandler');
const aiService = require('../service/aiService');

async function askNotes(req, res) {
  const data = await aiService.askNotes(req.user.id, req.body.question.trim());
  res.json({ success: true, message: 'Answer ready', data });
}

module.exports = { askNotes: asyncHandler(askNotes) };