import { Metadata } from 'next';
import { MarkdownPlayground } from '@/components/playground/markdown-playground';

export const metadata: Metadata = {
  title: '마크다운 플레이그라운드 - joohwan.dev',
  description: '마크다운 문법을 실시간으로 작성하고 미리보기할 수 있는 플레이그라운드',
};

export default function MarkdownPlaygroundPage() {
  return <MarkdownPlayground />;
}
