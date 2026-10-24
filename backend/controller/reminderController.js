const asyncHandler = require('../utils/asyncHandler');
const reminderService = require('../service/reminderService');

async function createReminder(req, res) {
  const reminder = await reminderService.createReminder(req.user.id, req.body);
  res.status(201).json({ success: true, message: 'Reminder set', data: { reminder } });
}

async function listReminders(req, res) {
  const reminders = await reminderService.listReminders(req.user.id);
  res.json({ success: true, message: 'Reminders fetched', data: { reminders } });
}

async function deleteReminder(req, res) {
  await reminderService.deleteReminder(req.user.id, req.params.id);
  res.json({ success: true, message: 'Reminder removed' });
}

module.exports = {
  createReminder: asyncHandler(createReminder),
  listReminders: asyncHandler(listReminders),
  deleteReminder: asyncHandler(deleteReminder),
};