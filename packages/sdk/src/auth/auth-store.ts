'use client';

import { createStore } from 'zustand';
import { createContext, useContext } from 'react';
import { useStore } from 'zustand';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthProps {
  user: AuthUser | null;
  isLoading: boolean;
}

interface AuthState extends AuthProps {
  setUser: (user: AuthUser | null) => void;
  setLoading: (status: boolean) => void;
  logout: () => void;
}

export const createAuthStore = (initProps?: Partial<AuthProps>) => {
  const DEFAULT_PROPS: AuthProps = { user: null, isLoading: false };

  return createStore<AuthState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setUser: (user) => set({ user, isLoading: false }),
    setLoading: (status) => set({ isLoading: status }),
    logout: () => set({ user: null, isLoading: false }),
  }));
};

export type AuthStore = ReturnType<typeof createAuthStore>;
export const AuthContext = createContext<AuthStore | null>(null);

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error('useAuthStore باید داخل AuthProvider استفاده بشه');
  }
  return useStore(store, selector);
}