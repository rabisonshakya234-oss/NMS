import { API_URL } from '@/lib/config';
import type { FieldError } from '@/types';

const TOKEN_KEY = 'nms_token';

export const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY));
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Every failed call throws this. `errors` is the backend's [{ field, message }] list.
export class ApiError extends Error {
  status: number;
  errors: FieldError[];

  constructor(message: string, status = 0, errors: FieldError[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type Query = Record<string, any>;

interface SendOptions {
  method?: string;
  body?: unknown;
  query?: Query;
  auth?: boolean;
}

// { page: 1, search: '' } -> "?page=1" (empty values are skipped)
function toQueryString(query: Query = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  const text = params.toString();
  return text ? `?${text}` : '';
}

async function send(path: string, { method = 'GET', body, query, auth = true }: SendOptions = {}) {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  try {
    return await fetch(`${API_URL}${path}${toQueryString(query)}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Please check your connection and try again.');
  }
}

// Throws ApiError when the backend answers with an error.
async function failIfNotOk(response: Response, auth: boolean) {
  if (response.ok) return;
  const json = await response.json().catch(() => null);
  // A 401 on a protected call means the login has expired: let the app log the user out.
  if (response.status === 401 && auth && typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:expired'));
  }
  throw new ApiError(json?.message || 'Something went wrong. Please try again.', response.status, json?.errors);
}

// Normal JSON call. Returns the `data` part of { success, message, data }.
export async function request<T = any>(path: string, options: SendOptions = {}): Promise<T> {
  const response = await send(path, options);
  await failIfNotOk(response, options.auth !== false);
  const json = await response.json().catch(() => ({}));
  return json.data ?? {};
}

// File download (Markdown / PDF). Needs the Authorization header, so a plain link cannot be used.
// The backend does not expose Content-Disposition to browsers (CORS), so we pick the file name here.
export async function download(path: string, { query, filename }: { query?: Query; filename: string }) {
  const response = await send(path, { query });
  await failIfNotOk(response, true);
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Maps the backend's [{ field, message }] to { field: message } for forms.
export function fieldErrors(error: { errors?: FieldError[] } | null | undefined) {
  const result: Record<string, string> = {};
  (error?.errors || []).forEach(({ field, message }) => { if (field && !result[field]) result[field] = message; });
  return result;
}
