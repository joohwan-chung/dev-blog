import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '플레이그라운드 - joohwan.dev',
  description: '실시간 코드 작성 및 미리보기 플레이그라운드',
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
