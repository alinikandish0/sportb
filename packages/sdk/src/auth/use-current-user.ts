import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/api-client';
import type { AuthUser } from './auth-store';

async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<AuthUser>('/auth/me');
  return response.data;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    retry: false, // اگه 401 بود لازم نیست دوباره تلاش کنه
  });
}
