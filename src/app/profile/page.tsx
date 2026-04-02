'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  Settings, 
  Heart, 
  MessageSquare, 
  BookOpen,
  Shield,
  Globe,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

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

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            프로필을 보려면 로그인해주세요.
          </p>
          <Button onClick={() => router.push('/')}>
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', text: '관리자', icon: Shield },
      user: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', text: '사용자', icon: User },
      guest: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', text: '게스트', icon: Globe }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: '활성', icon: Activity },
      inactive: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', text: '비활성', icon: Clock },
      banned: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', text: '차단', icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          {/* 프로필 헤더 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-2xl font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </h1>
                      <div className="flex items-center space-x-2 mt-2">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href="/profile/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        설정
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>가입일: {formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>마지막 활동: {formatDate(user.lastActive)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>로그인 횟수: {user.loginCount}회</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 빠른 액션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Link href="/profile/activity" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">내 활동</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">포스트, 댓글, 반응</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Link href="/profile/reactions" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">내 반응</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">좋아요, 북마크</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Link href="/profile/comments" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">내 댓글</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">작성한 댓글들</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 사용자 설정 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                사용자 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">테마 설정</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">테마</span>
                      <Badge variant="outline">
                        {user.preferences.theme === 'dark' ? '다크' : '라이트'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">언어</span>
                      <Badge variant="outline">
                        {user.preferences.language === 'ko' ? '한국어' : 'English'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">알림 설정</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">이메일 알림</span>
                      <Badge variant="outline" className={user.preferences.notifications.email ? 'text-green-600' : 'text-gray-600'}>
                        {user.preferences.notifications.email ? '활성' : '비활성'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">푸시 알림</span>
                      <Badge variant="outline" className={user.preferences.notifications.push ? 'text-green-600' : 'text-gray-600'}>
                        {user.preferences.notifications.push ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
