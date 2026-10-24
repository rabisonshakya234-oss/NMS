'use client';
import Link from 'next/link';
import { useState } from 'react';
import Brand from './Brand';
import NavLink from './NavLink';
import Dropdown from '@/components/ui/Dropdown';
import { useAuth } from '@/context/AuthContext';
import { initials } from '@/lib/format';

// Navbar for the logged-in area.
export default function AppNavbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const close = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Brand href="/notes" />
        <button className="navbar-toggler" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mt-2 mt-lg-0">
            <li className="nav-item"><NavLink href="/notes" icon="journal-text" onClick={close}>Notes</NavLink></li>
            <li className="nav-item"><NavLink href="/reminders" icon="bell" onClick={close}>Reminders</NavLink></li>
            <li className="nav-item"><NavLink href="/ask" icon="stars" onClick={close}>Ask AI</NavLink></li>
            {user?.role === 'admin' && <li className="nav-item"><NavLink href="/admin/users" icon="people" onClick={close}>Users</NavLink></li>}
          </ul>

          <div className="d-flex align-items-center gap-2 py-2 py-lg-0">
            <Link href="/notes/new" className="btn btn-primary btn-sm" onClick={close}><i className="bi bi-plus-lg me-1" />New note</Link>
            <Dropdown label="Account menu" buttonClass="btn btn-light d-flex align-items-center gap-2 border"
              toggle={<><span className="avatar">{initials(user?.username)}</span><span className="d-none d-sm-inline">{user?.username}</span></>}>
              <div className="dropdown-header">{user?.email}</div>
              <Link href="/profile" className="dropdown-item" onClick={close}><i className="bi bi-person me-2" />Profile & security</Link>
              <hr className="dropdown-divider" />
              <button className="dropdown-item text-danger" onClick={logout}><i className="bi bi-box-arrow-right me-2" />Sign out</button>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
}
