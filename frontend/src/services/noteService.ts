import { request, download } from './api';
import type { BulkAction, ExportFormat, Note, NoteBody, NoteQuery, Pagination } from '@/types';

export const listNotes = (query: NoteQuery) => request<{ notes: Note[]; pagination: Pagination }>('/notes', { query });
export const listTags = () => request<{ tags: string[] }>('/notes/tags');
export const getNote = (id: string) => request<{ note: Note }>(`/notes/${id}`);
export const createNote = (body: NoteBody) => request<{ note: Note }>('/notes', { method: 'POST', body });
export const updateNote = (id: string, body: NoteBody) => request<{ note: Note }>(`/notes/${id}`, { method: 'PATCH', body });
export const autosaveNote = (id: string, body: NoteBody) => request<{ savedAt: string }>(`/notes/${id}/autosave`, { method: 'PATCH', body });
export const deleteNote = (id: string) => request(`/notes/${id}`, { method: 'DELETE' });
export const togglePin = (id: string) => request<{ note: Note }>(`/notes/${id}/pin`, { method: 'PATCH' });
export const toggleArchive = (id: string) => request<{ note: Note }>(`/notes/${id}/archive`, { method: 'PATCH' });
// action: delete | archive | unarchive | pin | unpin
export const bulkAction = (ids: string[], action: BulkAction) => request('/notes/bulk', { method: 'POST', body: { ids, action } });

// format: 'markdown' | 'pdf'. Leave `id` empty to export every note.
export const exportNotes = (format: ExportFormat, id?: string) =>
  download(id ? `/notes/${id}/export` : '/notes/export', {
    query: { format },
    filename: `${id ? 'note' : 'all-notes'}.${format === 'pdf' ? 'pdf' : 'md'}`,
  });
