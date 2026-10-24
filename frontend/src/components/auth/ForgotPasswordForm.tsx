'use client';
import { useState } from 'react';
import Link from 'next/link';
import AuthCard from './AuthCard';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import useForm from '@/hooks/useForm';
import * as authService from '@/services/authService';
import { compact, validateEmail } from '@/lib/validators';

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const form = useForm(
    { email: '' },
    async ({ email }) => { await authService.forgotPassword(email); setSent(true); },
    (v) => compact({ email: validateEmail(v.email) })
  );

  return (
    <AuthCard title="Forgot your password?" subtitle="Enter your email and we will send you a reset link."
      footer={<Link href="/login">Back to sign in</Link>}>
      {sent ? (
        <Alert type="success">If that email is registered, a reset link has been sent. The link works for a short time only.</Alert>
      ) : (
        <>
          <Alert>{form.formError}</Alert>
          <form onSubmit={form.handleSubmit} noValidate>
            <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
              value={form.values.email} onChange={form.handleChange} error={form.errors.email} />
            <Button type="submit" className="w-100" loading={form.submitting}>Send reset link</Button>
          </form>
        </>
      )}
    </AuthCard>
  );
}
