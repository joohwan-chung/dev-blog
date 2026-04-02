'use client';

import { useEffect } from 'react';
import { collectEvent } from '@/lib/analytics';

interface AboutWrapperProps {
  children: React.ReactNode;
}

export function AboutWrapper({ children }: AboutWrapperProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    collectEvent({
      type: 'user_visit',
      description: 'About 페이지 방문',
      page: '/about',
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });
  }, []);

  return <>{children}</>;
}
