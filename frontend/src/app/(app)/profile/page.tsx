import ProfileView from '@/components/profile/ProfileView';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Profile & security' };

export default function ProfilePage() {
  return <ProfileView />;
}
