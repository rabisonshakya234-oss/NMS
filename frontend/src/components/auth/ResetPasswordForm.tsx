'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AuthCard from './AuthCard';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import useForm from '@/hooks/useForm';
import { useToast } from '@/context/ToastContext';
import * as authService from '@/services/authService';
import { compact, validateMatch, validatePassword } from '@/lib/validators';

export default function ResetPasswordForm() {
  const { token } = useParams<{ token: string }>(); // from the URL: /reset-password/<token>
  const router = useRouter();
  const toast = useToast();

  const form = useForm(
    { password: '', confirmPassword: '' },
    async (values) => {
      await authService.resetPassword(token, values);
      toast.success('Password reset. You can now sign in.');
      router.replace('/login');
    },
    (v) => compact({ password: validatePassword(v.password), confirmPassword: validateMatch(v.password, v.confirmPassword) })
  );

  return (
    <AuthCard title="Choose a new password" subtitle="Pick a strong password you have not used before."
      footer={<Link href="/forgot-password">Request a new link</Link>}>
      <Alert>{form.formError}</Alert>
      <form onSubmit={form.handleSubmit} noValidate>
        <FormField label="New password" name="password" type="password" autoComplete="new-password"
          hint="At least 8 characters with a letter and a number."
          value={form.values.password} onChange={form.handleChange} error={form.errors.password} />
        <FormField label="Confirm new password" name="confirmPassword" type="password" autoComplete="new-password"
          value={form.values.confirmPassword} onChange={form.handleChange} error={form.errors.confirmPassword} />
        <Button type="submit" className="w-100" loading={form.submitting}>Reset password</Button>
      </form>
    </AuthCard>
  );
}
