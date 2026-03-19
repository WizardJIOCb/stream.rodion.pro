import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';

export function useAdmin() {
  const queryClient = useQueryClient();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: authData, isLoading: checkingAuth } = useQuery({
    queryKey: ['adminAuth'],
    queryFn: async () => {
      try {
        const result = await apiFetch<{ authenticated: boolean }>(`${API.ADMIN_LOGIN.replace('/login', '/check')}`);
        return result;
      } catch {
        return { authenticated: false };
      }
    },
    retry: false,
    staleTime: 60_000,
  });

  const isAuthenticated = authData?.authenticated || false;

  const login = useCallback(async (password: string) => {
    setIsLoggingIn(true);
    try {
      await apiFetch(API.ADMIN_LOGIN, { method: 'POST', json: { password } });
      queryClient.invalidateQueries({ queryKey: ['adminAuth'] });
      return true;
    } catch (err) {
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await apiFetch(API.ADMIN_LOGIN.replace('/login', '/logout'), { method: 'POST' });
    } catch {
      // ignore
    }
    queryClient.setQueryData(['adminAuth'], { authenticated: false });
  }, [queryClient]);

  return { isAuthenticated, checkingAuth, isLoggingIn, login, logout };
}
