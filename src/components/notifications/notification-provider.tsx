'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useAuth } from '@/lib/auth-context';

interface NotificationContextType {
  isSupported: boolean;
  permission: NotificationPermission;
  fcmToken: string | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  initializeNotifications: (userId: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const notifications = useNotifications();

  // 사용자가 로그인했을 때 알림 초기화
  useEffect(() => {
    if (user?.id && notifications.isSupported) {
      notifications.initializeNotifications(user.id);
    }
  }, [user?.id, notifications.isSupported, notifications.initializeNotifications, notifications]);

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
