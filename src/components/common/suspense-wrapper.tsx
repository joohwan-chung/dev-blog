'use client';

import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from './loading-spinner';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuspenseWrapper({ 
  children, 
  fallback = <LoadingSpinner size="md" className="p-4" />
}: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}
