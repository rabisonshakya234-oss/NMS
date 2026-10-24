import Link from 'next/link';
import Brand from './Brand';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-dark text-white-50 py-5 mt-auto">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-6">
            <Brand light />
            <p className="mt-2 mb-0 small">{SITE_TAGLINE}. Write it down once, find it forever.</p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="h6 text-white">Product</h2>
            <ul className="list-unstyled small mb-0">
              <li><a className="footer-link" href="/#features">Features</a></li>
              <li><a className="footer-link" href="/#ai">AI assistant</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="h6 text-white">Account</h2>
            <ul className="list-unstyled small mb-0">
              <li><Link className="footer-link" href="/login">Sign in</Link></li>
              <li><Link className="footer-link" href="/register">Create account</Link></li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <p className="small mb-0">&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
