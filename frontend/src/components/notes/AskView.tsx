'use client';
import { useState } from 'react';
import Link from 'next/link';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import * as aiService from '@/services/aiService';
import type { AskAnswer } from '@/types';

const EXAMPLES = ['What are my open to-dos?', 'Summarize my notes about work', 'What did I plan for the trip?'];

export default function AskView() {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<(AskAnswer & { question: string })[]>([]); // newest first: { question, answer, sources }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setLoading(true);
    setError('');
    try {
      const data = await aiService.askNotes(q);
      setHistory((list) => [{ question: q, ...data }, ...list]);
      setQuestion('');
    } catch (e) {
      setError(e.errors?.[0]?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 820 }}>
      <PageHeader title="Ask your notes" subtitle="Ask a question in plain English. The answer comes only from your own notes." />

      <form className="card border-0 shadow-sm mb-3" onSubmit={(e) => { e.preventDefault(); ask(question); }}>
        <div className="card-body">
          <label htmlFor="question" className="visually-hidden">Your question</label>
          <textarea id="question" className="form-control mb-3" rows={3} maxLength={500} placeholder="e.g. When is my dentist appointment?"
            value={question} onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) ask(question); }} />
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <small className="text-muted">{question.length}/500 &middot; Ctrl+Enter to send</small>
            <Button type="submit" loading={loading} disabled={!question.trim()} icon="stars">Ask</Button>
          </div>
        </div>
      </form>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {EXAMPLES.map((text) => (
          <button key={text} type="button" className="btn btn-sm btn-outline-primary rounded-pill" disabled={loading} onClick={() => ask(text)}>{text}</button>
        ))}
      </div>

      <Alert onClose={() => setError('')}>{error}</Alert>

      {history.map((item, i) => (
        <div className="card border-0 shadow-sm mb-3" key={`${item.question}-${i}`}>
          <div className="card-body">
            <p className="small text-muted mb-1"><i className="bi bi-person me-1" />You asked</p>
            <p className="fw-semibold">{item.question}</p>
            <p className="small text-muted mb-1"><i className="bi bi-stars me-1 text-primary" />Answer</p>
            <p className="ai-answer mb-0">{item.answer}</p>
            {item.sources?.length > 0 && (
              <div className="mt-3 pt-3 border-top">
                <span className="small text-muted me-2">Sources:</span>
                {item.sources.map((s) => (
                  <Link key={s.id} href={`/notes/${s.id}`} className="badge tag-badge text-decoration-none me-1">
                    <i className="bi bi-journal-text me-1" />{s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
