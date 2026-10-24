'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import NoteCard from './NoteCard';
import NoteFilters from './NoteFilters';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Dropdown from '@/components/ui/Dropdown';
import EmptyState from '@/components/ui/EmptyState';
import PageHeader from '@/components/ui/PageHeader';
import Pagination from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import useDebounce from '@/hooks/useDebounce';
import * as noteService from '@/services/noteService';
import { NOTES_PER_PAGE } from '@/lib/config';
import type { BulkAction, ExportFormat, Note, NoteFilterState, Pagination as PaginationData } from '@/types';

const DEFAULT_FILTERS: NoteFilterState = { view: 'all', search: '', tag: '', sortBy: 'updatedAt', order: 'desc', page: 1 };

export default function NotesView() {
  const toast = useToast();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [confirm, setConfirm] = useState<{ ids: string[]; label: string; bulk?: boolean } | null>(null); // { ids, label } waiting for delete confirmation
  const [busy, setBusy] = useState(false);

  const search = useDebounce(filters.search, 400);
  const reload = () => setReloadKey((n) => n + 1);

  // Any filter change goes back to page 1.
  const changeFilters = (patch: Partial<NoteFilterState>) => { setFilters((f) => ({ ...f, ...patch, page: 1 })); setSelected([]); };

  // Load notes whenever a filter, the page or reloadKey changes.
  useEffect(() => {
    let cancelled = false; // ignore answers that arrive after a newer request was made
    setLoading(true);
    noteService.listNotes({
      page: filters.page,
      limit: NOTES_PER_PAGE,
      search,
      tag: filters.tag,
      sortBy: filters.sortBy,
      order: filters.order,
      isArchived: filters.view === 'archived' ? true : undefined,
      isPinned: filters.view === 'pinned' ? true : undefined,
    })
      .then((data) => { if (!cancelled) { setNotes(data.notes); setPagination(data.pagination); setError(''); } })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [filters.page, filters.tag, filters.sortBy, filters.order, filters.view, search, reloadKey]);

  // Tag list for the filter (refresh after changes, because tags can appear or disappear).
  useEffect(() => { noteService.listTags().then((d) => setTags(d.tags)).catch(() => {}); }, [reloadKey]);

  const run = async (action: () => Promise<unknown>, successText: string) => {
    try { await action(); toast.success(successText); reload(); }
    catch (e) { toast.error(e.message); }
  };

  const toggleSelect = (id: string) => setSelected((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  const allSelected = notes.length > 0 && selected.length === notes.length;

  const handleBulk = async (action: BulkAction) => {
    await run(() => noteService.bulkAction(selected, action), `Done: ${action} ${selected.length} note(s)`);
    setSelected([]);
  };

  const confirmDelete = async () => {
    setBusy(true);
    await run(() => (confirm!.ids.length === 1 && !confirm!.bulk ? noteService.deleteNote(confirm!.ids[0]) : noteService.bulkAction(confirm!.ids, 'delete')), 'Deleted');
    setSelected((list) => list.filter((id) => !confirm!.ids.includes(id)));
    setBusy(false);
    setConfirm(null);
  };

  const hasFilters = filters.search || filters.tag || filters.view !== 'all';
  const exportAll = (format: ExportFormat) => noteService.exportNotes(format).catch((e) => toast.error(e.message));

  return (
    <>
      <PageHeader title="My notes" subtitle={pagination ? `${pagination.total} note${pagination.total === 1 ? '' : 's'}` : ' '}
        actions={<>
          <Dropdown label="Export all notes" toggle={<><i className="bi bi-download me-2" />Export all</>}>
            <button className="dropdown-item" onClick={() => exportAll('markdown')}><i className="bi bi-markdown me-2" />Markdown (.md)</button>
            <button className="dropdown-item" onClick={() => exportAll('pdf')}><i className="bi bi-file-earmark-pdf me-2" />PDF</button>
          </Dropdown>
          <Link href="/notes/new" className="btn btn-primary"><i className="bi bi-plus-lg me-2" />New note</Link>
        </>} />

      <NoteFilters filters={filters} tags={tags} onChange={changeFilters} />

      {selected.length > 0 && (
        <div className="bulk-bar alert alert-primary d-flex flex-wrap align-items-center gap-2 py-2 shadow-sm">
          <input type="checkbox" className="form-check-input" checked={allSelected} aria-label="Select all notes on this page"
            onChange={() => setSelected(allSelected ? [] : notes.map((n) => n._id))} />
          <strong className="me-auto">{selected.length} selected</strong>
          <Button size="sm" variant="light" icon="pin-angle" onClick={() => handleBulk('pin')}>Pin</Button>
          <Button size="sm" variant="light" icon="pin" onClick={() => handleBulk('unpin')}>Unpin</Button>
          <Button size="sm" variant="light" icon="archive" onClick={() => handleBulk(filters.view === 'archived' ? 'unarchive' : 'archive')}>
            {filters.view === 'archived' ? 'Unarchive' : 'Archive'}
          </Button>
          <Button size="sm" variant="danger" icon="trash" onClick={() => setConfirm({ ids: selected, bulk: true, label: `${selected.length} selected note(s)` })}>Delete</Button>
          <button className="btn-close" aria-label="Clear selection" onClick={() => setSelected([])} />
        </div>
      )}

      <Alert>{error}</Alert>

      {loading && notes.length === 0 ? <PageLoader text="Loading your notes…" /> : notes.length === 0 && !error ? (
        <EmptyState icon={hasFilters ? 'search' : 'journal-plus'}
          title={hasFilters ? 'No notes match your filters' : 'Write your first note'}
          text={hasFilters ? 'Try a different search word, tag or view.' : 'Capture an idea, a to-do list or anything you want to remember.'}
          action={hasFilters
            ? <button className="btn btn-outline-primary" onClick={() => changeFilters({ view: 'all', search: '', tag: '' })}>Clear filters</button>
            : <Link href="/notes/new" className="btn btn-primary">Create a note</Link>} />
      ) : (
        <div className={loading ? 'opacity-50' : ''} aria-busy={loading}>
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {notes.map((note) => (
              <div className="col" key={note._id}>
                <NoteCard note={note} selected={selected.includes(note._id)} onSelect={toggleSelect}
                  onPin={(n) => run(() => noteService.togglePin(n._id), n.isPinned ? 'Note unpinned' : 'Note pinned')}
                  onArchive={(n) => run(() => noteService.toggleArchive(n._id), n.isArchived ? 'Note unarchived' : 'Note archived')}
                  onDelete={(n) => setConfirm({ ids: [n._id], label: `“${n.title}”` })} />
              </div>
            ))}
          </div>
          <Pagination pagination={pagination} onChange={(page) => { setFilters((f) => ({ ...f, page })); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>
      )}

      <ConfirmModal show={!!confirm} title="Delete note?" message={`This will permanently delete ${confirm?.label}. This cannot be undone.`}
        confirmText="Delete" loading={busy} onConfirm={confirmDelete} onClose={() => setConfirm(null)} />
    </>
  );
}
