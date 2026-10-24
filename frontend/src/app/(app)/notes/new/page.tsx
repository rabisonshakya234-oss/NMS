import NoteEditor from '@/components/notes/NoteEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New note' };

export default function NewNotePage() {
  return <NoteEditor />;
}
