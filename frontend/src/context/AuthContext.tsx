'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '@/services/authService';
import * as userService from '@/services/userService';
import { clearToken, getToken, setToken } from '@/services/api';
import type { AuthData, LoginValues, RegisterValues, User } from '@/types';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (values: LoginValues) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Usage: const { user, loading, login, register, logout, setUser } = useAuth();
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // true until we know if someone is logged in

  // On first load: if a token is saved, ask the backend who the user is.
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    userService.getProfile()
      .then((data) => setUser(data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const startSession = (data: AuthData) => { setToken(data.token); setUser(data.user); };

  const login = useCallback(async (values: LoginValues) => startSession(await authService.login(values)), []);
  const register = useCallback(async (values: RegisterValues) => startSession(await authService.register(values)), []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* token may already be invalid: still log out here */ }
    clearToken();
    setUser(null);
    router.replace('/login');
  }, [router]);

  // The api layer fires this when the backend says the token is expired or revoked.
  useEffect(() => {
    const onExpired = () => { clearToken(); setUser(null); router.replace('/login'); };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, [router]);

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext) as AuthContextValue;
