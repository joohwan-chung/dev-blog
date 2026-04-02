'use client';

import { useEffect } from 'react';
import { NotionPage } from '@/types/notion';
import { collectEvent } from '@/lib/analytics';

interface BlogPostWrapperProps {
  post: NotionPage;
  children: React.ReactNode;
}

export function BlogPostWrapper({ post, children }: BlogPostWrapperProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    collectEvent({
      type: 'user_visit',
      description: `블로그 포스트 방문: ${post.title}`,
      page: window.location.pathname,
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });
  }, [post]);

  return <>{children}</>;
}
