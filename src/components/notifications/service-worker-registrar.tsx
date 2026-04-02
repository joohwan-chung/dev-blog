'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // 서비스 워커 등록
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(() => {
        })
        .catch((error) => {
          console.error('서비스 워커 등록 실패:', error);
        });
    }
  }, []);

  return null;
}
