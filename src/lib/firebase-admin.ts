import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// Firebase Admin SDK 초기화
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Firebase Admin Messaging 인스턴스
export const adminMessaging = getMessaging();

// 알림 전송 함수
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  data?: Record<string, string>;
}

export const sendNotificationToUser = async (
  fcmToken: string,
  payload: NotificationPayload
) => {
  try {
    const message = {
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
        image: payload.image,
      },
      data: payload.data || {},
      webpush: {
        notification: {
          title: payload.title,
          body: payload.body,
          icon: payload.icon || '/favicon.ico',
          image: payload.image,
          badge: '/favicon.ico',
          tag: payload.data?.type || 'general',
          requireInteraction: true, // 사용자가 직접 닫을 때까지 알림 유지
          actions: [
            {
              action: 'open',
              title: '열기',
              icon: '/favicon.ico'
            },
            {
              action: 'close',
              title: '닫기',
              icon: '/favicon.ico'
            }
          ]
        },
        fcm_options: {
          link: payload.data?.url || '/',
        },
      },
    };

    const response = await adminMessaging.send(message);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('알림 전송 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
};

export const sendNotificationToMultipleUsers = async (
  fcmTokens: string[],
  payload: NotificationPayload
) => {
  try {
    const message = {
      tokens: fcmTokens,
      notification: {
        title: payload.title,
        body: payload.body,
        image: payload.image,
      },
      data: payload.data || {},
      webpush: {
        notification: {
          title: payload.title,
          body: payload.body,
          icon: payload.icon || '/favicon.ico',
          image: payload.image,
          badge: '/favicon.ico',
          tag: payload.data?.type || 'general',
          requireInteraction: true, // 사용자가 직접 닫을 때까지 알림 유지
          actions: [
            {
              action: 'open',
              title: '열기',
              icon: '/favicon.ico'
            },
            {
              action: 'close',
              title: '닫기',
              icon: '/favicon.ico'
            }
          ]
        },
        fcm_options: {
          link: payload.data?.url || '/',
        },
      },
    };

    const response = await adminMessaging.sendEachForMulticast(message);
    return { 
      success: true, 
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    };
  } catch (error) {
    console.error('다중 알림 전송 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
};
