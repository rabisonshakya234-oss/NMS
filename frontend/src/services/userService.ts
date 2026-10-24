import { request } from './api';
import type { Pagination, User } from '@/types';

export const getProfile = () => request<{ user: User }>('/users/me');
export const updateProfile = (username: string) => request<{ user: User }>('/users/me', { method: 'PATCH', body: { username } });
export const listUsers = (query: { page?: number; limit?: number }) => request<{ users: User[]; pagination: Pagination }>('/users', { query }); // admin only
