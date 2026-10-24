'use client';
import Link from 'next/link';
import { useState } from 'react';
import Brand from './Brand';
import { useAuth } from '@/context/AuthContext';

// Navbar for the public landing page.
export default function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Brand />
        <button className="navbar-toggler" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item"><a className="nav-link" href="#features" onClick={() => setOpen(false)}>Features</a></li>
            <li className="nav-item"><a className="nav-link" href="#how-it-works" onClick={() => setOpen(false)}>How it works</a></li>
            <li className="nav-item"><a className="nav-link" href="#ai" onClick={() => setOpen(false)}>AI assistant</a></li>
            {!loading && user ? (
              <li className="nav-item"><Link href="/notes" className="btn btn-primary">Open my notes</Link></li>
            ) : (
              <>
                <li className="nav-item"><Link href="/login" className="nav-link">Sign in</Link></li>
                <li className="nav-item"><Link href="/register" className="btn btn-primary">Get started free</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
