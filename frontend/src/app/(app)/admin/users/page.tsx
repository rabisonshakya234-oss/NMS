import UsersView from '@/components/profile/UsersView';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Users' };

export default function UsersPage() {
  return <UsersView />;
}
