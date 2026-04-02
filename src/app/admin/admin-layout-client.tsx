'use client';

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { SidebarProvider, useSidebar } from '@/components/admin/sidebar-context';
import { useAdminAuth } from '@/components/admin/admin-auth-provider';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobile } = useSidebar();
  
  return (
    <div className="flex">
      <AdminSidebar />
      <main className={cn(
        "flex-1 transition-all duration-100 ease-out",
        isMobile ? "p-4 ml-0" : "p-6",
        !isMobile && (isCollapsed ? "ml-16" : "ml-64")
      )}>
        {children}
      </main>
    </div>
  );
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const pathname = usePathname();
  
  // 로그인 페이지는 헤더와 사이드바 없이 표시
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  // 인증된 사용자에게는 헤더와 사이드바 표시
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminHeader />
        <AdminLayoutContent>
          {children}
        </AdminLayoutContent>
      </div>
    </SidebarProvider>
  );
}
