import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthData {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: () => apiRequest('/api/auth/me'),
    retry: false,
    staleTime: Infinity,
  });

  console.log('useAuth data:', data, 'loading:', isLoading, 'error:', error);

  return {
    user: (data as any)?.user || null,
    isLoading,
    isAuthenticated: !!(data as any)?.user,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: (data) => {
      console.log('Login successful, invalidating auth queries:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      // Force refetch the auth state
      queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (userData: {
      username: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      return apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiRequest('/api/auth/logout', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}