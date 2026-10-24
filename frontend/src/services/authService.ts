import { request } from './api';
import type { AuthData, ChangePasswordValues, LoginValues, RegisterValues, ResetPasswordValues } from '@/types';

export const register = (values: RegisterValues) => request<AuthData>('/auth/register', { method: 'POST', body: values, auth: false });
export const login = (values: LoginValues) => request<AuthData>('/auth/login', { method: 'POST', body: values, auth: false });
export const logout = () => request('/auth/logout', { method: 'POST' });
export const forgotPassword = (email: string) => request('/auth/forgot-password', { method: 'POST', body: { email }, auth: false });
export const resetPassword = (token: string, values: ResetPasswordValues) =>
  request(`/auth/reset-password/${encodeURIComponent(token)}`, { method: 'POST', body: values, auth: false });
export const changePassword = (values: ChangePasswordValues) => request('/auth/change-password', { method: 'PATCH', body: values });
