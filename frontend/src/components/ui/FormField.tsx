'use client';
import { useId, useState, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode } from 'react';

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  as?: 'input' | 'textarea' | 'select';
  type?: string;
  className?: string;
  children?: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
}

// Label + input + error message in one piece.
//   as: 'input' (default) | 'textarea' | 'select'
//   type="password" automatically gets a show/hide button.
export default function FormField({ label, error, hint, as = 'input', type = 'text', className = '', children, ...props }: FormFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  const classes = `${as === 'select' ? 'form-select' : 'form-control'} ${error ? 'is-invalid' : ''}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const common: any = { id, className: classes, 'aria-invalid': !!error, 'aria-describedby': describedBy, ...props };

  let control;
  if (as === 'textarea') control = <textarea {...common} />;
  else if (as === 'select') control = <select {...common}>{children}</select>;
  else if (isPassword) {
    control = (
      <div className="input-group has-validation">
        <input {...common} type={visible ? 'text' : 'password'} />
        <button type="button" className="btn btn-outline-secondary" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>
          <i className={`bi bi-eye${visible ? '-slash' : ''}`} />
        </button>
        {error && <div id={`${id}-error`} className="invalid-feedback">{error}</div>}
      </div>
    );
  } else control = <input {...common} type={type} />;

  return (
    <div className={`mb-3 ${className}`}>
      {label && <label htmlFor={id} className="form-label fw-medium">{label}</label>}
      {control}
      {!isPassword && error && <div id={`${id}-error`} className="invalid-feedback">{error}</div>}
      {!error && hint && <div id={`${id}-hint`} className="form-text">{hint}</div>}
    </div>
  );
}
