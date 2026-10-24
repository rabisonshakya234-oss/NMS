import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main id="main" className="container py-5 text-center">
      <p className="display-1 fw-bold text-primary mb-0">404</p>
      <h1 className="h3 mb-3">We can&apos;t find that page</h1>
      <p className="text-muted">The link may be broken or the page may have been moved.</p>
      <Link href="/" className="btn btn-primary">Back to home</Link>
    </main>
  );
}
