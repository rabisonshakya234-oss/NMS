// Simple request validation. Each validator collects problems and
// either calls next() (all good) or sends a 400 error listing them.
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

const isText = (value) => typeof value === 'string' && value.trim() !== '';
const isEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const isUsername = (value) => typeof value === 'string' && /^[a-zA-Z0-9_.-]{3,30}$/.test(value.trim());

// bcrypt only reads the first 72 bytes of a password.
const passwordProblem = (value, field) => {
  if (typeof value !== 'string' || value.length < 8) return `${field} must be at least 8 characters`;
  if (Buffer.byteLength(value) > 72) return `${field} is too long (max 72 bytes)`;
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return `${field} needs a letter and a number`;
  return null;
};

const toBool = (value) => (value === 'true' || value === true ? true : value === 'false' || value === false ? false : undefined);

// Wraps a function that returns a list of errors into Express middleware.
const check = (findErrors) => (req, res, next) => {
  const errors = findErrors(req);
  if (errors.length > 0) return next(new ApiError(400, 'Validation failed', errors));
  next();
};

const add = (errors, field, message) => errors.push({ field, message });

/* ---------- Auth ---------- */

const register = check((req) => {
  const { username, email, password, confirmPassword } = req.body;
  const errors = [];
  if (!isUsername(username)) add(errors, 'username', 'Username must be 3-30 characters (letters, numbers, _ . -)');
  if (!isEmail(email)) add(errors, 'email', 'A valid email is required');
  const problem = passwordProblem(password, 'password');
  if (problem) add(errors, 'password', problem);
  if (!isText(confirmPassword)) add(errors, 'confirmPassword', 'confirmPassword is required');
  return errors;
});

const login = check((req) => {
  const errors = [];
  if (!isEmail(req.body.email)) add(errors, 'email', 'A valid email is required');
  if (!isText(req.body.password)) add(errors, 'password', 'password is required');
  return errors;
});

const forgotPassword = check((req) => (isEmail(req.body.email) ? [] : [{ field: 'email', message: 'A valid email is required' }]));

const resetPassword = check((req) => {
  const errors = [];
  const problem = passwordProblem(req.body.password, 'password');
  if (problem) add(errors, 'password', problem);
  if (!isText(req.body.confirmPassword)) add(errors, 'confirmPassword', 'confirmPassword is required');
  return errors;
});

const changePassword = check((req) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const errors = [];
  if (!isText(currentPassword)) add(errors, 'currentPassword', 'currentPassword is required');
  const problem = passwordProblem(newPassword, 'newPassword');
  if (problem) add(errors, 'newPassword', problem);
  if (!isText(confirmPassword)) add(errors, 'confirmPassword', 'confirmPassword is required');
  return errors;
});

const updateProfile = check((req) =>
  isUsername(req.body.username) ? [] : [{ field: 'username', message: 'Username must be 3-30 characters (letters, numbers, _ . -)' }]
);

/* ---------- Notes ---------- */

const checkNoteFields = (body, errors, isUpdate) => {
  const { title, content, tags, isPinned, isArchived } = body;

  if (!isUpdate || title !== undefined) {
    if (!isText(title) || title.length > 150) add(errors, 'title', 'title is required (max 150 characters)');
  }
  if (!isUpdate || content !== undefined) {
    if (!isText(content) || content.length > 50000) add(errors, 'content', 'content is required (max 50000 characters)');
  }
  if (tags !== undefined) {
    const okTags = Array.isArray(tags) && tags.length <= 20 && tags.every((t) => isText(t) && t.length <= 30);
    if (!okTags) add(errors, 'tags', 'tags must be a list of up to 20 short texts (max 30 characters each)');
  }
  if (isPinned !== undefined && typeof isPinned !== 'boolean') add(errors, 'isPinned', 'isPinned must be true or false');
  if (isArchived !== undefined && typeof isArchived !== 'boolean') add(errors, 'isArchived', 'isArchived must be true or false');
};

const createNote = check((req) => {
  const errors = [];
  checkNoteFields(req.body, errors, false);
  return errors;
});

