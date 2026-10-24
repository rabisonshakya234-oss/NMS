import Link from 'next/link';
import SiteNavbar from '@/components/layout/SiteNavbar';
import Footer from '@/components/layout/Footer';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} – Smart Note Taking with Tags, Reminders & AI Search` },
  alternates: { canonical: '/' },
};

const features = [
  { icon: 'pin-angle', title: 'Pin & archive', text: 'Keep what matters on top and tuck old notes away without deleting them.' },
  { icon: 'tags', title: 'Tags & search', text: 'Filter by tag, search titles and content, and sort the way you think.' },
  { icon: 'cloud-check', title: 'Auto-save', text: 'Type freely. Your changes are saved in the background every few seconds.' },
  { icon: 'bell', title: 'Email reminders', text: 'Attach a reminder to any note and get an email at exactly the right time.' },
  { icon: 'download', title: 'Export anywhere', text: 'Download a single note or your whole library as Markdown or PDF.' },
  { icon: 'shield-lock', title: 'Private by design', text: 'Your notes belong to you. Secure sign-in and password reset by email.' },
];

const steps = [
  { title: 'Create your account', text: 'Sign up in under a minute with just an email and password.' },
  { title: 'Write and organize', text: 'Capture ideas, add tags, pin favorites and let auto-save do the rest.' },
  { title: 'Find anything fast', text: 'Search, filter, or simply ask the AI assistant a question.' },
];

// Structured data helps Google understand the product (rich results).
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNavbar />

      <main id="main">
        {/* Hero */}
        <section className="hero py-5">
          <div className="container py-lg-5">
            <div className="row align-items-center gy-5">
              <div className="col-lg-6">
                <span className="badge rounded-pill text-bg-light mb-3 px-3 py-2"><i className="bi bi-stars me-1 text-primary" />Now with AI-powered note search</span>
                <h1 className="display-4 fw-bold mb-3">Your notes, organized and always within reach</h1>
                <p className="lead mb-4">{SITE_NAME} helps you capture ideas, plan projects and remember everything, with tags, reminders, auto-save and an AI assistant that answers questions from your own notes.</p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href="/register" className="btn btn-light btn-lg fw-semibold text-primary px-4">Start for free</Link>
                  <Link href="/login" className="btn btn-outline-light btn-lg px-4">Sign in</Link>
                </div>
              </div>

              <div className="col-lg-6" aria-hidden="true">
                <div className="mock-window">
                  <div className="mock-bar"><span /><span /><span /></div>
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h2 className="h5 mb-0">Trip planning</h2><i className="bi bi-pin-angle-fill text-primary" />
                    </div>
                    <p className="text-muted small">Book flights by Friday, reserve the hotel near the old town and pack hiking boots…</p>
                    <span className="badge tag-badge me-1">travel</span><span className="badge tag-badge">2026</span>
                    <hr />
                    <div className="bg-primary-soft rounded-3 p-3 small">
                      <i className="bi bi-stars text-primary me-1" /><strong>Ask AI:</strong> &ldquo;What did I plan for the trip?&rdquo;
                      <div className="mt-2 text-muted">Flights by Friday, a hotel near the old town, and hiking boots.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-5">
          <div className="container py-lg-4">
            <div className="text-center mx-auto mb-5" style={{ maxWidth: 640 }}>
              <h2 className="fw-bold">Everything you need to stay organized</h2>
              <p className="text-muted">Simple enough for quick thoughts, powerful enough for your whole second brain.</p>
            </div>
            <div className="row g-4">
              {features.map((f) => (
                <div className="col-md-6 col-lg-4" key={f.title}>
                  <div className="card h-100 border-0 shadow-sm card-lift">
                    <div className="card-body p-4">
                      <span className="feature-icon mb-3"><i className={`bi bi-${f.icon}`} /></span>
                      <h3 className="h5">{f.title}</h3>
                      <p className="text-muted mb-0">{f.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-5 bg-white">
          <div className="container py-lg-4">
            <h2 className="fw-bold text-center mb-5">How it works</h2>
            <ol className="row g-4 list-unstyled mb-0">
              {steps.map((s, i) => (
                <li className="col-md-4 text-center" key={s.title}>
                  <span className="step-number mb-3">{i + 1}</span>
                  <h3 className="h5">{s.title}</h3>
                  <p className="text-muted mb-0">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* AI */}
        <section id="ai" className="py-5">
          <div className="container py-lg-4">
            <div className="row align-items-center gy-4">
              <div className="col-lg-6">
                <h2 className="fw-bold">Ask your notes, get answers</h2>
                <p className="text-muted">Stop scrolling through old notes. Ask a question in plain English and the AI assistant answers using only what you wrote, and shows you which notes it used.</p>
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2" />Answers based on your own notes only</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2" />Links to the source notes</li>
                  <li><i className="bi bi-check-circle-fill text-primary me-2" />Works with tags, reminders and archives</li>
                </ul>
              </div>
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm"><div className="card-body p-4">
                  <p className="mb-2 small text-muted">You asked</p>
                  <p className="fw-semibold">When is my dentist appointment?</p>
                  <p className="mb-2 small text-muted">Answer</p>
                  <p className="mb-0">Your appointment is on Thursday at 4 PM, according to your note &ldquo;Weekly to-do&rdquo;.</p>
                </div></div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-5 bg-primary text-white text-center">
          <div className="container py-3">
            <h2 className="fw-bold">Ready to get organized?</h2>
            <p className="mb-4 opacity-75">Create your free account and write your first note today.</p>
            <Link href="/register" className="btn btn-light btn-lg fw-semibold text-primary px-4">Create free account</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
