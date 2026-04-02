// Service Worker 타입 정의
interface ServiceWorkerGlobalScope {
  clients: Clients;
}

interface Clients {
  matchAll(options?: { type?: string; includeUncontrolled?: boolean }): Promise<WindowClient[]>;
  openWindow(url: string): Promise<WindowClient | null>;
}

interface WindowClient {
  url: string;
  focus(): Promise<WindowClient>;
}

interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}

interface NotificationClickEvent extends ExtendableEvent {
  notification: Notification;
  action?: string;
}

// PC 푸시 알림을 위한 별도 시스템
export interface PCNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  url?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class PCNotificationManager {
  private static instance: PCNotificationManager;
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported = false;

  private constructor() {
    this.isSupported = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
  }

  public static getInstance(): PCNotificationManager {
    if (!PCNotificationManager.instance) {
      PCNotificationManager.instance = new PCNotificationManager();
    }
    return PCNotificationManager.instance;
  }

  // 서비스 워커 등록
  public async registerServiceWorker(): Promise<boolean> {
    if (!this.isSupported) {
      console.error('PC 알림을 지원하지 않는 브라우저입니다.');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      return true;
    } catch (error) {
      console.error('서비스 워커 등록 실패:', error);
      return false;
    }
  }

  // 알림 권한 요청
  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.error('PC 알림을 지원하지 않는 브라우저입니다.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      return false;
    }
  }

  // PC 푸시 알림 전송
  public async sendPCNotification(payload: PCNotificationPayload): Promise<boolean> {
    if (!this.isSupported) {
      console.error('PC 알림을 지원하지 않는 브라우저입니다.');
      return false;
    }

    if (Notification.permission !== 'granted') {
      console.error('알림 권한이 허용되지 않았습니다.');
      return false;
    }

    if (!this.registration) {
      const registered = await this.registerServiceWorker();
      if (!registered) {
        console.error('서비스 워커 등록에 실패했습니다.');
        return false;
      }
    }

    try {
      const notificationOptions: NotificationOptions = {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.tag || 'pc-notification',
        requireInteraction: payload.requireInteraction || true,
        data: {
          url: payload.url || '/',
          timestamp: Date.now()
        }
      } as NotificationOptions;

      // 서비스 워커를 통해 알림 표시
      if (this.registration) {
        await this.registration.showNotification(payload.title, notificationOptions);
        return true;
      } else {
        // 서비스 워커가 없으면 직접 알림 표시
        const notification = new Notification(payload.title, notificationOptions);
        
        notification.onclick = () => {
          window.focus();
          if (payload.url) {
            window.location.href = payload.url;
          }
          notification.close();
        };

        return true;
      }
    } catch (error) {
      console.error('PC 푸시 알림 전송 실패:', error);
      return false;
    }
  }

  // 알림 클릭 이벤트 리스너 등록
  public setupNotificationClickHandler(): void {
    if (!this.registration) return;

    this.registration.addEventListener('notificationclick', (event: Event) => {
      const notificationEvent = event as unknown as NotificationClickEvent;
      notificationEvent.notification.close();
      
      if (notificationEvent.action === 'open' || !notificationEvent.action) {
        const urlToOpen = notificationEvent.notification.data?.url || '/';
        notificationEvent.waitUntil(
          (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList: WindowClient[]) => {
            // 이미 열린 탭이 있는지 확인
            for (const client of clientList) {
              if (client.url === urlToOpen && 'focus' in client) {
                return client.focus();
              }
            }
            // 새 탭 열기
            const swGlobal = self as unknown as ServiceWorkerGlobalScope;
            if (swGlobal.clients.openWindow) {
              return swGlobal.clients.openWindow(urlToOpen);
            }
          })
        );
      }
    });
  }

  // 현재 상태 확인
  public getStatus() {
    return {
      isSupported: this.isSupported,
      permission: Notification.permission,
      hasRegistration: !!this.registration,
      isServiceWorkerActive: this.registration?.active?.state === 'activated'
    };
  }
}

// 싱글톤 인스턴스 내보내기
export const pcNotificationManager = PCNotificationManager.getInstance();
