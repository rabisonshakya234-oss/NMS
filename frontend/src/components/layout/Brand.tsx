import Link from 'next/link';
import { SITE_NAME } from '@/lib/config';

export default function Brand({ href = '/', light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className={`navbar-brand d-flex align-items-center gap-2 fw-bold ${light ? 'text-white' : ''}`}>
      <span className="brand-mark"><i className="bi bi-journal-richtext" /></span>
      {SITE_NAME}
    </Link>
  );
}
