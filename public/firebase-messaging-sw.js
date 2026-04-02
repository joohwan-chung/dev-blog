// Firebase 서비스 워커
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase 설정 - 빌드 시 환경변수로 교체됩니다
const firebaseConfig = {
  "apiKey": "YOUR_FIREBASE_API_KEY",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT_ID.appspot.com",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firebase Messaging 초기화
const messaging = firebase.messaging();

// 백그라운드에서 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || '새 알림';
  const notificationOptions = {
    body: payload.notification?.body || '새로운 메시지가 있습니다.',
    icon: payload.notification?.icon || '/favicon.ico',
    image: payload.notification?.image,
    badge: '/favicon.ico',
    tag: payload.data?.type || 'general',
    data: payload.data || {},
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
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // 이미 열린 탭이 있는지 확인
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // 새 탭 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// 알림 닫기 처리
self.addEventListener('notificationclose', (event) => {
});
