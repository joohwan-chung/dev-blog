// 어드민 페이지는 검색 엔진에서 제외
export const metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  other: {
    'googlebot': 'noindex, nofollow, noarchive, nosnippet',
    'bingbot': 'noindex, nofollow, noarchive, nosnippet',
  },
};

import { AdminAuthProvider } from '@/components/admin/admin-auth-provider';
import { AdminLayoutClient } from './admin-layout-client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminAuthProvider>
  );
}
