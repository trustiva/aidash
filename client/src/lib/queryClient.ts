import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    },
  },
});

// Custom fetch function for API requests
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    credentials: 'include', // Include cookies for session management
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Set up default query function
queryClient.setQueryDefaults(['api'], {
  queryFn: async ({ queryKey }) => {
    const url = Array.isArray(queryKey) ? queryKey.join('') : queryKey;
    return apiRequest(url as string);
  },
});

// Also set defaults for direct API paths
queryClient.setQueryDefaults(['/api'], {
  queryFn: async ({ queryKey }) => {
    const url = Array.isArray(queryKey) ? queryKey.join('') : queryKey;
    return apiRequest(url as string);
  },
});