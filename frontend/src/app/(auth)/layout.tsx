import Link from 'next/link';
import Brand from '@/components/layout/Brand';
import GuestGuard from '@/components/auth/GuestGuard';
import type { ReactNode } from 'react';

// Shared frame for login / register / forgot / reset pages.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="py-3 bg-white border-bottom">
        <div className="container d-flex justify-content-between align-items-center">
          <Brand />
          <Link href="/" className="small text-decoration-none"><i className="bi bi-arrow-left me-1" />Back to home</Link>
        </div>
      </header>
      <main id="main" className="auth-wrap py-4">
        <div className="container"><GuestGuard>{children}</GuestGuard></div>
      </main>
    </>
  );
}
