import RegisterForm from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create your free account',
  description: 'Sign up free and start capturing, organizing and searching your notes with tags, reminders and AI.',
  alternates: { canonical: '/register' },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
