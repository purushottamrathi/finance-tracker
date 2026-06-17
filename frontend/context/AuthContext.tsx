'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';

interface User { _id: string; name: string; email: string; }
interface AuthState { user: User | null; loading: boolean; }
interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem('finance_token');
    const user = localStorage.getItem('finance_user');
    if (token && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ user: JSON.parse(user), loading: false });
    } else {
      setState({ user: null, loading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('finance_token', data.token);
    localStorage.setItem('finance_user', JSON.stringify(data.user));
    setState({ user: data.user, loading: false });
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('finance_token', data.token);
    localStorage.setItem('finance_user', JSON.stringify(data.user));
    setState({ user: data.user, loading: false });
  };

  const logout = () => {
    localStorage.removeItem('finance_token');
    localStorage.removeItem('finance_user');
    setState({ user: null, loading: false });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
