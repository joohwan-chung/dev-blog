'use client';

import { useAdminAuth } from '@/components/admin/admin-auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart, 
  MousePointer,
  Calendar,
  Clock,
  RefreshCw,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

interface EventStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}

interface EventTypeStats {
  comment: number;
  reaction: number;
  click: number;
  user_visit: number;
}

interface HourlyStats {
  hour: number;
  count: number;
}

interface DailyStats {
  date: string;
  count: number;
}

export default function AdminStatisticsPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [eventStats, setEventStats] = useState<EventStats>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
  });
  const [eventTypeStats, setEventTypeStats] = useState<EventTypeStats>({
    comment: 0,
    reaction: 0,
    click: 0,
    user_visit: 0,
  });
  const [hourlyStats, setHourlyStats] = useState<HourlyStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // 날짜 필터링 상태
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [selectedQuickRange, setSelectedQuickRange] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchStatistics = useCallback(async (customStartDate?: string, customEndDate?: string) => {
    try {
      setLoading(true);
      
      // 날짜 필터 파라미터 구성
      const params = new URLSearchParams();
      const useStartDate = customStartDate || startDate;
      const useEndDate = customEndDate || endDate;
      
      if (useStartDate && useEndDate) {
        params.append('startDate', useStartDate);
        params.append('endDate', useEndDate);
      }
      
      const queryString = params.toString();
      const apiSuffix = queryString ? `?${queryString}` : '';
      
      // 기본 통계 가져오기
      const statsResponse = await fetch(`/api/admin/stats${apiSuffix}`);
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setEventStats(stats);
      }

      // 이벤트 타입별 통계 가져오기
      const typeStatsResponse = await fetch(`/api/admin/statistics/event-types${apiSuffix}`);
      if (typeStatsResponse.ok) {
        const typeStats = await typeStatsResponse.json();
        setEventTypeStats(typeStats);
      }

      // 시간대별 통계 가져오기
      const hourlyResponse = await fetch(`/api/admin/statistics/hourly${apiSuffix}`);
      if (hourlyResponse.ok) {
        const hourly = await hourlyResponse.json();
        setHourlyStats(hourly);
      }

      // 일별 통계 가져오기
      const dailyResponse = await fetch(`/api/admin/statistics/daily${apiSuffix}`);
      if (dailyResponse.ok) {
        const daily = await dailyResponse.json();
        setDailyStats(daily);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatistics();
    }
  }, [isAuthenticated, fetchStatistics]);

  // 날짜 필터 적용 함수
  const applyDateFilter = () => {
    if (startDate && endDate) {
      setIsDateFiltered(true);
      fetchStatistics(startDate, endDate);
    } else {
      alert('시작 날짜와 종료 날짜를 모두 선택해주세요.');
    }
  };

  // 날짜 필터 초기화 함수
  const resetDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setIsDateFiltered(false);
    setSelectedQuickRange(null);
    fetchStatistics();
  };

  // 빠른 날짜 선택 함수들
  const setQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setIsDateFiltered(true);
    setSelectedQuickRange(days);
    fetchStatistics(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

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

  const getEventTypeIcon = (type: keyof EventTypeStats) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'reaction':
        return <Heart className="h-4 w-4 text-red-600" />;
      case 'click':
        return <MousePointer className="h-4 w-4 text-purple-600" />;
      case 'user_visit':
        return <Users className="h-4 w-4 text-orange-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventTypeLabel = (type: keyof EventTypeStats) => {
    switch (type) {
      case 'comment':
        return '댓글';
      case 'reaction':
        return '반응';
      case 'click':
        return '클릭';
      case 'user_visit':
        return '사용자 방문';
      default:
        return type;
    }
  };

  const getEventTypeColor = (type: keyof EventTypeStats) => {
    switch (type) {
      case 'comment':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'reaction':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'click':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'user_visit':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 헤더 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            통계 분석
          </h1>
          <Button
            onClick={() => fetchStatistics()}
            disabled={loading}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">새로고침</span>
            <span className="sm:hidden">↻</span>
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            상세한 이벤트 통계와 분석 데이터를 확인하세요
          </p>
          {lastUpdated && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              업데이트: {lastUpdated.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' })}
            </div>
          )}
        </div>
      </div>

      {/* 날짜 필터 섹션 */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4">
        <div className="space-y-3">
          {/* 빠른 선택 버튼들 */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">기간:</span>
            <div className="flex gap-1 overflow-x-auto pb-1">
              <Button
                variant={selectedQuickRange === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickDateRange(1)}
                disabled={loading}
                className="h-7 px-2 text-xs whitespace-nowrap flex-shrink-0"
              >
                오늘
              </Button>
              <Button
                variant={selectedQuickRange === 7 ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickDateRange(7)}
                disabled={loading}
                className="h-7 px-2 text-xs whitespace-nowrap flex-shrink-0"
              >
                7일
              </Button>
              <Button
                variant={selectedQuickRange === 30 ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickDateRange(30)}
                disabled={loading}
                className="h-7 px-2 text-xs whitespace-nowrap flex-shrink-0"
              >
                30일
              </Button>
              <Button
                variant={selectedQuickRange === 90 ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickDateRange(90)}
                disabled={loading}
                className="h-7 px-2 text-xs whitespace-nowrap flex-shrink-0"
              >
                3개월
              </Button>
            </div>
          </div>

          {/* 사용자 정의 날짜 선택 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="start-date" className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">시작:</Label>
              <div className="relative flex-1">
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setSelectedQuickRange(null);
                  }}
                  disabled={loading}
                  className="h-7 w-full text-xs pr-6 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-1 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="end-date" className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">종료:</Label>
              <div className="relative flex-1">
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setSelectedQuickRange(null);
                  }}
                  disabled={loading}
                  className="h-7 w-full text-xs pr-6 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-1 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex gap-1 sm:col-span-2 lg:col-span-1">
              <Button
                onClick={applyDateFilter}
                disabled={loading || !startDate || !endDate}
                size="sm"
                className="h-7 px-3 text-xs flex-1"
              >
                적용
              </Button>
              <Button
                onClick={resetDateFilter}
                disabled={loading}
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs flex-1"
              >
                초기화
              </Button>
            </div>
          </div>

          {/* 현재 적용된 필터 표시 */}
          {isDateFiltered && (
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
              <Calendar className="h-3 w-3 text-blue-600 flex-shrink-0" />
              <span className="text-xs text-blue-800 dark:text-blue-200 truncate">
                {startDate} ~ {endDate}
              </span>
              <Button
                onClick={resetDateFilter}
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-blue-600 hover:text-blue-800 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 전체 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6">
        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium truncate">
              {isDateFiltered ? '선택 기간' : '오늘'}
            </CardTitle>
            <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-base sm:text-lg lg:text-2xl font-bold">
              {loading ? '-' : eventStats.today.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block mt-1">
              {isDateFiltered ? '선택된 기간의 이벤트' : '오늘 발생한 모든 이벤트'}
            </p>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium truncate">
              {isDateFiltered ? '이벤트 수' : '이번 주'}
            </CardTitle>
            <TrendingUp className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-base sm:text-lg lg:text-2xl font-bold">
              {loading ? '-' : eventStats.thisWeek.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block mt-1">
              {isDateFiltered ? '선택된 기간의 이벤트 수' : '이번 주 발생한 이벤트'}
            </p>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium truncate">
              {isDateFiltered ? '통계' : '이번 달'}
            </CardTitle>
            <BarChart3 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-base sm:text-lg lg:text-2xl font-bold">
              {loading ? '-' : eventStats.thisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block mt-1">
              {isDateFiltered ? '선택된 기간 통계' : '이번 달 발생한 이벤트'}
            </p>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium truncate">총 이벤트</CardTitle>
            <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-base sm:text-lg lg:text-2xl font-bold">
              {loading ? '-' : eventStats.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block mt-1">
              {isDateFiltered ? '선택된 기간 총 이벤트 수' : '전체 누적 이벤트 수'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 이벤트 타입별 통계 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base lg:text-lg">이벤트 타입별 통계</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            각 이벤트 타입별 발생 횟수를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {Object.entries(eventTypeStats).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {getEventTypeIcon(type as keyof EventTypeStats)}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">{getEventTypeLabel(type as keyof EventTypeStats)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {loading ? '-' : count.toLocaleString()}회
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs flex-shrink-0 ${getEventTypeColor(type as keyof EventTypeStats)}`}>
                  {loading ? '-' : count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 시간대별 통계 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base lg:text-lg">
            {isDateFiltered ? '선택 기간 시간대별 분포' : '시간대별 이벤트 분포'}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {isDateFiltered 
              ? '선택된 기간 중 언제 가장 많은 이벤트가 발생했는지 확인하세요'
              : '하루 중 언제 가장 많은 이벤트가 발생하는지 확인하세요'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {hourlyStats.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                {loading ? '데이터를 불러오는 중...' : '시간대별 데이터가 없습니다.'}
              </div>
            ) : (
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-1">
                {hourlyStats.map((stat) => {
                  const maxCount = Math.max(...hourlyStats.map(s => s.count));
                  const height = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={stat.hour} className="flex flex-col items-center space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {stat.hour}시
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t h-12 sm:h-16 lg:h-20">
                        <div
                          className="bg-blue-500 rounded-t transition-all duration-300"
                          style={{ height: `${height}%`, minHeight: height > 0 ? '2px' : '0' }}
                        />
                      </div>
                      <div className="text-xs font-medium text-center">
                        {stat.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 일별 통계 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base lg:text-lg">
            {isDateFiltered ? '선택 기간 이벤트 추이' : '최근 7일 이벤트 추이'}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {isDateFiltered 
              ? '선택된 기간의 이벤트 발생 추이를 확인하세요'
              : '최근 일주일간의 이벤트 발생 추이를 확인하세요'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {dailyStats.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                {loading ? '데이터를 불러오는 중...' : '일별 데이터가 없습니다.'}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {dailyStats.map((stat) => {
                  const maxCount = Math.max(...dailyStats.map(s => s.count));
                  const width = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
                  const date = new Date(stat.date);
                  const formattedDate = date.toLocaleDateString('ko-KR', { 
                    month: 'short', 
                    day: 'numeric',
                    timeZone: 'Asia/Seoul',
                    weekday: 'short'
                  });
                  
                  return (
                    <div key={stat.date} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium truncate">{formattedDate}</span>
                        <span className="text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                          {stat.count}개
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