// Used for both "update note" and "autosave".
const updateNote = check((req) => {
  const fields = ['title', 'content', 'tags', 'isPinned', 'isArchived'];
  if (!fields.some((f) => req.body[f] !== undefined)) {
    return [{ field: 'body', message: `Send at least one of: ${fields.join(', ')}` }];
  }
  const errors = [];
  checkNoteFields(req.body, errors, true);
  return errors;
});

const noteId = check((req) =>
  mongoose.isValidObjectId(req.params.id) ? [] : [{ field: 'id', message: 'Invalid note id' }]
);

const listNotes = check((req) => {
  const q = req.query;
  const errors = [];

  q.page = q.page === undefined ? 1 : Number(q.page);
  q.limit = q.limit === undefined ? 10 : Number(q.limit);
  if (!Number.isInteger(q.page) || q.page < 1) add(errors, 'page', 'page must be 1 or more');
  if (!Number.isInteger(q.limit) || q.limit < 1 || q.limit > 100) add(errors, 'limit', 'limit must be between 1 and 100');

  if (q.sortBy !== undefined && !['title', 'createdAt', 'updatedAt'].includes(q.sortBy)) {
    add(errors, 'sortBy', 'sortBy must be title, createdAt or updatedAt');
  }
  if (q.order !== undefined && !['asc', 'desc'].includes(q.order)) add(errors, 'order', 'order must be asc or desc');

  for (const field of ['isPinned', 'isArchived']) {
    if (q[field] === undefined) continue;
    const value = toBool(q[field]);
    if (value === undefined) add(errors, field, `${field} must be true or false`);
    else q[field] = value;
  }
  if (q.search !== undefined && (typeof q.search !== 'string' || q.search.length > 100)) {
    add(errors, 'search', 'search must be text up to 100 characters');
  }
  if (q.tag !== undefined && typeof q.tag !== 'string') add(errors, 'tag', 'tag must be text');
  return errors;
});

const bulkAction = check((req) => {
  const { ids, action } = req.body;
  const errors = [];
  if (!['delete', 'archive', 'unarchive', 'pin', 'unpin'].includes(action)) {
    add(errors, 'action', 'action must be delete, archive, unarchive, pin or unpin');
  }
  const okIds = Array.isArray(ids) && ids.length > 0 && ids.length <= 100 && ids.every((id) => mongoose.isValidObjectId(id));
  if (!okIds) add(errors, 'ids', 'ids must be a list of 1-100 valid note ids');
  return errors;
});

const exportFormat = check((req) => {
  const format = req.query.format;
  if (format !== undefined && !['markdown', 'pdf'].includes(format)) {
    return [{ field: 'format', message: 'format must be markdown or pdf' }];
  }
  return [];
});

/* ---------- Reminders ---------- */

const createReminder = check((req) => {
  const { noteId, remindAt } = req.body;
  const errors = [];
  if (!mongoose.isValidObjectId(noteId)) add(errors, 'noteId', 'noteId must be a valid note id');

  const time = typeof remindAt === 'string' ? new Date(remindAt) : null;
  if (!time || Number.isNaN(time.getTime())) add(errors, 'remindAt', 'remindAt must be a valid date and time');
  else if (time <= new Date()) add(errors, 'remindAt', 'remindAt must be in the future');
  else if (time - new Date() > 366 * 24 * 60 * 60 * 1000) add(errors, 'remindAt', 'remindAt can be at most one year ahead');
  return errors;
});

const reminderId = check((req) =>
  mongoose.isValidObjectId(req.params.id) ? [] : [{ field: 'id', message: 'Invalid reminder id' }]
);

/* ---------- AI ---------- */

const askQuestion = check((req) => {
  const { question } = req.body;
  if (!isText(question) || question.length > 500) {
    return [{ field: 'question', message: 'question is required (max 500 characters)' }];
  }
  return [];
});

module.exports = {
  register, login, forgotPassword, resetPassword, changePassword, updateProfile,
  createNote, updateNote, noteId, listNotes, bulkAction, exportFormat, createReminder, reminderId, askQuestion,
};
