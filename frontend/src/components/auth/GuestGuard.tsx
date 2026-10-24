'use client';
import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/Spinner';

// Wrap login / register pages. People who are already logged in go to their notes.
export default function GuestGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!loading && user) router.replace('/notes'); }, [loading, user, router]);

  if (loading || user) return <PageLoader />;
  return children;
}
