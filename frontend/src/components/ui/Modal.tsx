'use client';
import { useEffect, useId, type ReactNode } from 'react';

interface ModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: string;
}

// Bootstrap modal controlled by React (no Bootstrap JavaScript needed).
export default function Modal({ show, title, onClose, children, footer, size }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!show) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId}
        onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <div className={`modal-dialog modal-dialog-centered ${size ? `modal-${size}` : ''}`}>
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id={titleId}>{title}</h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
