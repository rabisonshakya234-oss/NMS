'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Alert from '@/components/ui/Alert';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import PageHeader from '@/components/ui/PageHeader';
import { PageLoader } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import * as reminderService from '@/services/reminderService';
import { formatDateTime } from '@/lib/format';
import type { Reminder } from '@/types';

export default function RemindersView() {
  const toast = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState<Reminder | null>(null);

  useEffect(() => {
    reminderService.listReminders()
      .then((data) => setReminders(data.reminders))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const remove = async () => {
    try {
      await reminderService.deleteReminder(toDelete!._id);
      setReminders((list) => list.filter((r) => r._id !== toDelete!._id));
      toast.success('Reminder removed');
    } catch (e) { toast.error(e.message); }
    setToDelete(null);
  };

  return (
    <>
      <PageHeader title="Reminders" subtitle="We email you when a reminder is due. Add reminders from any note." />
      <Alert>{error}</Alert>

      {loading ? <PageLoader /> : reminders.length === 0 && !error ? (
        <EmptyState icon="bell" title="No reminders yet" text="Open a note and choose “Set reminder” to get an email at the right time."
          action={<Link href="/notes" className="btn btn-primary">Go to notes</Link>} />
      ) : (
        <div className="card border-0 shadow-sm">
          <ul className="list-group list-group-flush">
            {reminders.map((r) => (
              <li key={r._id} className="list-group-item d-flex flex-wrap align-items-center gap-3 py-3">
                <span className={`badge ${r.isDue ? 'text-bg-secondary' : 'text-bg-success'}`}>{r.isDue ? 'Due' : 'Upcoming'}</span>
                <div className="flex-grow-1">
                  {r.noteTitle === '(deleted note)'
                    ? <span className="text-muted fst-italic">Deleted note</span>
                    : <Link href={`/notes/${r.noteId}`} className="fw-medium text-decoration-none">{r.noteTitle}</Link>}
                  <div className="small text-muted"><i className="bi bi-clock me-1" />{formatDateTime(r.remindAt)}</div>
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => setToDelete(r)} aria-label={`Delete reminder for ${r.noteTitle}`}>
                  <i className="bi bi-trash" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmModal show={!!toDelete} title="Remove reminder?" message="You will no longer get an email for this reminder." confirmText="Remove"
        onConfirm={remove} onClose={() => setToDelete(null)} />
    </>
  );
}
