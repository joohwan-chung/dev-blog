'use client';

import { useAdminAuth } from './admin-auth-provider';
import { useSidebar } from './sidebar-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Heart, 
  Users, 
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  Globe,
  X,
  Monitor
} from 'lucide-react';

const navigation = [
  { name: '대시보드', href: '/admin', icon: Home },
  { name: '통계 분석', href: '/admin/statistics', icon: BarChart3 },
  { name: '포스트', href: '/admin/posts', icon: FileText },
  { name: '댓글', href: '/admin/comments', icon: MessageSquare },
  { name: '반응', href: '/admin/reactions', icon: Heart },
  { name: '팝업', href: '/admin/popups', icon: Monitor },
  { name: '사용자', href: '/admin/users', icon: Users },
  { name: '설정', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { isAuthenticated } = useAdminAuth();
  const { isCollapsed, isMobile, isMobileMenuOpen, toggleSidebar, closeMobileMenu } = useSidebar();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* 모바일 오버레이 */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        />
      )}
      
      {/* 사이드바 */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg overflow-hidden transition-all duration-300 ease-in-out",
        isMobile ? (
          isMobileMenuOpen ? "w-64 translate-x-0" : "-translate-x-full"
        ) : (
          isCollapsed ? "w-16" : "w-64"
        )
      )}>
        <div className="flex flex-col h-full">
          <div className={cn(
            "flex items-center h-16 border-b border-gray-200 dark:border-gray-700 transition-all duration-100 ease-out",
            isCollapsed && !isMobile ? "justify-center px-1" : "justify-between px-4"
          )} style={{ borderBottomWidth: '1px' }}>
            {isCollapsed && !isMobile ? (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex-shrink-0"
                aria-label="사이드바 펼치기"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            ) : (
              <>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h2 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    joohwan.dev
                  </h2>
                </div>
                <button
                  onClick={isMobile ? closeMobileMenu : toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex-shrink-0"
                  aria-label={isMobile ? "메뉴 닫기" : "사이드바 접기"}
                >
                  {isMobile ? (
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </>
            )}
          </div>
          
          <nav className={cn(
            "flex-1 py-6 space-y-2 transition-all duration-100 ease-out",
            isCollapsed && !isMobile ? "px-1" : "px-4"
          )}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={isMobile ? closeMobileMenu : undefined}
                  className={cn(
                    'flex items-center py-2 text-sm font-medium rounded-lg group relative',
                    isCollapsed && !isMobile ? 'px-1 justify-center' : 'px-3',
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  )}
                  title={isCollapsed && !isMobile ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {(!isCollapsed || isMobile) && (
                    <span className="ml-3 truncate whitespace-nowrap">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
