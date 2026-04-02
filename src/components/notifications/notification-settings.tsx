'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Settings, CheckCircle, XCircle } from 'lucide-react';
import { useNotificationContext } from './notification-provider';
import { toast } from 'sonner';

export function NotificationSettings() {
  const { 
    isSupported, 
    permission, 
    fcmToken, 
    isLoading, 
    requestPermission
  } = useNotificationContext();
  
  const [isInitializing, setIsInitializing] = useState(false);

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      toast.error('이 브라우저는 알림을 지원하지 않습니다.');
      return;
    }

    setIsInitializing(true);
    try {
      const success = await requestPermission();
      if (success) {
        // 사용자 ID가 필요하지만 여기서는 임시로 처리
        // 실제로는 사용자 컨텍스트에서 가져와야 함
        toast.success('알림이 활성화되었습니다.');
      }
    } catch (error) {
      console.error('알림 활성화 실패:', error);
      toast.error('알림 활성화에 실패했습니다.');
    } finally {
      setIsInitializing(false);
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return {
          text: '허용됨',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: CheckCircle
        };
      case 'denied':
        return {
          text: '거부됨',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: XCircle
        };
      default:
        return {
          text: '요청 필요',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: BellOff
        };
    }
  };

  const permissionStatus = getPermissionStatus();
  const Icon = permissionStatus.icon;

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <BellOff className="h-5 w-5 mr-2 text-gray-500" />
            웹 알림
          </CardTitle>
          <CardDescription>
            이 브라우저는 웹 알림을 지원하지 않습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                지원되지 않는 브라우저
              </span>
            </div>
            <Badge variant="outline" className="text-gray-500">
              사용 불가
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          웹 알림
        </CardTitle>
        <CardDescription>
          새로운 댓글이나 중요한 업데이트에 대한 알림을 받을 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 권한 상태 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center">
            <Icon className="h-5 w-5 mr-2 text-gray-600" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                알림 권한
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                브라우저 알림 권한 상태
              </div>
            </div>
          </div>
          <Badge className={permissionStatus.color}>
            {permissionStatus.text}
          </Badge>
        </div>

        {/* FCM 토큰 상태 */}
        {permission === 'granted' && (
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  알림 서비스
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  {fcmToken ? '연결됨' : '연결 중...'}
                </div>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={fcmToken ? 'text-green-600 border-green-200' : 'text-yellow-600 border-yellow-200'}
            >
              {fcmToken ? '활성' : '대기 중'}
            </Badge>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-2">
          {permission !== 'granted' && (
            <Button
              onClick={handleEnableNotifications}
              disabled={isLoading || isInitializing}
              className="w-full sm:w-auto"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isLoading || isInitializing ? '설정 중...' : '알림 활성화'}
            </Button>
          )}
          
          {permission === 'denied' && (
            <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              알림이 거부되었습니다. 브라우저 설정에서 알림 권한을 허용해주세요.
            </div>
          )}
        </div>

        {/* 도움말 */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• 알림을 받으려면 브라우저에서 알림 권한을 허용해야 합니다.</p>
          <p>• 알림 설정은 브라우저별로 저장됩니다.</p>
          <p>• 알림을 끄려면 브라우저 설정에서 해당 사이트의 알림을 비활성화하세요.</p>
        </div>
      </CardContent>
    </Card>
  );
}
