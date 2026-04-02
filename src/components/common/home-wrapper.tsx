'use client';

import { useState, useEffect } from 'react';
import { HomeContent } from '../blog/home-content';
import { LoadingIntro } from './loading-intro';
import { NotionPage } from '@/types/notion';
import { collectEvent } from '@/lib/analytics';

interface HomeWrapperProps {
  posts: NotionPage[];
  skills: { [key: string]: string[] };
}

export function HomeWrapper({ posts, skills }: HomeWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      collectEvent({
        type: 'user_visit',
        description: '홈페이지 방문',
        page: '/',
        userAgent: window.navigator.userAgent,
        referrer: document.referrer,
      });
    }

    // 컴포넌트 마운트 후 잠시 로딩 상태 유지
    const timer = setTimeout(() => {
      setIsLoading(false);
      // 로딩 완료 후 팝업 표시 허용
      setTimeout(() => {
        setShowPopup(true);
      }, 500); // 로딩 완료 후 0.5초 후 팝업 허용
    }, 2000); // 2초간 로딩 화면 표시

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingIntro />;
  }

  return <HomeContent posts={posts} skills={skills} showPopup={showPopup} />;
}
