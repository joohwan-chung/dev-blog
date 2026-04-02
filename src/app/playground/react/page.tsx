import { Metadata } from 'next';
import { ReactPlayground } from '@/components/playground/react-playground';

export const metadata: Metadata = {
  title: 'React 플레이그라운드 - joohwan.dev',
  description: 'React 컴포넌트를 작성하고 실시간으로 미리보기할 수 있는 React 플레이그라운드',
};

export default function ReactPlaygroundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ReactPlayground />
    </div>
  );
}
