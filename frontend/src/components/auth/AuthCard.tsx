// White card used by all auth forms.
import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="auth-card">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 fw-bold mb-1">{title}</h1>
          {subtitle && <p className="text-muted mb-4">{subtitle}</p>}
          {children}
        </div>
      </div>
      {footer && <p className="text-center text-muted mt-3 mb-0">{footer}</p>}
    </div>
  );
}
