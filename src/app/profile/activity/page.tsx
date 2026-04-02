'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Heart, 
  Eye, 
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Activity {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'comment' | 'reaction' | 'view_post' | 'update_profile' | 'register' | 'password_change';
  description: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export default function ActivityPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/activity?limit=50');
        
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activityLogs || []);
        } else {
          console.error('Failed to fetch activities');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchActivities();
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
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            활동 내역을 보려면 로그인해주세요.
          </p>
          <Button onClick={() => router.push('/')}>
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  const getActivityIcon = (action: string) => {
    const iconConfig = {
      login: { icon: User, color: 'text-green-600 dark:text-green-400' },
      logout: { icon: User, color: 'text-gray-600 dark:text-gray-400' },
      comment: { icon: MessageSquare, color: 'text-blue-600 dark:text-blue-400' },
      reaction: { icon: Heart, color: 'text-red-600 dark:text-red-400' },
      view_post: { icon: Eye, color: 'text-purple-600 dark:text-purple-400' },
      update_profile: { icon: User, color: 'text-orange-600 dark:text-orange-400' },
      register: { icon: User, color: 'text-green-600 dark:text-green-400' },
      password_change: { icon: User, color: 'text-yellow-600 dark:text-yellow-400' }
    };
    
    const config = iconConfig[action as keyof typeof iconConfig] || iconConfig.view_post;
    const Icon = config.icon;
    
    return <Icon className={`h-5 w-5 ${config.color}`} />;
  };

  const getActivityBadge = (action: string) => {
    const badgeConfig = {
      login: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: '로그인' },
      logout: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', text: '로그아웃' },
      comment: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', text: '댓글' },
      reaction: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', text: '반응' },
      view_post: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', text: '조회' },
      update_profile: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', text: '프로필' },
      register: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: '가입' },
      password_change: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', text: '비밀번호' }
    };
    
    const config = badgeConfig[action as keyof typeof badgeConfig] || badgeConfig.view_post;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInHours < 168) { // 7일
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Seoul'
      });
    }
  };

  const filteredActivities = (action: string) => {
    if (action === 'all') return activities;
    return activities.filter(activity => activity.action === action);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">활동 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">내 활동</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              포스트, 댓글, 반응 등 내 활동 내역을 확인하세요
            </p>
          </div>

          {/* 활동 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {activities.filter(a => a.action === 'login').length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">로그인</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {activities.filter(a => a.action === 'comment').length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">댓글</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {activities.filter(a => a.action === 'reaction').length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">반응</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {activities.filter(a => a.action === 'view_post').length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">조회</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 활동 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>활동 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="login">로그인</TabsTrigger>
                  <TabsTrigger value="comment">댓글</TabsTrigger>
                  <TabsTrigger value="reaction">반응</TabsTrigger>
                  <TabsTrigger value="view_post">조회</TabsTrigger>
                  <TabsTrigger value="update_profile">프로필</TabsTrigger>
                </TabsList>

                {['all', 'login', 'comment', 'reaction', 'view_post', 'update_profile'].map((action) => (
                  <TabsContent key={action} value={action} className="space-y-4">
                    {filteredActivities(action).length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        활동 내역이 없습니다.
                      </div>
                    ) : (
                      filteredActivities(action).map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex-shrink-0">
                            {getActivityIcon(activity.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-slate-900 dark:text-white truncate">
                                  {activity.description}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {activity.details && Object.keys(activity.details).length > 0 && (
                                    <span className="text-xs text-slate-500 dark:text-slate-500">
                                      세부사항: {JSON.stringify(activity.details)}
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                  IP: {activity.ipAddress} | User Agent: {activity.userAgent.substring(0, 50)}...
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                {getActivityBadge(activity.action)}
                                <span className="text-xs text-slate-500 dark:text-slate-500">
                                  {formatDate(activity.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
