import { Metadata } from 'next';
import { ReactTemplates } from '@/components/playground/react-templates';

export const metadata: Metadata = {
  title: 'React 템플릿 - joohwan.dev',
  description: 'React JSX 템플릿 모음',
};

export default function ReactTemplatesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ReactTemplates />
    </div>
  );
}
