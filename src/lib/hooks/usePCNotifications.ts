'use client';

import { useState, useEffect, useCallback } from 'react';
import { pcNotificationManager, PCNotificationPayload } from '@/lib/pc-notifications';
import { toast } from 'sonner';

export const usePCNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    isSupported: boolean;
    permission: NotificationPermission;
    hasRegistration: boolean;
    isServiceWorkerActive: boolean;
  } | null>(null);

  // 브라우저 지원 여부 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'Notification' in window && 'serviceWorker' in navigator;
      setIsSupported(supported);
      setPermission(Notification.permission);

      if (supported) {
        const currentStatus = pcNotificationManager.getStatus();
        setStatus(currentStatus);
      }
    }
  }, []);

  // PC 알림 권한 요청
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error('이 브라우저는 PC 알림을 지원하지 않습니다.');
      return false;
    }

    try {
      setIsLoading(true);
      const granted = await pcNotificationManager.requestPermission();
      setPermission(Notification.permission);

      if (granted) {
        toast.success('PC 알림 권한이 허용되었습니다.');
        // 서비스 워커 등록
        await pcNotificationManager.registerServiceWorker();
        // 클릭 핸들러 설정
        pcNotificationManager.setupNotificationClickHandler();
        // 상태 업데이트
        setStatus(pcNotificationManager.getStatus());
        return true;
      } else {
        toast.error('PC 알림 권한이 거부되었습니다.');
        return false;
      }
    } catch (error) {
      console.error('PC 알림 권한 요청 실패:', error);
      toast.error('PC 알림 권한 요청에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // PC 알림 전송
  const sendPCNotification = useCallback(async (payload: PCNotificationPayload) => {
    if (!isSupported) {
      toast.error('PC 알림을 지원하지 않는 브라우저입니다.');
      return false;
    }

    if (permission !== 'granted') {
      toast.error('PC 알림 권한이 허용되지 않았습니다.');
      return false;
    }

    try {
      setIsLoading(true);
      const success = await pcNotificationManager.sendPCNotification(payload);

      if (success) {
        toast.success('PC 푸시 알림이 전송되었습니다.');
        return true;
      } else {
        toast.error('PC 푸시 알림 전송에 실패했습니다.');
        return false;
      }
    } catch (error) {
      console.error('PC 알림 전송 실패:', error);
      toast.error('PC 알림 전송 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permission]);

  // 서버를 통한 PC 알림 전송
  const sendPCNotificationToUser = useCallback(async (
    userId: string,
    payload: Omit<PCNotificationPayload, 'url' | 'tag'> & { url?: string; type?: string }
  ) => {
    if (!isSupported) {
      toast.error('PC 알림을 지원하지 않는 브라우저입니다.');
      return false;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/pc-notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: payload.title,
          body: payload.body,
          type: payload.type || 'general',
          targetUserId: userId,
          data: {
            url: payload.url || '/',
            type: payload.type || 'general'
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `PC 알림 전송에 실패했습니다. (${response.status})`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success('PC 푸시 알림이 전송되었습니다.');
        return true;
      } else {
        throw new Error(result.error || 'PC 알림 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('PC 알림 전송 오류:', error);
      toast.error(error instanceof Error ? error.message : 'PC 알림 전송 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // PC 알림 초기화
  const initializePCNotifications = useCallback(async () => {
    if (!isSupported) {
      return false;
    }

    // 권한이 없으면 요청
    if (permission === 'default') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    // 권한이 거부된 경우
    if (permission === 'denied') {
      toast.error('PC 알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
      return false;
    }

    // 서비스 워커 등록
    const registered = await pcNotificationManager.registerServiceWorker();
    if (registered) {
      pcNotificationManager.setupNotificationClickHandler();
      setStatus(pcNotificationManager.getStatus());
      return true;
    }

    return false;
  }, [isSupported, permission, requestPermission]);

  return {
    isSupported,
    permission,
    isLoading,
    status,
    requestPermission,
    sendPCNotification,
    sendPCNotificationToUser,
    initializePCNotifications,
  };
};
