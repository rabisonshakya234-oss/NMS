'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TagInput from './TagInput';
import RichTextEditor from './RichTextEditor';
import ReminderModal from './ReminderModal';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Dropdown from '@/components/ui/Dropdown';
import { PageLoader } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import useDebounce from '@/hooks/useDebounce';
import * as noteService from '@/services/noteService';
import { AUTOSAVE_DELAY_MS, MAX_CONTENT, MAX_TITLE } from '@/lib/config';
import { formatDateTime, formatTime } from '@/lib/format';
import type { FieldError, Note } from '@/types';

// One editor for both cases: <NoteEditor /> creates a note, <NoteEditor noteId="..." /> edits one.
// Existing notes are auto-saved a couple of seconds after you stop typing.
export default function NoteEditor({ noteId }: { noteId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const isNew = !noteId;

  const [note, setNote] = useState<Note | null>(null);           // the saved note (edit mode)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState('');       // what the server has right now
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [failedDraft, setFailedDraft] = useState(''); // draft whose auto-save failed (not retried until it changes)
  const [showReminder, setShowReminder] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const draft = JSON.stringify({ title, content, tags });
  const debouncedDraft = useDebounce(draft, AUTOSAVE_DELAY_MS);
  const isDirty = !isNew && !!note && draft !== savedKey;
  const canSave = title.trim() !== '' && content.trim() !== '';

  // Load the note when editing.
  useEffect(() => {
    if (isNew) return;
    noteService.getNote(noteId)
      .then(({ note }) => {
        setNote(note); setTitle(note.title); setContent(note.content); setTags(note.tags);
        setSavedKey(JSON.stringify({ title: note.title, content: note.content, tags: note.tags }));
        setSavedAt(note.updatedAt);
      })
      .catch((e) => setError(e.status === 404 ? 'This note does not exist or was deleted.' : e.message))
      .finally(() => setLoading(false));
  }, [noteId, isNew]);

  // Auto-save: runs once the user has stopped typing for AUTOSAVE_DELAY_MS.
  useEffect(() => {
    if (!isDirty || !canSave || debouncedDraft !== draft || saving || failedDraft === draft) return;
    setSaving(true);
    noteService.autosaveNote(noteId, JSON.parse(draft))
      .then((data) => { setSavedKey(draft); setSavedAt(data.savedAt); setError(''); setFailedDraft(''); })
      .catch((e) => { setFailedDraft(draft); setError(`Auto-save failed: ${e.message}`); })
      .finally(() => setSaving(false));
  }, [debouncedDraft, saving, isDirty, canSave, draft, failedDraft, noteId]);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  const handleSave = async () => {
    setError(''); setFieldErrors({}); setSaving(true);
    const body = { title: title.trim(), content, tags };
    try {
      if (isNew) {
        const { note: created } = await noteService.createNote(body);
        toast.success('Note created');
        router.replace(`/notes/${created._id}`);
      } else {
        const { note: updated } = await noteService.updateNote(noteId, body);
        setNote(updated); setSavedKey(draft); setSavedAt(updated.updatedAt);
        toast.success('Note saved');
      }
    } catch (e) {
      const map: Record<string, string> = {};
      (e.errors || []).forEach((x: FieldError) => { map[x.field] = x.message; });
      setFieldErrors(map);
      setError(e.errors?.length ? 'Please fix the highlighted fields.' : e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (action: (id: string) => Promise<{ note: Note }>, doneText: (note: Note) => string) => {
    try { const { note: updated } = await action(noteId!); setNote(updated); toast.success(doneText(updated)); }
    catch (e) { toast.error(e.message); }
  };

  const handleDelete = async () => {
    try { await noteService.deleteNote(noteId!); toast.success('Note deleted'); router.replace('/notes'); }
    catch (e) { toast.error(e.message); setShowDelete(false); }
  };

  const exportNote = (format: 'markdown' | 'pdf') => noteService.exportNotes(format, noteId).catch((e) => toast.error(e.message));

  if (loading) return <PageLoader text="Loading note…" />;
  if (!isNew && !note) {
    return (
      <div className="text-center py-5">
        <Alert className="d-inline-block">{error || 'Note not found.'}</Alert>
        <div><Link href="/notes" className="btn btn-primary">Back to notes</Link></div>
      </div>
    );
  }

  const status = isNew ? '' : saving ? 'Saving…' : isDirty ? (canSave ? 'Unsaved changes' : 'Add a title and content to save')
    : savedAt ? `Saved at ${formatTime(savedAt)}` : '';

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <Link href="/notes" className="text-decoration-none"><i className="bi bi-arrow-left me-1" />All notes</Link>
        <div className="d-flex align-items-center gap-2">
          {status && <small className="text-muted" aria-live="polite">
            <i className={`bi bi-${saving ? 'arrow-repeat' : isDirty ? 'pencil' : 'cloud-check'} me-1`} />{status}
          </small>}
          {!isNew && (
            <Dropdown label="More actions" toggle={<i className="bi bi-three-dots-vertical" />}>
              <button className="dropdown-item" onClick={() => toggle(noteService.togglePin, (n) => (n.isPinned ? 'Note pinned' : 'Note unpinned'))}>
                <i className="bi bi-pin-angle me-2" />{note!.isPinned ? 'Unpin' : 'Pin'}</button>
              <button className="dropdown-item" onClick={() => toggle(noteService.toggleArchive, (n) => (n.isArchived ? 'Note archived' : 'Note unarchived'))}>
                <i className="bi bi-archive me-2" />{note!.isArchived ? 'Unarchive' : 'Archive'}</button>
              <button className="dropdown-item" onClick={() => setShowReminder(true)}><i className="bi bi-bell me-2" />Set reminder</button>
              <hr className="dropdown-divider" />
              <button className="dropdown-item" onClick={() => exportNote('markdown')}><i className="bi bi-markdown me-2" />Export Markdown</button>
              <button className="dropdown-item" onClick={() => exportNote('pdf')}><i className="bi bi-file-earmark-pdf me-2" />Export PDF</button>
              <hr className="dropdown-divider" />
              <button className="dropdown-item text-danger" onClick={() => setShowDelete(true)}><i className="bi bi-trash me-2" />Delete</button>
            </Dropdown>
          )}
          <Button onClick={handleSave} loading={saving && isNew} disabled={isNew ? !canSave : !isDirty || !canSave} icon="check2">
            {isNew ? 'Create note' : 'Save'}
          </Button>
        </div>
      </div>

      <Alert>{error}</Alert>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-3 p-md-4">
          <label htmlFor="note-title" className="visually-hidden">Title</label>
          <input id="note-title" className={`form-control title-input ${fieldErrors.title ? 'is-invalid' : ''}`} placeholder="Untitled note"
            value={title} maxLength={MAX_TITLE} autoFocus={isNew} onChange={(e) => setTitle(e.target.value)} />
          {fieldErrors.title && <div className="invalid-feedback d-block">{fieldErrors.title}</div>}

          <div className="my-3"><TagInput tags={tags} onChange={setTags} error={fieldErrors.tags} /></div>

          <label htmlFor="note-content" className="visually-hidden">Content</label>
          <RichTextEditor value={content} onChange={setContent} invalid={!!fieldErrors.content} placeholder="Start writing…" />
          {fieldErrors.content && <div className="invalid-feedback d-block">{fieldErrors.content}</div>}

          <div className="d-flex justify-content-between text-muted small mt-2">
            <span>{content.length.toLocaleString()} / {MAX_CONTENT.toLocaleString()} characters</span>
            {note && <span>Created {formatDateTime(note.createdAt)}</span>}
          </div>
        </div>
      </div>

      {!isNew && <ReminderModal show={showReminder} noteId={noteId} onClose={() => setShowReminder(false)} />}
      <ConfirmModal show={showDelete} title="Delete note?" message="This will permanently delete the note and its reminders." confirmText="Delete"
        onConfirm={handleDelete} onClose={() => setShowDelete(false)} />
    </>
  );
}
