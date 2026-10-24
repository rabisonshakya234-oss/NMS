'use client';
import type { NoteFilterState } from '@/types';

const VIEWS = [
  { id: 'all', label: 'All notes', icon: 'journal-text' },
  { id: 'pinned', label: 'Pinned', icon: 'pin-angle' },
  { id: 'archived', label: 'Archived', icon: 'archive' },
];

const SORTS = [
  { value: 'updatedAt:desc', label: 'Recently updated' },
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'title:asc', label: 'Title A–Z' },
  { value: 'title:desc', label: 'Title Z–A' },
];

// filters = { view, search, tag, sortBy, order }   onChange(patch) merges a change into the filters
interface NoteFiltersProps {
  filters: NoteFilterState;
  tags: string[];
  onChange: (patch: Partial<NoteFilterState>) => void;
}

export default function NoteFilters({ filters, tags, onChange }: NoteFiltersProps) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <ul className="nav nav-pills mb-3 gap-1">
          {VIEWS.map((v) => (
            <li className="nav-item" key={v.id}>
              <button className={`nav-link py-1 ${filters.view === v.id ? 'active' : 'text-body'}`} style={filters.view === v.id ? { background: 'var(--brand)' } : undefined}
                onClick={() => onChange({ view: v.id })}>
                <i className={`bi bi-${v.icon} me-1`} />{v.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="row g-2">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
              <input type="search" className="form-control" placeholder="Search title or content…" aria-label="Search notes" maxLength={100}
                value={filters.search} onChange={(e) => onChange({ search: e.target.value })} />
            </div>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" aria-label="Filter by tag" value={filters.tag} onChange={(e) => onChange({ tag: e.target.value })}>
              <option value="">All tags</option>
              {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" aria-label="Sort notes" value={`${filters.sortBy}:${filters.order}`}
              onChange={(e) => { const [sortBy, order] = e.target.value.split(':'); onChange({ sortBy, order }); }}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
