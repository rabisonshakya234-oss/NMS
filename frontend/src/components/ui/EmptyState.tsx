import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  text?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon = 'journal-text', title, text, action }: EmptyStateProps) {
  return (
    <div className="text-center py-5 px-3">
      <div className="empty-icon mx-auto mb-3"><i className={`bi bi-${icon}`} /></div>
      <h2 className="h5">{title}</h2>
      {text && <p className="text-muted mx-auto" style={{ maxWidth: 420 }}>{text}</p>}
      {action}
    </div>
  );
}
