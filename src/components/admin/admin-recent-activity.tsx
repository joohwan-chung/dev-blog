'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Eye, User, MousePointer } from 'lucide-react';
import { Event, EventType } from '@/types/notion';

export function AdminRecentActivity() {
  const [activities, setActivities] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/events/recent');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setActivities(data.events || []);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const getActivityIcon = (type: EventType) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'reaction':
        return <Heart className="h-4 w-4 text-red-600" />;
      case 'page_view':
        return <Eye className="h-4 w-4 text-green-600" />;
      case 'user_visit':
        return <User className="h-4 w-4 text-purple-600" />;
      case 'click':
        return <MousePointer className="h-4 w-4 text-orange-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: EventType) => {
    switch (type) {
      case 'comment':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">댓글</Badge>;
      case 'reaction':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">반응</Badge>;
      case 'page_view':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">페이지 조회</Badge>;
      case 'user_visit':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">사용자 방문</Badge>;
      case 'click':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">클릭</Badge>;
      default:
        return <Badge variant="secondary">기타</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return date.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
          <CardDescription>
            활동 내역을 불러오는 중...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
        <CardDescription>
          블로그에서 발생한 최근 활동들을 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              최근 활동이 없습니다.
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getActivityBadge(activity.type)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    페이지: {activity.page}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    IP: {activity.userIp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
