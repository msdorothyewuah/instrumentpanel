import React from 'react';
import { QueryClientProvider, ReactQueryDevtools } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

// QueryProvider component to wrap the app with React Query
const QueryProvider = ({ children }: QueryProviderProps): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default QueryProvider;