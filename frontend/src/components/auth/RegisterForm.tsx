'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from './AuthCard';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import useForm from '@/hooks/useForm';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { compact, validateEmail, validateMatch, validatePassword, validateUsername } from '@/lib/validators';

export default function RegisterForm() {
  const { register } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const form = useForm(
    { username: '', email: '', password: '', confirmPassword: '' },
    async (values) => {
      await register(values);
      toast.success('Account created. Welcome!');
      router.replace('/notes');
    },
    (v) => compact({
      username: validateUsername(v.username),
      email: validateEmail(v.email),
      password: validatePassword(v.password),
      confirmPassword: validateMatch(v.password, v.confirmPassword),
    })
  );

  return (
    <AuthCard title="Create your account" subtitle="Start organizing your notes in minutes."
      footer={<>Already have an account? <Link href="/login">Sign in</Link></>}>
      <Alert>{form.formError}</Alert>
      <form onSubmit={form.handleSubmit} noValidate>
        <FormField label="Username" name="username" autoComplete="username" placeholder="jane_doe"
          value={form.values.username} onChange={form.handleChange} error={form.errors.username} />
        <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
          value={form.values.email} onChange={form.handleChange} error={form.errors.email} />
        <FormField label="Password" name="password" type="password" autoComplete="new-password"
          hint="At least 8 characters with a letter and a number."
          value={form.values.password} onChange={form.handleChange} error={form.errors.password} />
        <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password"
          value={form.values.confirmPassword} onChange={form.handleChange} error={form.errors.confirmPassword} />
        <Button type="submit" className="w-100" loading={form.submitting}>Create account</Button>
      </form>
    </AuthCard>
  );
}
