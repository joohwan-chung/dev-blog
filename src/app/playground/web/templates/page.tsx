import { Metadata } from 'next';
import { WebTemplates } from '@/components/playground/web-templates';

export const metadata: Metadata = {
  title: '웹 템플릿 - joohwan.dev',
  description: 'HTML, CSS, JavaScript 템플릿 모음',
};

export default function WebTemplatesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <WebTemplates />
    </div>
  );
}
