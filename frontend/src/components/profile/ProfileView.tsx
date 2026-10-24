'use client';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function ProfileView() {
  const { logout } = useAuth();
  return (
    <>
      <PageHeader title="Profile & security" subtitle="Manage your account details and password."
        actions={<Button variant="outline-danger" icon="box-arrow-right" onClick={logout}>Sign out</Button>} />
      <div className="row g-4">
        <div className="col-lg-6"><ProfileForm /></div>
        <div className="col-lg-6"><ChangePasswordForm /></div>
      </div>
    </>
  );
}
