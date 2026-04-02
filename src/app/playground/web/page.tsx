import { Metadata } from 'next';
import { WebPlayground } from '@/components/playground/web-playground';

export const metadata: Metadata = {
  title: '웹 플레이그라운드 - joohwan.dev',
  description: 'HTML, CSS, JavaScript를 함께 작성하고 실시간으로 미리보기할 수 있는 웹 플레이그라운드',
};

export default function WebPlaygroundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <WebPlayground />
    </div>
  );
}
