import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase Messaging 초기화
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// FCM 토큰 가져오기
export const getFCMToken = async (): Promise<string | null> => {
  if (!messaging) {
    console.error('Firebase messaging이 초기화되지 않았습니다.');
    return null;
  }

  try {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('VAPID key가 설정되지 않았습니다.');
      return null;
    }

    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (error) {
    console.error('FCM 토큰을 가져오는 중 오류가 발생했습니다:', error);
    return null;
  }
};

// 포그라운드에서 메시지 수신 처리
export const onMessageListener = () => {
  if (!messaging) {
    console.error('Firebase messaging이 초기화되지 않았습니다.');
    return Promise.resolve({});
  }

  return new Promise((resolve) => {
    const unsubscribe = onMessage(messaging, (payload) => {
      resolve(payload);
    });
    
    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      unsubscribe();
    };
  });
};

export default app;
