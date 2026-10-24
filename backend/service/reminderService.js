const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const Reminder = require('../model/reminderModel');
const Note = require('../model/noteModel');
const User = require('../model/userModel');

const createReminder = async (userId, { noteId, remindAt }) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new ApiError(404, 'Note not found');

  const reminder = await Reminder.create({ user: userId, note: noteId, remindAt: new Date(remindAt) });
  return { _id: reminder._id, noteId, noteTitle: note.title, remindAt: reminder.remindAt, isDue: false };
};

// All reminders of the user, soonest first. `isDue` means the time has passed.
const listReminders = async (userId) => {
  const reminders = await Reminder.find({ user: userId }).sort({ remindAt: 1 });
  const notes = await Note.find({ _id: { $in: reminders.map((r) => r.note) } });
  const titles = {};
  notes.forEach((n) => { titles[n._id.toString()] = n.title; });

  const now = new Date();
  return reminders.map((r) => ({
    _id: r._id,
    noteId: r.note,
    noteTitle: titles[r.note.toString()] || '(deleted note)',
    remindAt: r.remindAt,
    isDue: r.remindAt <= now,
  }));
};

const deleteReminder = async (userId, reminderId) => {
  const reminder = await Reminder.findOneAndDelete({ _id: reminderId, user: userId });
  if (!reminder) throw new ApiError(404, 'Reminder not found');
};

// Emails every reminder whose time has come. Called once a minute by the scheduler.
const processDueReminders = async () => {
  const due = await Reminder.find({ sent: false, remindAt: { $lte: new Date() } });

  for (const reminder of due) {
    try {
      const user = await User.findById(reminder.user);
      const note = await Note.findById(reminder.note);

      if (user && note) {
        await sendEmail({
          to: user.email,
          subject: `Reminder: ${note.title}`,
          text: `Hi ${user.username},\n\nThis is your reminder for the note "${note.title}":\n\n${note.content.slice(0, 500)}`,
          html: `<p>This is your reminder for the note <b>${note.title.replace(/</g, '&lt;')}</b>.</p>`,
        });
      }
      await Reminder.findByIdAndUpdate(reminder._id, { sent: true });
    } catch (error) {
      // Not marked as sent, so it is tried again on the next run.
      console.error('Could not send reminder email:', error.message);
    }
  }
};

const startScheduler = () => {
  setInterval(() => processDueReminders().catch((e) => console.error('Reminder scheduler:', e.message)), 60 * 1000).unref();
};

module.exports = { createReminder, listReminders, deleteReminder, processDueReminders, startScheduler };
