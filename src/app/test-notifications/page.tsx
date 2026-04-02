'use client';

import { useState } from 'react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { usePCNotifications } from '@/lib/hooks/usePCNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, X, AlertCircle, Monitor } from 'lucide-react';

export default function TestNotificationsPage() {
  const {
    isSupported,
    permission,
    fcmToken,
    isLoading,
    requestPermission,
    registerToken
  } = useNotifications();

  const {
    isSupported: isPCNotificationSupported,
    permission: pcNotificationPermission,
    isLoading: isPCNotificationLoading,
    status: pcNotificationStatus,
    requestPermission: requestPCPermission,
    sendPCNotification,
    sendPCNotificationToUser
  } = usePCNotifications();

  const [testResults, setTestResults] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>>([]);

  const addTestResult = (type: 'success' | 'error' | 'info', message: string) => {
    const result = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' })
    };
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // 최대 10개 유지
  };

  const testPermission = async () => {
    addTestResult('info', '알림 권한 요청 중...');
    const granted = await requestPermission();
    if (granted) {
      addTestResult('success', '알림 권한이 허용되었습니다.');
    } else {
      addTestResult('error', '알림 권한이 거부되었습니다.');
    }
  };

  const testTokenRegistration = async () => {
    if (!fcmToken) {
      addTestResult('error', 'FCM 토큰이 없습니다. 먼저 권한을 요청해주세요.');
      return;
    }

    addTestResult('info', 'FCM 토큰 등록 중...');
    const success = await registerToken('test-user');
    if (success) {
      addTestResult('success', 'FCM 토큰이 성공적으로 등록되었습니다.');
    } else {
      addTestResult('error', 'FCM 토큰 등록에 실패했습니다.');
    }
  };

  const testNotificationSend = async () => {
    if (!fcmToken) {
      addTestResult('error', 'FCM 토큰이 없습니다. 먼저 토큰을 등록해주세요.');
      return;
    }

    addTestResult('info', '웹 푸시 알림 전송 중...');
    
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '웹 푸시 테스트',
          body: '웹 푸시 알림 테스트입니다. 이 메시지가 보이면 성공입니다!',
          type: 'general',
          targetUserId: 'test-user',
          data: {
            url: '/test-notifications',
            type: 'test'
          }
        }),
      });

      if (response.ok) {
        addTestResult('success', '웹 푸시 알림이 전송되었습니다. 토스트 알림을 확인해주세요.');
      } else {
        const errorData = await response.json();
        addTestResult('error', `웹 푸시 알림 전송 실패: ${errorData.error}`);
      }
    } catch (error) {
      addTestResult('error', `웹 푸시 알림 전송 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // PC 알림 테스트 함수들
  const testPCPermission = async () => {
    addTestResult('info', 'PC 알림 권한 요청 중...');
    const granted = await requestPCPermission();
    if (granted) {
      addTestResult('success', 'PC 알림 권한이 허용되었습니다.');
    } else {
      addTestResult('error', 'PC 알림 권한이 거부되었습니다.');
    }
  };

  const testPCDirectNotification = async () => {
    if (!isPCNotificationSupported) {
      addTestResult('error', 'PC 알림을 지원하지 않는 브라우저입니다.');
      return;
    }

    if (pcNotificationPermission !== 'granted') {
      addTestResult('error', 'PC 알림 권한이 허용되지 않았습니다.');
      return;
    }

    addTestResult('info', 'PC 직접 알림 전송 중...');
    
    const success = await sendPCNotification({
      title: 'PC 직접 알림 테스트',
      body: 'PC에서 직접 전송된 알림입니다. 이 메시지가 보이면 성공입니다!',
      icon: '/favicon.ico',
      url: '/test-notifications',
      tag: 'pc-direct-test',
      requireInteraction: true
    });

    if (success) {
      addTestResult('success', 'PC 직접 알림이 전송되었습니다. 시스템 알림을 확인해주세요.');
    } else {
      addTestResult('error', 'PC 직접 알림 전송에 실패했습니다.');
    }
  };

  const testPCNotificationToUser = async () => {
    if (!isPCNotificationSupported) {
      addTestResult('error', 'PC 알림을 지원하지 않는 브라우저입니다.');
      return;
    }

    if (pcNotificationPermission !== 'granted') {
      addTestResult('error', 'PC 알림 권한이 허용되지 않았습니다.');
      return;
    }

    addTestResult('info', 'PC 서버 알림 전송 중...');
    
    const success = await sendPCNotificationToUser('test-user', {
      title: 'PC 서버 알림 테스트',
      body: '서버를 통해 전송된 PC 알림입니다. 이 메시지가 보이면 성공입니다!',
      type: 'general',
      url: '/test-notifications'
    });

    if (success) {
      addTestResult('success', 'PC 서버 알림이 전송되었습니다. 시스템 알림을 확인해주세요.');
    } else {
      addTestResult('error', 'PC 서버 알림 전송에 실패했습니다.');
    }
  };

  const testFullFlow = async () => {
    addTestResult('info', '전체 알림 플로우 테스트 시작...');
    
    // 1. 권한 요청
    const granted = await requestPermission();
    if (!granted) {
      addTestResult('error', '권한 요청 실패로 테스트를 중단합니다.');
      return;
    }
    
    // 2. 토큰 등록
    const registered = await registerToken('test-user');
    if (!registered) {
      addTestResult('error', '토큰 등록 실패로 테스트를 중단합니다.');
      return;
    }
    
    // 3. 알림 전송
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
    await testNotificationSend();
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'info':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">알림 시스템 테스트</h1>
        <p className="text-gray-600 dark:text-gray-400">
          PC 푸시 알림과 토스트 알림이 제대로 작동하는지 테스트할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 현재 상태 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              웹 푸시 알림 상태
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">브라우저 지원</span>
              <Badge variant={isSupported ? "default" : "destructive"}>
                {isSupported ? '지원됨' : '지원 안됨'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">알림 권한</span>
              <Badge variant={permission === 'granted' ? "default" : "secondary"}>
                {permission === 'granted' ? '허용됨' : permission === 'denied' ? '거부됨' : '요청 필요'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">FCM 토큰</span>
              <Badge variant={fcmToken ? "default" : "secondary"}>
                {fcmToken ? '등록됨' : '없음'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">로딩 상태</span>
              <Badge variant={isLoading ? "secondary" : "outline"}>
                {isLoading ? '로딩 중' : '대기 중'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* PC 알림 상태 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              PC 푸시 알림 상태
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">브라우저 지원</span>
              <Badge variant={isPCNotificationSupported ? "default" : "destructive"}>
                {isPCNotificationSupported ? '지원됨' : '지원 안됨'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">PC 알림 권한</span>
              <Badge variant={pcNotificationPermission === 'granted' ? "default" : "secondary"}>
                {pcNotificationPermission === 'granted' ? '허용됨' : pcNotificationPermission === 'denied' ? '거부됨' : '요청 필요'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">서비스 워커</span>
              <Badge variant={pcNotificationStatus?.hasRegistration ? "default" : "secondary"}>
                {pcNotificationStatus?.hasRegistration ? '등록됨' : '없음'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">로딩 상태</span>
              <Badge variant={isPCNotificationLoading ? "secondary" : "outline"}>
                {isPCNotificationLoading ? '로딩 중' : '대기 중'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 웹 푸시 테스트 버튼들 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              웹 푸시 알림 테스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testPermission} 
              disabled={!isSupported || permission === 'granted'}
              className="w-full"
            >
              권한 요청 테스트
            </Button>
            <Button 
              onClick={testTokenRegistration} 
              disabled={!fcmToken || isLoading}
              variant="outline"
              className="w-full"
            >
              토큰 등록 테스트
            </Button>
            <Button 
              onClick={testNotificationSend} 
              disabled={!fcmToken}
              variant="outline"
              className="w-full"
            >
              웹 푸시 알림 테스트
            </Button>
          </CardContent>
        </Card>

        {/* PC 알림 테스트 버튼들 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              PC 푸시 알림 테스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testPCPermission} 
              disabled={!isPCNotificationSupported || pcNotificationPermission === 'granted'}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              PC 권한 요청 테스트
            </Button>
            <Button 
              onClick={testPCDirectNotification} 
              disabled={!isPCNotificationSupported || pcNotificationPermission !== 'granted'}
              variant="outline"
              className="w-full"
            >
              PC 직접 알림 테스트
            </Button>
            <Button 
              onClick={testPCNotificationToUser} 
              disabled={!isPCNotificationSupported || pcNotificationPermission !== 'granted'}
              variant="outline"
              className="w-full"
            >
              PC 서버 알림 테스트
            </Button>
            <Button 
              onClick={testFullFlow} 
              disabled={!isSupported || isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              전체 플로우 테스트
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 테스트 결과 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>테스트 결과</CardTitle>
            <Button onClick={clearResults} variant="outline" size="sm">
              결과 지우기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              테스트를 실행하면 결과가 여기에 표시됩니다.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-lg border flex items-start space-x-3 ${getStatusColor(result.type)}`}
                >
                  {getStatusIcon(result.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{result.message}</p>
                    <p className="text-xs opacity-75 mt-1">{result.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 사용법 안내 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>사용법 안내</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="space-y-2">
            <div className="font-semibold text-gray-800 dark:text-gray-200">웹 푸시 알림 (Firebase FCM)</div>
            <div>
              <strong>1. 권한 요청 테스트:</strong> 브라우저에서 알림 권한을 요청합니다.
            </div>
            <div>
              <strong>2. 토큰 등록 테스트:</strong> FCM 토큰을 서버에 등록합니다.
            </div>
            <div>
              <strong>3. 웹 푸시 알림 테스트:</strong> Firebase를 통해 토스트 알림을 전송합니다.
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="font-semibold text-gray-800 dark:text-gray-200">PC 푸시 알림 (Web Push API)</div>
            <div>
              <strong>1. PC 권한 요청 테스트:</strong> PC 알림 권한을 요청합니다.
            </div>
            <div>
              <strong>2. PC 직접 알림 테스트:</strong> 브라우저에서 직접 PC 알림을 전송합니다.
            </div>
            <div>
              <strong>3. PC 서버 알림 테스트:</strong> 서버를 통해 PC 알림을 전송합니다.
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="font-semibold text-gray-800 dark:text-gray-200">전체 플로우 테스트</div>
            <div>
              <strong>4. 전체 플로우 테스트:</strong> 웹 푸시와 PC 알림을 모두 테스트합니다.
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <strong>💡 팁:</strong> PC 푸시 알림을 확인하려면 브라우저를 백그라운드로 보내거나 다른 탭으로 이동한 후 알림을 전송해보세요.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
