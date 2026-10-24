'use client';
import { useParams } from 'next/navigation';
import NoteEditor from './NoteEditor';

// Reads :id from the URL and opens the editor for that note.
export default function EditNote() {
  const { id } = useParams<{ id: string }>();
  return <NoteEditor noteId={id} />;
}
