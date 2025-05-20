// src/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

// Create a global query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnMount: true,       // Refetch when component mounts
      retry: 1,                   // Retry failed requests once
      staleTime: 30 * 1000,       // Consider data fresh for 30 seconds
      gcTime: 5 * 60 * 1000,      // Keep cached data for 5 minutes
    },
  },
});