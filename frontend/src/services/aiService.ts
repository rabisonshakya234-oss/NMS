import { request } from './api';
import type { AskAnswer } from '@/types';

export const askNotes = (question: string) => request<AskAnswer>('/ai/ask', { method: 'POST', body: { question } });
