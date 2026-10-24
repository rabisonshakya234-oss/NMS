const ApiError = require('../utils/ApiError');
const Note = require('../model/noteModel');
const Reminder = require('../model/reminderModel');

// Only these fields can be set by the client (so nobody can change `user`).
const pickFields = (body) => {
  const data = {};
  for (const key of ['title', 'content', 'tags', 'isPinned', 'isArchived']) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (data.title) data.title = data.title.trim();
  if (data.tags) data.tags = [...new Set(data.tags.map((tag) => tag.trim()))]; // remove duplicates
  return data;
};

// Every query below includes `user: userId`, so notes are always private to their owner.

const createNote = (userId, body) => Note.create({ ...pickFields(body), user: userId });

const listNotes = async (userId, query) => {
  const { page, limit, search, tag, isPinned, sortBy = 'updatedAt', order = 'desc' } = query;

  const filter = { user: userId, isArchived: query.isArchived === undefined ? false : query.isArchived };
  if (isPinned !== undefined) filter.isPinned = isPinned;
  if (tag) filter.tags = tag;
  if (search) {
    const text = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // escape special characters
    filter.$or = [{ title: text }, { content: text }];
  }

  // Pinned notes always come first, then the chosen sort (title / createdAt / updatedAt).
  const sort = { isPinned: -1, [sortBy]: order === 'asc' ? 1 : -1 };

  const notes = await Note.find(filter).sort(sort).skip((page - 1) * limit).limit(limit);
  const total = await Note.countDocuments(filter);

  return { notes, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

const getNote = async (userId, noteId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new ApiError(404, 'Note not found');
  return note;
};

const updateNote = async (userId, noteId, body) => {
  const note = await Note.findOneAndUpdate({ _id: noteId, user: userId }, pickFields(body), {
    new: true,
    runValidators: true,
  });
  if (!note) throw new ApiError(404, 'Note not found');
  return note;
};

const deleteNote = async (userId, noteId) => {
  const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
  if (!note) throw new ApiError(404, 'Note not found');
  await Reminder.deleteMany({ note: noteId }); // a reminder is useless without its note
};

// All tags the user has used (for the tag filter).
const listTags = async (userId) => {
  const tags = await Note.distinct('tags', { user: userId });
  return tags.sort((a, b) => a.localeCompare(b));
};

// Switch isPinned or isArchived on/off.
const toggleFlag = async (userId, noteId, field) => {
  const note = await getNote(userId, noteId);
  return Note.findOneAndUpdate({ _id: noteId, user: userId }, { [field]: !note[field] }, { new: true });
};

// Select many notes and delete / archive / pin them in one request.
const bulkAction = async (userId, { ids, action }) => {
  const filter = { _id: { $in: ids }, user: userId };

  if (action === 'delete') {
    const result = await Note.deleteMany(filter);
    await Reminder.deleteMany({ note: { $in: ids }, user: userId });
    return { affected: result.deletedCount };
  }

  const changes = {
    archive: { isArchived: true },
    unarchive: { isArchived: false },
    pin: { isPinned: true },
    unpin: { isPinned: false },
  };
  const result = await Note.updateMany(filter, changes[action]);
  return { affected: result.matchedCount };
};

// Notes for export: one note (when noteId is given) or all of the user's notes.
const getNotesForExport = async (userId, noteId) => {
  if (noteId) return [await getNote(userId, noteId)];
  return Note.find({ user: userId }).sort({ createdAt: 1 });
};

module.exports = {
  createNote, listNotes, listTags, getNote, updateNote, deleteNote, toggleFlag, bulkAction, getNotesForExport,
};
