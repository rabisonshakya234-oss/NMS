import NotesView from '@/components/notes/NotesView';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My notes' };

export default function NotesPage() {
  return <NotesView />;
}
