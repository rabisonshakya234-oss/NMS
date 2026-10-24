const dateFormat = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
});
const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

type DateInput = string | number | Date | null | undefined;

export const formatDate = (value: DateInput) => (value ? dateFormat.format(new Date(value)) : '');
export const formatDateTime = (value: DateInput) => (value ? dateTimeFormat.format(new Date(value)) : '');
export const formatTime = (value: DateInput) => (value ? timeFormat.format(new Date(value)) : '');

// "Updated 5 minutes ago" style text.
export function timeAgo(value: string | number | Date) {
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const units: [string, number][] = [['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [name, size] of units) {
    if (seconds >= size) {
      const count = Math.floor(seconds / size);
      return count > 7 && name === 'day' ? formatDate(value) : `${count} ${name}${count > 1 ? 's' : ''} ago`;
    }
  }
  return formatDate(value);
}

// Short plain-text preview of a note (removes common Markdown symbols).
export function excerpt(text = '', length = 140) {
  const plain = text.replace(/[#*`>_~[\]]/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length).trim()}…` : plain;
}

export const initials = (name = '') => name.slice(0, 2).toUpperCase() || '?';

// Value for <input type="datetime-local"> in the user's own time zone.
export function toLocalInputValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
