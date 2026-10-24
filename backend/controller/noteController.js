const asyncHandler = require('../utils/asyncHandler');
const noteService = require('../service/noteService');
const exportService = require('../service/exportService');

async function createNote(req, res) {
  const note = await noteService.createNote(req.user.id, req.body);
  res.status(201).json({ success: true, message: 'Note created', data: { note } });
}

async function listNotes(req, res) {
  const data = await noteService.listNotes(req.user.id, req.query);
  res.json({ success: true, message: 'Notes fetched', data });
}

async function listTags(req, res) {
  const tags = await noteService.listTags(req.user.id);
  res.json({ success: true, message: 'Tags fetched', data: { tags } });
}

async function getNote(req, res) {
  const note = await noteService.getNote(req.user.id, req.params.id);
  res.json({ success: true, message: 'Note fetched', data: { note } });
}

async function updateNote(req, res) {
  const note = await noteService.updateNote(req.user.id, req.params.id, req.body);
  res.json({ success: true, message: 'Note updated', data: { note } });
}

// Auto-save: the editor calls this every few seconds while the user types.
// It saves the same way as update, but answers with only the save time to keep it light.
async function autosaveNote(req, res) {
  const note = await noteService.updateNote(req.user.id, req.params.id, req.body);
  res.json({ success: true, message: 'Saved', data: { savedAt: note.updatedAt } });
}

async function deleteNote(req, res) {
  await noteService.deleteNote(req.user.id, req.params.id);
  res.json({ success: true, message: 'Note deleted' });
}

async function togglePin(req, res) {
  const note = await noteService.toggleFlag(req.user.id, req.params.id, 'isPinned');
  res.json({ success: true, message: note.isPinned ? 'Note pinned' : 'Note unpinned', data: { note } });
}

async function toggleArchive(req, res) {
  const note = await noteService.toggleFlag(req.user.id, req.params.id, 'isArchived');
  res.json({ success: true, message: note.isArchived ? 'Note archived' : 'Note unarchived', data: { note } });
}

async function bulkAction(req, res) {
  const data = await noteService.bulkAction(req.user.id, req.body);
  res.json({ success: true, message: `Bulk ${req.body.action} done`, data });
}

// Download one note (/:id/export) or all notes (/export) as Markdown or PDF.
async function exportNotes(req, res) {
  const notes = await noteService.getNotesForExport(req.user.id, req.params.id);
  const name = req.params.id ? notes[0].title : 'all-notes';

  if (req.query.format === 'pdf') return exportService.sendPdf(res, notes, name);
  exportService.sendMarkdown(res, notes, name);
}

module.exports = {
  createNote: asyncHandler(createNote),
  listNotes: asyncHandler(listNotes),
  listTags: asyncHandler(listTags),
  getNote: asyncHandler(getNote),
  updateNote: asyncHandler(updateNote),
  autosaveNote: asyncHandler(autosaveNote),
  deleteNote: asyncHandler(deleteNote),
  togglePin: asyncHandler(togglePin),
  toggleArchive: asyncHandler(toggleArchive),
  bulkAction: asyncHandler(bulkAction),
  exportNotes: asyncHandler(exportNotes),
};