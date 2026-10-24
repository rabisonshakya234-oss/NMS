export function Spinner({ small = false }: { small?: boolean }) {
  return (
    <div className={`spinner-border text-primary ${small ? 'spinner-border-sm' : ''}`} role="status">
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}

export function PageLoader({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted gap-3">
      <Spinner />
      <span>{text}</span>
    </div>
  );
}
