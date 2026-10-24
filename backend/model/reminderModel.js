const mongoose = require("mongoose");

// a schema for the reminder 
// A reminder is linked to a note and a user (your noteModel stays unchanged).
const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    remindAt: { type: Date, required: true },
    sent: { type: Boolean, default: false }, // true once the reminder email was sent
  },
  { timestamps: true }
);

reminderSchema.index({ sent: 1, remindAt: 1 }); // the scheduler looks reminders up by these

const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;