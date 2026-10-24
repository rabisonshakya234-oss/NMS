import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset password',
  robots: { index: false, follow: false },
  referrer: 'no-referrer', // keep the secret token out of Referer headers
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
