// Shapes of the data the Express backend returns. Types only: no runtime code.

export type Role = 'user' | 'admin';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: Role;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

export interface Reminder {
  _id: string;
  noteId: string;
  noteTitle: string;
  remindAt: string;
  isDue: boolean;
}

// The backend's validation error list: [{ field, message }]
export interface FieldError {
  field: string;
  message: string;
}

export interface AskSource {
  id: string;
  title: string;
}

export interface AskAnswer {
  answer: string;
  sources: AskSource[];
}

export interface AuthData {
  token: string;
  user: User;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NoteBody {
  title: string;
  content: string;
  tags: string[];
}

export type NoteQuery = {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  sortBy?: string;
  order?: string;
  isArchived?: boolean;
  isPinned?: boolean;
};

export type BulkAction = 'delete' | 'archive' | 'unarchive' | 'pin' | 'unpin';
export type ExportFormat = 'markdown' | 'pdf';

export interface NoteFilterState {
  view: string;
  search: string;
  tag: string;
  sortBy: string;
  order: string;
  page: number;
}
