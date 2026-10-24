import Link from 'next/link';
import Dropdown from '@/components/ui/Dropdown';
import { excerpt, timeAgo } from '@/lib/format';
import type { Note } from '@/types';

interface NoteCardProps {
  note: Note;
  selected: boolean;
  onSelect: (id: string) => void;
  onPin: (note: Note) => void;
  onArchive: (note: Note) => void;
  onDelete: (note: Note) => void;
}

// One note in the grid. All actions are handled by the parent through callbacks.
export default function NoteCard({ note, selected, onSelect, onPin, onArchive, onDelete }: NoteCardProps) {
  return (
    <div className={`card h-100 border-0 shadow-sm note-card ${selected ? 'selected' : ''}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start gap-2 mb-2">
          <input type="checkbox" className="form-check-input mt-2" checked={selected} onChange={() => onSelect(note._id)} aria-label={`Select ${note.title}`} />
          <h2 className="h6 mb-0 flex-grow-1 pt-1" style={{ wordBreak: 'break-word' }}>
            <Link href={`/notes/${note._id}`} className="note-title">{note.title}</Link>
          </h2>
          {note.isPinned && <i className="bi bi-pin-angle-fill text-primary" title="Pinned" />}
        </div>

        <p className="text-muted small note-excerpt flex-grow-1">{excerpt(note.content)}</p>

        {note.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {note.tags.slice(0, 4).map((tag) => <span key={tag} className="badge tag-badge">{tag}</span>)}
            {note.tags.length > 4 && <span className="badge text-bg-light">+{note.tags.length - 4}</span>}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <small className="text-muted">{timeAgo(note.updatedAt)}</small>
          <Dropdown label={`Actions for ${note.title}`} buttonClass="btn btn-sm btn-light" toggle={<i className="bi bi-three-dots" />}>
            <Link href={`/notes/${note._id}`} className="dropdown-item"><i className="bi bi-pencil me-2" />Open & edit</Link>
            <button className="dropdown-item" onClick={() => onPin(note)}><i className={`bi bi-pin-angle${note.isPinned ? '-fill' : ''} me-2`} />{note.isPinned ? 'Unpin' : 'Pin'}</button>
            <button className="dropdown-item" onClick={() => onArchive(note)}><i className="bi bi-archive me-2" />{note.isArchived ? 'Unarchive' : 'Archive'}</button>
            <hr className="dropdown-divider" />
            <button className="dropdown-item text-danger" onClick={() => onDelete(note)}><i className="bi bi-trash me-2" />Delete</button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
