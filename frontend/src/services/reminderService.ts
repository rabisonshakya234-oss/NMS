import { request } from './api';
import type { Reminder } from '@/types';

export const listReminders = () => request<{ reminders: Reminder[] }>('/reminders');
export const createReminder = (noteId: string, remindAt: string) => request('/reminders', { method: 'POST', body: { noteId, remindAt } });
export const deleteReminder = (id: string) => request(`/reminders/${id}`, { method: 'DELETE' });
