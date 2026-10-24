import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your account to access your notes, reminders and AI assistant.',
  alternates: { canonical: '/login' },
};

export default function LoginPage() {
  return <LoginForm />;
}
