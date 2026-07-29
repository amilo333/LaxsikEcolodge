'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster as ToasterProvider } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ToasterProvider
        className='toaster-provider'
        position='top-right'
        offset={{ top: '24px', right: '24px' }}
        mobileOffset={{ top: '10px', right: '10px' }}
        toastOptions={{ duration: 5000 }}
      />
    </QueryClientProvider>
  );
}
