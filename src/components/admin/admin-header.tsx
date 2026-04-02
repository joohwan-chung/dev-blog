'use client';

import { useAdminAuth } from './admin-auth-provider';
import { useSidebar } from './sidebar-context';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminHeader() {
  const { isAuthenticated, logout } = useAdminAuth();
  const { isCollapsed, isMobile, toggleMobileMenu } = useSidebar();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className={cn(
      "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-100 ease-out h-16",
      isMobile ? "ml-0" : (isCollapsed ? "ml-16" : "ml-64")
    )} style={{ borderBottomWidth: '1px' }}>
      <div className="px-4 sm:px-6 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            {/* 모바일 햄버거 메뉴 버튼 */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                aria-label="메뉴 열기"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              관리자 대시보드
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">로그아웃</span>
              <span className="sm:hidden">로그아웃</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
