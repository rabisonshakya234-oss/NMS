'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface DropdownProps {
  toggle: ReactNode;
  align?: 'start' | 'end';
  buttonClass?: string;
  label?: string;
  children: ReactNode;
}

// Bootstrap dropdown controlled by React. Put <button className="dropdown-item"> elements inside.
//   toggle: content of the button (text / icon)   align: 'start' | 'end'
export default function Dropdown({ toggle, align = 'end', buttonClass = 'btn btn-outline-secondary', label, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => ref.current && !ref.current.contains(event.target as Node) && setOpen(false);
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div className="dropdown" ref={ref}>
      <button type="button" className={buttonClass} aria-expanded={open} aria-haspopup="true" aria-label={label} onClick={() => setOpen(!open)}>
        {toggle}
      </button>
      {/* Clicking any item inside closes the menu */}
      <div className={`dropdown-menu shadow border-0 ${align === 'end' ? 'dropdown-menu-end' : ''} ${open ? 'show' : ''}`}
        style={open ? { position: 'absolute', inset: '100% 0 auto auto' } : undefined} onClick={() => setOpen(false)}>
        {children}
      </div>
    </div>
  );
}
