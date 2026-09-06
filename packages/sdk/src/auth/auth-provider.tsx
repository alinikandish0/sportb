'use client';

import { useRef } from 'react';
import { AuthContext, createAuthStore, type AuthStore, type AuthUser } from './auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const storeRef = useRef<AuthStore>(null);

  if (!storeRef.current) {
    storeRef.current = createAuthStore({ user: initialUser, isLoading: false });
  }

  return (
    <AuthContext.Provider value={storeRef.current}>
      {children}
    </AuthContext.Provider>
  );
}
