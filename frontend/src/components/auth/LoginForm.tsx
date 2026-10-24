'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from './AuthCard';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import useForm from '@/hooks/useForm';
import { useAuth } from '@/context/AuthContext';
import { compact, validateEmail } from '@/lib/validators';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm(
    { email: '', password: '' },
    async (values) => { await login(values); router.replace('/notes'); },
    (v) => compact({ email: validateEmail(v.email), password: v.password ? '' : 'Password is required' })
  );

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to access your notes."
      footer={<>New here? <Link href="/register">Create an account</Link></>}>
      <Alert>{form.formError}</Alert>
      <form onSubmit={form.handleSubmit} noValidate>
        <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
          value={form.values.email} onChange={form.handleChange} error={form.errors.email} />
        <FormField label="Password" name="password" type="password" autoComplete="current-password"
          value={form.values.password} onChange={form.handleChange} error={form.errors.password} />
        <div className="text-end mb-3"><Link href="/forgot-password" className="small">Forgot password?</Link></div>
        <Button type="submit" className="w-100" loading={form.submitting}>Sign in</Button>
      </form>
    </AuthCard>
  );
}
