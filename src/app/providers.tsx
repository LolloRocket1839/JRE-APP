'use client';

import { ReactNode } from 'react';
import { LocaleProvider } from '@/hooks/useLocale';
import { AuthProvider } from '@/hooks/useAuth';
import { ServiceWorker } from '@/components/layout/ServiceWorker';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LocaleProvider>
      <AuthProvider>
        <ServiceWorker />
        {children}
      </AuthProvider>
    </LocaleProvider>
  );
}
