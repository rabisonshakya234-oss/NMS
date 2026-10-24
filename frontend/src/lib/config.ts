// One place for site-wide settings. Change the name/description here and it updates everywhere.
export const SITE_NAME = 'NoteNest';
export const SITE_TAGLINE = 'Smart note management';
export const SITE_DESCRIPTION =
  'Capture, organize and find your notes in seconds. Tags, pinning, auto-save, email reminders, exports and an AI assistant that answers questions from your own notes.';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const NOTES_PER_PAGE = 9;
export const MAX_TITLE = 150;
export const MAX_CONTENT = 50000;
export const MAX_TAGS = 20;
export const MAX_TAG_LENGTH = 30;
export const AUTOSAVE_DELAY_MS = 2000;

// The backend (Express) base URL. CORS on the backend allows only SITE_URL.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://nms-10.onrender.com/api').replace(/\/+$/, '');
