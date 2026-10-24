import RemindersView from '@/components/notes/RemindersView';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reminders' };

export default function RemindersPage() {
  return <RemindersView />;
}
