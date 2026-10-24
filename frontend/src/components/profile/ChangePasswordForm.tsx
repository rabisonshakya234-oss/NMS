'use client';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import useForm from '@/hooks/useForm';
import { useToast } from '@/context/ToastContext';
import * as authService from '@/services/authService';
import { compact, validateMatch, validatePassword } from '@/lib/validators';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePasswordForm() {
  const toast = useToast();

  const form = useForm(
    EMPTY,
    async (values) => {
      await authService.changePassword(values);
      toast.success('Password changed');
      form.reset();
    },
    (v) => compact({
      currentPassword: v.currentPassword ? '' : 'Enter your current password',
      newPassword: validatePassword(v.newPassword),
      confirmPassword: validateMatch(v.newPassword, v.confirmPassword),
    })
  );

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Change password</h2>
        <Alert>{form.formError}</Alert>
        <form onSubmit={form.handleSubmit} noValidate>
          <FormField label="Current password" name="currentPassword" type="password" autoComplete="current-password"
            value={form.values.currentPassword} onChange={form.handleChange} error={form.errors.currentPassword} />
          <FormField label="New password" name="newPassword" type="password" autoComplete="new-password"
            hint="At least 8 characters with a letter and a number."
            value={form.values.newPassword} onChange={form.handleChange} error={form.errors.newPassword} />
          <FormField label="Confirm new password" name="confirmPassword" type="password" autoComplete="new-password"
            value={form.values.confirmPassword} onChange={form.handleChange} error={form.errors.confirmPassword} />
          <div className="text-end"><Button type="submit" loading={form.submitting}>Update password</Button></div>
        </form>
      </div>
    </div>
  );
}
