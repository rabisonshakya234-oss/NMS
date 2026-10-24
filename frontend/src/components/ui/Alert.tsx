import type { ReactNode } from 'react';

interface AlertProps {
  type?: 'danger' | 'success' | 'warning' | 'info';
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
}

// type: danger | success | warning | info
export default function Alert({ type = 'danger', children, onClose, className = '' }: AlertProps) {
  if (!children) return null;
  return (
    <div className={`alert alert-${type} d-flex align-items-start gap-2 ${className}`} role="alert">
      <div className="flex-grow-1">{children}</div>
      {onClose && <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />}
    </div>
  );
}
