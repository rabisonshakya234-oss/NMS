import AskView from '@/components/notes/AskView';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Ask AI' };

export default function AskPage() {
  return <AskView />;
}
