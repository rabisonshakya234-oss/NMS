'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container py-5 text-center">
      <h1 className="h3 mb-3">Something went wrong</h1>
      <p className="text-muted">An unexpected error happened. Please try again.</p>
      <button className="btn btn-primary" onClick={reset}>Try again</button>
    </main>
  );
}
