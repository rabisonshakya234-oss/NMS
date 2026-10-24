'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  icon?: string;
  children: ReactNode;
  onClick?: () => void;
}

// Link that highlights itself on the current page.
export default function NavLink({ href, icon, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} onClick={onClick} className={`nav-link ${active ? 'active fw-semibold' : ''}`} aria-current={active ? 'page' : undefined}>
      {icon && <i className={`bi bi-${icon} me-1`} />}{children}
    </Link>
  );
}
