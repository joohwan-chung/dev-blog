'use client';

import { useAdminAuth } from '@/components/admin/admin-auth-provider';
import { UserDetailModal } from '@/components/admin/user-detail-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Mail,
  Calendar,
  Activity,
  Plus,
  MessageSquare,
  Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'banned';
  lastActive: string;
  createdAt: string;
  loginCount: number;
  preferences: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  // 활동 통계는 별도 API로 조회
  totalPosts?: number;
  totalComments?: number;
  totalReactions?: number;
}

export default function AdminUsersPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    banned: 0,
    admins: 0,
    users: 0,
    guests: 0
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        // users 배열이 유효한지 확인하고 필터링
        const validUsers = (data.users || []).filter((user: unknown) => 
          user && 
          typeof user === 'object' && 
          user !== null &&
          'id' in user && 
          'name' in user && 
          'email' in user
        ).map((user: unknown) => {
          const userObj = user as Record<string, unknown>;
          return {
            ...userObj,
            // preferences가 유효한 객체인지 확인
            preferences: userObj.preferences && typeof userObj.preferences === 'object' 
              ? userObj.preferences 
              : {
                theme: 'light',
                language: 'ko',
                notifications: {
                  email: true,
                  push: false
                }
              },
            // 누락된 필드에 기본값 설정
            totalPosts: userObj.totalPosts || 0,
            totalComments: userObj.totalComments || 0,
            totalReactions: userObj.totalReactions || 0,
            lastActive: userObj.lastActive || userObj.createdAt || '',
            loginCount: userObj.loginCount || 0,
          };
        });
        setUsers(validUsers);
        setFilteredUsers(validUsers);
        setStats(data.stats || {
          total: 0,
          active: 0,
          inactive: 0,
          banned: 0,
          admins: 0,
          users: 0,
          guests: 0
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = users;

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // 역할 필터
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleUserUpdate = (userId: string, updates: Partial<User & { _deleted?: boolean }>): void => {
    setUsers(prevUsers => {
      // 사용자 삭제인 경우
      if (updates._deleted) {
        const updatedUsers = prevUsers.filter(user => user.id !== userId);
        
        // 통계 재계산
        const newStats = {
          total: updatedUsers.length,
          active: updatedUsers.filter(user => user.status === 'active').length,
          inactive: updatedUsers.filter(user => user.status === 'inactive').length,
          banned: updatedUsers.filter(user => user.status === 'banned').length,
          admins: updatedUsers.filter(user => user.role === 'admin').length,
          users: updatedUsers.filter(user => user.role === 'user').length,
          guests: updatedUsers.filter(user => user.role === 'guest').length
        };
        setStats(newStats);
        
        return updatedUsers;
      }
      
      // 새 사용자 추가인 경우
      if (userId === 'new' && updates.id) {
        const newUser: User = {
          id: updates.id,
          name: updates.name || '',
          email: updates.email || '',
          avatar: updates.avatar || '',
          role: updates.role || 'user',
          status: updates.status || 'active',
          lastActive: updates.lastActive || new Date().toISOString(),
          createdAt: updates.createdAt || new Date().toISOString(),
          loginCount: updates.loginCount || 0,
          preferences: updates.preferences || {
            theme: 'light',
            language: 'ko',
            notifications: {
              email: true,
              push: false
            }
          },
          totalPosts: updates.totalPosts || 0,
          totalComments: updates.totalComments || 0,
          totalReactions: updates.totalReactions || 0
        };
        
        const updatedUsers = [...prevUsers, newUser];
        
        // 통계 재계산
        const newStats = {
          total: updatedUsers.length,
          active: updatedUsers.filter(user => user.status === 'active').length,
          inactive: updatedUsers.filter(user => user.status === 'inactive').length,
          banned: updatedUsers.filter(user => user.status === 'banned').length,
          admins: updatedUsers.filter(user => user.role === 'admin').length,
          users: updatedUsers.filter(user => user.role === 'user').length,
          guests: updatedUsers.filter(user => user.role === 'guest').length
        };
        setStats(newStats);
        
        return updatedUsers;
      }
      
      // 기존 사용자 수정인 경우
      const validUpdates: Partial<User> = {};
      
      if (updates.id !== undefined) validUpdates.id = updates.id;
      if (updates.name !== undefined) validUpdates.name = updates.name;
      if (updates.email !== undefined) validUpdates.email = updates.email;
      if (updates.avatar !== undefined) validUpdates.avatar = updates.avatar;
      if (updates.role !== undefined) validUpdates.role = updates.role;
      if (updates.status !== undefined) validUpdates.status = updates.status;
      if (updates.lastActive !== undefined) validUpdates.lastActive = updates.lastActive;
      if (updates.createdAt !== undefined) validUpdates.createdAt = updates.createdAt;
      if (updates.loginCount !== undefined) validUpdates.loginCount = updates.loginCount;
      if (updates.preferences !== undefined) validUpdates.preferences = updates.preferences;
      if (updates.totalPosts !== undefined) validUpdates.totalPosts = updates.totalPosts;
      if (updates.totalComments !== undefined) validUpdates.totalComments = updates.totalComments;
      if (updates.totalReactions !== undefined) validUpdates.totalReactions = updates.totalReactions;

      const updatedUsers = prevUsers.map(user => {
        if (user.id === userId) {
          // 기존 user 객체와 validUpdates를 안전하게 병합
          return { 
            ...user, 
            ...validUpdates,
            // preferences 객체가 있다면 안전하게 병합
            preferences: validUpdates.preferences ? {
              ...user.preferences,
              ...validUpdates.preferences,
              notifications: validUpdates.preferences.notifications ? {
                ...user.preferences?.notifications,
                ...validUpdates.preferences.notifications
              } : user.preferences?.notifications
            } : user.preferences
          };
        }
        return user;
      });
      
      // 통계 재계산
      const newStats = {
        total: updatedUsers.length,
        active: updatedUsers.filter(user => user.status === 'active').length,
        inactive: updatedUsers.filter(user => user.status === 'inactive').length,
        banned: updatedUsers.filter(user => user.status === 'banned').length,
        admins: updatedUsers.filter(user => user.role === 'admin').length,
        users: updatedUsers.filter(user => user.role === 'user').length,
        guests: updatedUsers.filter(user => user.role === 'guest').length
      };
      setStats(newStats);
      
      return updatedUsers;
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: '활성' },
      inactive: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', text: '비활성' },
      banned: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', text: '차단' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', text: '관리자' },
      user: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', text: '사용자' },
      guest: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', text: '게스트' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul'
    });
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          사용자 관리
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
          블로그 사용자들을 관리하고 모니터링하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">총 사용자</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              등록된 전체 사용자
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">활성 사용자</CardTitle>
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              현재 활성 상태
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">관리자</CardTitle>
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {stats.admins}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              관리자 권한 보유
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">차단된 사용자</CardTitle>
            <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {stats.banned}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              접근이 제한된 사용자
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>사용자 목록</CardTitle>
            <Button onClick={() => handleUserClick('new')} className="w-full sm:w-auto">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              새 사용자 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                <Input
                  placeholder="사용자 이름 또는 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="banned">차단</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">모든 역할</option>
                <option value="admin">관리자</option>
                <option value="user">사용자</option>
                <option value="guest">게스트</option>
              </select>
            </div>
          </div>

          {/* 사용자 목록 */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                  사용자 데이터를 불러오는 중...
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                검색 조건에 맞는 사용자가 없습니다.
              </div>
            ) : (
              <>
                {/* 데스크톱 테이블 */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">사용자</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">역할</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">상태</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">활동</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">가입일</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        if (!user || typeof user !== 'object' || !user.id) {
                          return null;
                        }

                        return (
                          <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                  {user.avatar ? (
                                    <Image
                                      src={user.avatar}
                                      alt={user.name}
                                      width={40}
                                      height={40}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <Users className="h-5 w-5 text-gray-500" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {getRoleBadge(user.role)}
                            </td>
                            <td className="py-4 px-4">
                              {getStatusBadge(user.status)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center mb-1">
                                  <Activity className="h-3 w-3 mr-1" />
                                  {user.totalPosts || 0} 포스트
                                </div>
                                <div className="flex items-center mb-1">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {user.totalComments || 0} 댓글
                                </div>
                                <div className="flex items-center">
                                  <Heart className="h-3 w-3 mr-1" />
                                  {user.totalReactions || 0} 반응
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center mb-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(user.createdAt)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  로그인 {user.loginCount}회
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUserClick(user.id)}
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent 
                                    className="bg-gray-900 text-white border-gray-700 rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
                                    sideOffset={8}
                                  >
                                    <p>사용자 상세 정보 보기 및 관리</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 모바일 카드 */}
                <div className="md:hidden space-y-3">
                  {filteredUsers.map((user) => {
                    if (!user || typeof user !== 'object' || !user.id) {
                      return null;
                    }

                    return (
                      <Card key={user.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                {user.avatar ? (
                                  <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <Users className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">{user.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center truncate">
                                  <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                  {getRoleBadge(user.role)}
                                  {getStatusBadge(user.status)}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserClick(user.id)}
                              className="h-8 w-8 p-0 flex-shrink-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.totalPosts || 0}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">포스트</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.totalComments || 0}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">댓글</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.totalReactions || 0}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">반응</div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                              가입: {formatDate(user.createdAt)} • 로그인 {user.loginCount}회
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 사용자 상세 모달 */}
      <UserDetailModal
        userId={selectedUserId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUserUpdate={handleUserUpdate}
      />
    </div>
  );
}