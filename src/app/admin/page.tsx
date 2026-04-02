'use client';

import { useAdminAuth } from '@/components/admin/admin-auth-provider';
import { AdminRealTimeEvents } from '@/components/admin/admin-realtime-events';
import { AdminRecentActivity } from '@/components/admin/admin-recent-activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, MessageSquare, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [eventStats, setEventStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        setStatsLoading(true);
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const stats = await response.json();
        setEventStats(stats);
      } catch (error) {
        console.error('Error fetching event stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchEventStats();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            접근 권한이 없습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            관리자 페이지에 접근하려면 로그인이 필요합니다.
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          대시보드
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
          블로그 현황과 통계를 한눈에 확인하세요
        </p>
      </div>

      {/* 실시간 통계 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">오늘 이벤트</CardTitle>
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {statsLoading ? '-' : eventStats.today.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {statsLoading ? '데이터 로딩 중...' : '오늘 발생한 모든 이벤트'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">이번 주 이벤트</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {statsLoading ? '-' : eventStats.thisWeek.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {statsLoading ? '데이터 로딩 중...' : '이번 주 발생한 이벤트'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">이번 달 이벤트</CardTitle>
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {statsLoading ? '-' : eventStats.thisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {statsLoading ? '데이터 로딩 중...' : '이번 달 발생한 이벤트'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">총 이벤트</CardTitle>
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {statsLoading ? '-' : eventStats.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {statsLoading ? '데이터 로딩 중...' : '전체 누적 이벤트 수'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 실시간 이벤트 모니터링 */}
      <AdminRealTimeEvents />

      {/* 최근 활동 */}
      <AdminRecentActivity />
    </div>
  );
}
