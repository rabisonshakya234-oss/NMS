import AuthGuard from '@/components/auth/AuthGuard';
import AppNavbar from '@/components/layout/AppNavbar';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Everything inside the (app) folder is private: login required, hidden from search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppNavbar />
      <main id="main" className="container py-4">{children}</main>
    </AuthGuard>
  );
}
