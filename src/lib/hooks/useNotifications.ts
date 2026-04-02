'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFCMToken, messaging } from '@/lib/firebase';
import { onMessage } from 'firebase/messaging';
import { toast } from 'sonner';


interface MessagePayload {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
    image?: string;
  };
  data?: {
    url?: string;
    type?: string;
    userId?: string;
    [key: string]: string | undefined;
  };
}

export const useNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 브라우저 지원 여부 확인
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // 서비스 워커 등록 확인
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
          .catch((error) => {
            console.error('서비스 워커 확인 실패:', error);
          });
      }
    }
  }, []);

  // FCM 토큰 가져오기
  const getToken = useCallback(async () => {
    if (!isSupported) {
      console.error('브라우저가 알림을 지원하지 않습니다.');
      return null;
    }

    try {
      setIsLoading(true);
      const token = await getFCMToken();
      setFcmToken(token);
      return token;
    } catch (error) {
      console.error('FCM 토큰 가져오기 실패:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // 알림 권한 요청
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error('이 브라우저는 알림을 지원하지 않습니다.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        toast.success('알림 권한이 허용되었습니다.');
        return true;
      } else {
        toast.error('알림 권한이 거부되었습니다.');
        return false;
      }
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      toast.error('알림 권한 요청에 실패했습니다.');
      return false;
    }
  }, [isSupported]);

  // FCM 토큰을 서버에 등록
  const registerToken = useCallback(async (userId: string, showSuccessMessage = false) => {
    let tokenToRegister = fcmToken;

    if (!tokenToRegister) {
      tokenToRegister = await getToken();
      if (!tokenToRegister) {
        console.error('FCM 토큰을 가져올 수 없습니다.');
        return false;
      }
    }

    try {
      const response = await fetch('/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fcmToken: tokenToRegister,
          userId: userId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // 새로 등록된 경우에만 성공 메시지 표시
        if (showSuccessMessage && result.isNewRegistration) {
          toast.success('알림 설정이 완료되었습니다.');
        }
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('토큰 등록 API 오류:', errorData);
        throw new Error(errorData.error || `토큰 등록 실패 (${response.status})`);
      }
    } catch (error) {
      console.error('FCM 토큰 등록 실패:', error);
      toast.error('알림 설정에 실패했습니다.');
      return false;
    }
  }, [fcmToken, getToken]);

  // 포그라운드 메시지 리스너 설정
  useEffect(() => {
    if (!isSupported || permission !== 'granted' || !messaging) {
      return;
    }

    const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
      // 포그라운드에서는 토스트 알림만 표시 (PC 푸시 알림은 백그라운드에서 처리)
      toast.info(payload.notification?.title || '새 알림', {
        description: payload.notification?.body || '새로운 메시지가 있습니다.',
        duration: 5000,
        action: payload.data?.url ? {
          label: '열기',
          onClick: () => {
            if (payload.data?.url) {
              window.location.href = payload.data.url;
            }
          }
        } : undefined,
      });
    });

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      unsubscribe();
    };
  }, [isSupported, permission]);

  // 알림 설정 초기화
  const initializeNotifications = useCallback(async (userId: string) => {
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
      toast.error('알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
      return false;
    }

    // FCM 토큰 가져오기 및 등록
    const token = await getToken();
    if (token) {
      return await registerToken(userId, false); // 자동 초기화 시에는 성공 메시지 표시하지 않음
    }

    return false;
  }, [isSupported, permission, requestPermission, getToken, registerToken]);

  return {
    isSupported,
    permission,
    fcmToken,
    isLoading,
    requestPermission,
    registerToken: (userId: string) => registerToken(userId, true), // 수동 호출 시에는 성공 메시지 표시
    initializeNotifications,
  };
};
