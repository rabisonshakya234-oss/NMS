import EditNote from '@/components/notes/EditNote';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Edit note' };

export default function EditNotePage() {
  return <EditNote />;
}
