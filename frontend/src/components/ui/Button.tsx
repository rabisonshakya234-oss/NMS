import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: string;
  icon?: string;
  size?: string;
}

// Bootstrap button with a built-in loading state.
export default function Button({ children, loading = false, variant = 'primary', icon, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" /> : icon && <i className={`bi bi-${icon} me-2`} />}
      {children}
    </button>
  );
}
