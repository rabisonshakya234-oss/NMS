'use client';
import { useState, type FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import FormField from '@/components/ui/FormField';
import { useToast } from '@/context/ToastContext';
import * as reminderService from '@/services/reminderService';
import { toLocalInputValue } from '@/lib/format';

// Pick a date and time; the backend emails the user when it arrives.
export default function ReminderModal({ show, noteId, onClose }: { show: boolean; noteId: string; onClose: () => void }) {
  const toast = useToast();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value) return setError('Choose a date and time');
    setSaving(true);
    setError('');
    try {
      await reminderService.createReminder(noteId, new Date(value).toISOString());
      toast.success('Reminder set. We will email you.');
      setValue('');
      onClose();
    } catch (e) {
      setError(e.errors?.[0]?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} title="Remind me about this note" onClose={onClose}>
      <form onSubmit={submit}>
        <Alert>{error}</Alert>
        <FormField label="Date and time" type="datetime-local" value={value} min={toLocalInputValue(new Date())}
          onChange={(e) => setValue(e.target.value)} hint="Up to one year ahead. A reminder email is sent at that time." />
        <div className="d-flex justify-content-end gap-2">
          <Button type="button" variant="light" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving} icon="bell">Set reminder</Button>
        </div>
      </form>
    </Modal>
  );
}
