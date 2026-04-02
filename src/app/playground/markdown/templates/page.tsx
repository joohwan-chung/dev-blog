import { Metadata } from 'next';
import { MarkdownTemplates } from '@/components/playground/markdown-templates';

export const metadata: Metadata = {
  title: '마크다운 템플릿 - joohwan.dev',
  description: '마크다운 플레이그라운드에서 사용할 수 있는 다양한 템플릿',
};

export default function MarkdownTemplatesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <MarkdownTemplates />
    </div>
  );
}
