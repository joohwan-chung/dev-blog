'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PopupDisplay } from '@/components/common/popup-display';
import { ChatbotButton } from '@/components/chat/ChatbotButton';
import { useAuth } from '@/lib/auth-context';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  
  // 관리자 페이지나 인증 페이지인 경우 헤더와 푸터 없이 표시
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  // 페이지별 팝업 위치 결정
  const getPopupLocation = (pathname: string) => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/blog')) return 'blog';
    if (pathname.startsWith('/about')) return 'about';
    if (pathname.startsWith('/profile')) return 'profile';
    if (pathname.startsWith('/playground')) return 'playground';
    return 'home';
  };

  // 사용자 타입 결정
  const getUserType = (): 'guest' | 'logged-in' | 'admin' => {
    if (!isAuthenticated || !user) {
      return 'guest';
    }
    
    if (user.role === 'admin') {
      return 'admin';
    }
    
    return 'logged-in';
  };

  // 일반 페이지인 경우 헤더와 푸터 포함
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="no-print">
        <Header />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <div className="no-print">
        <Footer />
      </div>

      {/* 팝업 표시 (메인페이지는 HomeContent에서 직접 제어) */}
      {pathname !== '/' && (
        <div className="no-print">
          <PopupDisplay
            location={getPopupLocation(pathname)}
            userType={getUserType()}
            showPopup={true}
          />
        </div>
      )}

      <div className="no-print">
        <ChatbotButton />
      </div>
    </div>
  );
}
