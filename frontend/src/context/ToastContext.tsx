'use client';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'danger' | 'primary';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);
let nextId = 1;

// Usage: const toast = useToast();  toast.success('Saved');  toast.error('Failed');
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((list) => [...list, { id, type, message }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  const api = useMemo(() => ({
    success: (message: string) => show('success', message),
    error: (message: string) => show('danger', message),
    info: (message: string) => show('primary', message),
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2000 }} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast show align-items-center text-bg-${t.type} border-0`} role="status">
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => remove(t.id)} />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext) as ToastApi;
