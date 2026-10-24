// Same rules as the backend validators, so people get instant feedback.
// The backend still checks everything again.
export const validateEmail = (v = '') => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address');

export const validateUsername = (v = '') =>
  /^[a-zA-Z0-9_.-]{3,30}$/.test(v.trim()) ? '' : 'Use 3-30 characters: letters, numbers, _ . -';

export function validatePassword(v = '') {
  if (v.length < 8) return 'Password must be at least 8 characters';
  if (new TextEncoder().encode(v).length > 72) return 'Password is too long (max 72 bytes)';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Password needs a letter and a number';
  return '';
}

export const validateMatch = (a: string, b: string) => (a === b ? '' : 'Passwords do not match');

// Removes empty messages so `{}` means "no errors".
export const compact = (errors: Record<string, string>) => Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
