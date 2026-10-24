'use client';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import useForm from '@/hooks/useForm';
import { useAuth, type AuthContextValue } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as userService from '@/services/userService';
import { compact, validateUsername } from '@/lib/validators';
import type { User } from '@/types';

export default function ProfileForm() {
  const { user, setUser } = useAuth() as AuthContextValue & { user: User };
  const toast = useToast();

  const form = useForm(
    { username: user.username },
    async ({ username }) => {
      const data = await userService.updateProfile(username.trim());
      setUser(data.user);
      toast.success('Profile updated');
    },
    (v) => compact({ username: validateUsername(v.username) })
  );

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Profile</h2>
        <Alert>{form.formError}</Alert>
        <form onSubmit={form.handleSubmit} noValidate>
          <FormField label="Email" value={user.email} disabled readOnly hint="Your email cannot be changed." />
          <FormField label="Username" name="username" autoComplete="username"
            value={form.values.username} onChange={form.handleChange} error={form.errors.username} />
          <div className="d-flex align-items-center justify-content-between">
            <span className="badge text-bg-light text-capitalize">{user.role} account</span>
            <Button type="submit" loading={form.submitting} disabled={form.values.username.trim() === user.username}>Save changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
