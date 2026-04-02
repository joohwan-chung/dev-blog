'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Eye, MessageSquare, Heart, MousePointer, User } from 'lucide-react';

interface RealtimeEvent {
  id: string;
  type: 'page_view' | 'comment' | 'reaction' | 'click' | 'user_visit';
  description: string;
  timestamp: string;
  userIp: string;
  page?: string;
  userAgent?: string;
  referrer?: string;
}

export function AdminRealTimeEvents() {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/recent');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsConnected(false);
      }
    };

    // 초기 로드
    fetchEvents();

    // 5초마다 새로고침
    const interval = setInterval(fetchEvents, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getEventIcon = (type: RealtimeEvent['type']) => {
    switch (type) {
      case 'page_view':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'reaction':
        return <Heart className="h-4 w-4 text-red-600" />;
      case 'click':
        return <MousePointer className="h-4 w-4 text-purple-600" />;
      case 'user_visit':
        return <User className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventBadge = (type: RealtimeEvent['type']) => {
    switch (type) {
      case 'page_view':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">페이지뷰</Badge>;
      case 'comment':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">댓글</Badge>;
      case 'reaction':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">반응</Badge>;
      case 'click':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">클릭</Badge>;
      case 'user_visit':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">방문</Badge>;
      default:
        return <Badge variant="secondary">기타</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 1) return '방금 전';
    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              실시간 이벤트 모니터링
            </CardTitle>
            <CardDescription>
              사이트에서 발생하는 실시간 이벤트를 모니터링합니다
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isConnected ? '연결됨' : '연결 끊김'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>실시간 이벤트를 기다리는 중...</p>
              <p className="text-sm mt-2">사이트에서 활동이 발생하면 여기에 표시됩니다.</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getEventBadge(event.type)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                  </div>
                  {event.page && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      페이지: {event.page}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    IP: {event.userIp}
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
