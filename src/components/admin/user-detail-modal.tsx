'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePCNotifications } from '@/lib/hooks/usePCNotifications';
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  Settings, 
  Shield, 
  Ban, 
  CheckCircle,
  Clock,
  Globe,
  Edit,
  Trash2,
  X,
  Key,
  Eye,
  EyeOff,
  Bell,
  Monitor
} from 'lucide-react';

interface UserDetail {
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
  activityLog?: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    ip?: string;
    details?: string;
  }>;
  _deleted?: boolean;
}

interface UserDetailModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: (userId: string, updates: Partial<UserDetail>) => void;
}

export function UserDetailModal({ userId, isOpen, onClose, onUserUpdate }: UserDetailModalProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user' | 'guest',
    status: 'active' as 'active' | 'inactive' | 'banned'
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isNotificationFormOpen, setIsNotificationFormOpen] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    body: '',
    type: 'general' as 'general' | 'comment' | 'user',
    url: ''
  });
  const [notificationMessage, setNotificationMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // PC 알림 훅
  const { 
    isSupported: isPCNotificationSupported, 
    permission: pcNotificationPermission,
    sendPCNotification
  } = usePCNotifications();

  // 알림 전송 상태 리셋 함수
  const resetNotificationState = useCallback(() => {
    setIsNotificationFormOpen(false);
    setIsSendingNotification(false);
    setNotificationMessage(null);
    setNotificationForm({
      title: '',
      body: '',
      type: 'general',
      url: ''
    });
  }, []);

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const userData = await response.json();
      setUser(userData);
      setEditForm({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: '',
        role: userData.role,
        status: userData.status
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && isOpen && userId !== 'new') {
      fetchUserDetails();
    } else if (userId === 'new' && isOpen) {
      // 새 사용자 생성 모드
      setUser(null);
      setEditForm({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
      });
      setIsEditing(true);
    }
    
    // 모달이 열릴 때 알림 전송 상태 리셋
    if (isOpen) {
      resetNotificationState();
    }
  }, [userId, isOpen, fetchUserDetails, resetNotificationState]);

  const handleSave = async () => {
    if (!userId) return;

    try {
      let response;
      if (userId === 'new') {
        // 새 사용자 생성
        response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editForm),
        });
      } else {
        // 기존 사용자 수정
        response = await fetch(`/api/admin/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editForm),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      
      // 새 사용자 생성인 경우와 기존 사용자 수정인 경우를 구분
      if (userId === 'new') {
        // 새 사용자 생성인 경우 - 전체 사용자 데이터 전달
        const newUserData: Partial<UserDetail> = {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar || '',
          role: updatedUser.role,
          status: updatedUser.status,
          lastActive: updatedUser.lastActive || new Date().toISOString(),
          createdAt: updatedUser.createdAt || new Date().toISOString(),
          loginCount: updatedUser.loginCount || 0,
          preferences: updatedUser.preferences || {
            theme: 'light',
            language: 'ko',
            notifications: {
              email: true,
              push: false
            }
          },
          totalPosts: updatedUser.totalPosts || 0,
          totalComments: updatedUser.totalComments || 0,
          totalReactions: updatedUser.totalReactions || 0
        };
        onUserUpdate('new', newUserData);
      } else {
        // 기존 사용자 수정인 경우 - 변경된 필드만 전달
        const safeUpdates: Partial<UserDetail> = {};
        if (updatedUser.id) safeUpdates.id = updatedUser.id;
        if (updatedUser.name) safeUpdates.name = updatedUser.name;
        if (updatedUser.email) safeUpdates.email = updatedUser.email;
        if (updatedUser.avatar !== undefined) safeUpdates.avatar = updatedUser.avatar;
        if (updatedUser.role) safeUpdates.role = updatedUser.role;
        if (updatedUser.status) safeUpdates.status = updatedUser.status;
        if (updatedUser.lastActive) safeUpdates.lastActive = updatedUser.lastActive;
        if (updatedUser.createdAt) safeUpdates.createdAt = updatedUser.createdAt;
        if (updatedUser.loginCount !== undefined) safeUpdates.loginCount = updatedUser.loginCount;
        if (updatedUser.preferences) safeUpdates.preferences = updatedUser.preferences;
        if (updatedUser.totalPosts !== undefined) safeUpdates.totalPosts = updatedUser.totalPosts;
        if (updatedUser.totalComments !== undefined) safeUpdates.totalComments = updatedUser.totalComments;
        if (updatedUser.totalReactions !== undefined) safeUpdates.totalReactions = updatedUser.totalReactions;
        
        onUserUpdate(userId, safeUpdates);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'banned') => {
    if (!user) return;

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      // 안전한 업데이트 객체 생성
      const safeUpdates: Partial<UserDetail> = {};
      if (updatedUser.id) safeUpdates.id = updatedUser.id;
      if (updatedUser.name) safeUpdates.name = updatedUser.name;
      if (updatedUser.email) safeUpdates.email = updatedUser.email;
      if (updatedUser.avatar !== undefined) safeUpdates.avatar = updatedUser.avatar;
      if (updatedUser.role) safeUpdates.role = updatedUser.role;
      if (updatedUser.status) safeUpdates.status = updatedUser.status;
      if (updatedUser.lastActive) safeUpdates.lastActive = updatedUser.lastActive;
      if (updatedUser.createdAt) safeUpdates.createdAt = updatedUser.createdAt;
      if (updatedUser.loginCount !== undefined) safeUpdates.loginCount = updatedUser.loginCount;
      if (updatedUser.preferences) safeUpdates.preferences = updatedUser.preferences;
      
      onUserUpdate(user.id, safeUpdates);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDelete = async () => {
    if (!user || !user.id) return;

    if (!confirm(`정말로 ${user.name} 사용자를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      onClose();
      // 부모 컴포넌트에서 사용자 삭제 알림
      onUserUpdate(user.id, { id: user.id, _deleted: true });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !user.id) return;

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: passwordForm.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      alert('비밀번호가 성공적으로 변경되었습니다.');
      setIsChangingPassword(false);
      setPasswordForm({
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error instanceof Error ? error.message : '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  const handleSendNotification = async () => {
    if (!user || !user.id) {
      console.error('사용자 정보가 없습니다:', { user: !!user, userId: user?.id });
      setNotificationMessage({
        type: 'error',
        message: '사용자 정보를 찾을 수 없습니다.'
      });
      return;
    }

    if (!notificationForm.title || !notificationForm.body) {
      setNotificationMessage({
        type: 'error',
        message: '제목과 내용을 모두 입력해주세요.'
      });
      return;
    }

    try {
      setIsSendingNotification(true);
      
      const requestBody = {
        title: notificationForm.title,
        body: notificationForm.body,
        type: notificationForm.type,
        targetUserId: user.id,
        data: {
          url: notificationForm.url || '/',
          userId: user.id
        }
      };

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `알림 전송에 실패했습니다. (${response.status})`);
      }

      const result = await response.json();
      
      if (result.success) {
        setNotificationMessage({
          type: 'success',
          message: '알림이 성공적으로 전송되었습니다. (토스트 알림 + PC 푸시 알림)'
        });
        // 5초 후 메시지 자동 제거
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
        resetNotificationState();
      } else {
        throw new Error(result.error || '알림 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('알림 전송 오류:', error);
      setNotificationMessage({
        type: 'error',
        message: error instanceof Error ? error.message : '알림 전송 중 오류가 발생했습니다.'
      });
      // 5초 후 에러 메시지 자동 제거
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } finally {
      setIsSendingNotification(false);
    }
  };

  // PC 푸시 알림 전송 함수
  const handleSendPCNotification = async () => {
    if (!user || !user.id) {
      console.error('사용자 정보가 없습니다:', { user: !!user, userId: user?.id });
      setNotificationMessage({
        type: 'error',
        message: '사용자 정보를 찾을 수 없습니다.'
      });
      return;
    }

    if (!notificationForm.title || !notificationForm.body) {
      setNotificationMessage({
        type: 'error',
        message: '제목과 내용을 모두 입력해주세요.'
      });
      return;
    }

    if (!isPCNotificationSupported) {
      setNotificationMessage({
        type: 'error',
        message: 'PC 알림을 지원하지 않는 브라우저입니다.'
      });
      return;
    }

    if (pcNotificationPermission !== 'granted') {
      setNotificationMessage({
        type: 'error',
        message: 'PC 알림 권한이 허용되지 않았습니다.'
      });
      return;
    }

    try {
      setIsSendingNotification(true);
      
      // PC 직접 알림 전송 (서버를 거치지 않음)
      const success = await sendPCNotification({
        title: notificationForm.title,
        body: notificationForm.body,
        icon: '/favicon.ico',
        url: notificationForm.url || '/',
        tag: `admin-${user.id}-${Date.now()}`,
        requireInteraction: true
      });

      if (success) {
        setNotificationMessage({
          type: 'success',
          message: 'PC 푸시 알림이 성공적으로 전송되었습니다.'
        });
        // 5초 후 메시지 자동 제거
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
        resetNotificationState();
      } else {
        setNotificationMessage({
          type: 'error',
          message: 'PC 푸시 알림 전송에 실패했습니다.'
        });
      }
    } catch (error) {
      setNotificationMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'PC 알림 전송 중 오류가 발생했습니다.'
      });
      // 5초 후 에러 메시지 자동 제거
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } finally {
      setIsSendingNotification(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: '활성', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', text: '비활성', icon: Clock },
      banned: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', text: '차단', icon: Ban }
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] sm:!max-w-[60vw] !w-[95vw] sm:!w-[60vw] max-h-[95vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <span className="text-lg sm:text-xl">{userId === 'new' ? '새 사용자 추가' : '사용자 상세 정보'}</span>
            <div className="flex items-center space-x-1 sm:space-x-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">편집</span>
                  </Button>
                  {userId !== 'new' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-700 text-xs sm:text-sm h-8 sm:h-9"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">삭제</span>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">취소</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    {userId === 'new' ? '생성' : '저장'}
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (user || userId === 'new') ? (
          <div className="space-y-4 sm:space-y-8">
            {/* 사용자 기본 정보 */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    {user?.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name}
                        width={96}
                        height={96}
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    {isEditing || userId === 'new' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">사용자 ID</label>
                          <input
                            type="text"
                            value={editForm.id}
                            onChange={(e) => setEditForm({...editForm, id: e.target.value})}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="사용자 ID를 입력하세요"
                            disabled={userId !== 'new'} // 기존 사용자는 ID 수정 불가
                          />
                          {userId === 'new' && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              영문, 숫자, 언더스코어(_)만 사용 가능합니다.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">이름</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="사용자 이름을 입력하세요"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">이메일</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="이메일 주소를 입력하세요"
                          />
                        </div>
                        {userId === 'new' && (
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">비밀번호</label>
                            <input
                              type="password"
                              value={editForm.password}
                              onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                              placeholder="비밀번호를 입력하세요"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">역할</label>
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'user' | 'guest'})}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          >
                            <option value="admin">관리자</option>
                            <option value="user">사용자</option>
                            <option value="guest">게스트</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">상태</label>
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm({...editForm, status: e.target.value as 'active' | 'inactive' | 'banned'})}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          >
                            <option value="active">활성</option>
                            <option value="inactive">비활성</option>
                            <option value="banned">차단</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
                          <div className="flex items-center space-x-2">
                            {user && getRoleBadge(user.role)}
                            {user && getStatusBadge(user.status)}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="flex items-center text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 mr-3 text-blue-500" />
                            <div>
                              <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">사용자 ID</div>
                              <div className="font-mono text-xs sm:text-sm">{user?.id}</div>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-3 text-green-500" />
                            <div>
                              <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">이메일</div>
                              <div className="text-xs sm:text-sm">{user?.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-3 text-purple-500" />
                            <div>
                              <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">가입일</div>
                              <div className="text-xs sm:text-sm">{user && formatDate(user.createdAt)}</div>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-3 text-orange-500" />
                            <div>
                              <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">마지막 활동</div>
                              <div className="text-xs sm:text-sm">{user && formatDate(user.lastActive)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 활동 통계 - 기존 사용자만 표시 */}
            {user && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    활동 통계
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{user.totalPosts || 0}</div>
                      <div className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">포스트</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{user.totalComments || 0}</div>
                      <div className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">댓글</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <div className="text-xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{user.totalReactions || 0}</div>
                      <div className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">반응</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <div className="text-xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{user.loginCount}</div>
                      <div className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">로그인</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 빠른 상태 변경 - 기존 사용자만 표시 */}
            {!isEditing && user && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    빠른 관리
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {user.status !== 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange('active')}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800 text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">활성화</span>
                        <span className="sm:hidden">활성</span>
                      </Button>
                    )}
                    {user.status !== 'inactive' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange('inactive')}
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">비활성화</span>
                        <span className="sm:hidden">비활성</span>
                      </Button>
                    )}
                    {user.status !== 'banned' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange('banned')}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">차단</span>
                        <span className="sm:hidden">차단</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsChangingPassword(true)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-xs sm:text-sm h-8 sm:h-9"
                    >
                      <Key className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">비밀번호 변경</span>
                      <span className="sm:hidden">비밀번호</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsNotificationFormOpen(true)}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-xs sm:text-sm h-8 sm:h-9"
                    >
                      <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">알림 전송</span>
                      <span className="sm:hidden">알림</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 알림 전송 - 기존 사용자만 표시 */}
            {!isEditing && user && isNotificationFormOpen && (
              <Card className="shadow-sm border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-purple-600" />
                      알림 전송
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resetNotificationState();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 알림 전송 결과 메시지 */}
                    {notificationMessage && (
                      <div className={`p-4 rounded-lg border ${
                        notificationMessage.type === 'success' 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {notificationMessage.type === 'success' ? (
                              <CheckCircle className="h-5 w-5 mr-2" />
                            ) : (
                              <X className="h-5 w-5 mr-2" />
                            )}
                            <span className="font-medium">{notificationMessage.message}</span>
                          </div>
                          <button
                            onClick={() => setNotificationMessage(null)}
                            className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center text-purple-700 dark:text-purple-300 mb-2">
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-medium">{user.name}</span>
                        <span className="text-purple-600 dark:text-purple-400 ml-2">({user.email})</span>
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                        💡 웹 푸시 알림(토스트)과 PC 푸시 알림(시스템 알림)을 전송할 수 있습니다.
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center">
                          <Bell className="h-3 w-3 mr-1" />
                          <span>웹 푸시: {isPCNotificationSupported ? '지원됨' : '지원 안됨'}</span>
                        </div>
                        <div className="flex items-center">
                          <Monitor className="h-3 w-3 mr-1" />
                          <span>PC 알림: {pcNotificationPermission === 'granted' ? '허용됨' : '권한 필요'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          알림 제목
                        </label>
                        <input
                          type="text"
                          value={notificationForm.title}
                          onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="알림 제목을 입력하세요"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          알림 유형
                        </label>
                        <select
                          value={notificationForm.type}
                          onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value as 'general' | 'comment' | 'user'})}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        >
                          <option value="general">일반 알림</option>
                          <option value="comment">댓글 알림</option>
                          <option value="user">사용자 알림</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        알림 내용
                      </label>
                      <textarea
                        value={notificationForm.body}
                        onChange={(e) => setNotificationForm({...notificationForm, body: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="알림 내용을 입력하세요"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        링크 URL (선택사항)
                      </label>
                      <input
                        type="url"
                        value={notificationForm.url}
                        onChange={(e) => setNotificationForm({...notificationForm, url: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="클릭 시 이동할 URL (예: /blog/post-id)"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          resetNotificationState();
                        }}
                      >
                        취소
                      </Button>
                      <Button
                        onClick={handleSendNotification}
                        disabled={!notificationForm.title || !notificationForm.body || isSendingNotification}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        {isSendingNotification ? '전송 중...' : '웹 푸시 알림'}
                      </Button>
                      <Button
                        onClick={handleSendPCNotification}
                        disabled={!notificationForm.title || !notificationForm.body || isSendingNotification || !isPCNotificationSupported || pcNotificationPermission !== 'granted'}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        title={pcNotificationPermission !== 'granted' ? 'PC 알림 권한이 필요합니다' : 'PC 시스템 알림을 전송합니다'}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        {isSendingNotification ? '전송 중...' : 'PC 푸시 알림'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 비밀번호 변경 - 기존 사용자만 표시 */}
            {!isEditing && user && isChangingPassword && (
              <Card className="shadow-sm border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center">
                      <Key className="h-5 w-5 mr-2 text-blue-600" />
                      비밀번호 변경
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordForm({ newPassword: '', confirmPassword: '' });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center text-blue-700 dark:text-blue-300">
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-medium">{user.name}</span>
                        <span className="text-blue-600 dark:text-blue-400 ml-2">({user.email})</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          새 비밀번호
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="새 비밀번호를 입력하세요"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          최소 6자 이상 입력해주세요.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          비밀번호 확인
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="비밀번호를 다시 입력하세요"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                          <p className="text-xs text-red-500 mt-1">
                            비밀번호가 일치하지 않습니다.
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordForm({ newPassword: '', confirmPassword: '' });
                        }}
                      >
                        취소
                      </Button>
                      <Button
                        onClick={handlePasswordChange}
                        disabled={!passwordForm.newPassword || !passwordForm.confirmPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        비밀번호 변경
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 활동 로그 - 기존 사용자만 표시 */}
            {user && user.activityLog && user.activityLog.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2" />
                    최근 활동
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {user.activityLog.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="h-3 w-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white mb-2">
                            {typeof activity.description === 'string' 
                              ? activity.description 
                              : JSON.stringify(activity.description)
                            }
                          </div>
                          {activity.details && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                              {typeof activity.details === 'string' 
                                ? activity.details 
                                : JSON.stringify(activity.details, null, 2)
                              }
                            </div>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center space-x-2">
                            <span>{formatDate(activity.timestamp)}</span>
                            {activity.ip && (
                              <>
                                <span>•</span>
                                <span className="font-mono">IP: {activity.ip}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 사용자 설정 - 기존 사용자만 표시 */}
            {user && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Settings className="h-5 w-5 mr-2" />
                    사용자 설정
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center mb-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">테마</div>
                      </div>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        {user.preferences.theme === 'dark' ? '다크' : '라이트'}
                      </Badge>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center mb-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">언어</div>
                      </div>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        {user.preferences.language === 'ko' ? '한국어' : 'English'}
                      </Badge>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center mb-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full mr-2"></div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">이메일 알림</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-sm px-3 py-1 ${
                          user.preferences.notifications.email 
                            ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                            : 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                        }`}
                      >
                        {user.preferences.notifications.email ? '활성' : '비활성'}
                      </Badge>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center mb-3">
                        <div className="h-2 w-2 bg-orange-500 rounded-full mr-2"></div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">푸시 알림</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-sm px-3 py-1 ${
                          user.preferences.notifications.push 
                            ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                            : 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                        }`}
                      >
                        {user.preferences.notifications.push ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            사용자 정보를 불러올 수 없습니다.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
