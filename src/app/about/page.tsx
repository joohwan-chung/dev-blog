import { getSelfIntroducePage } from '@/lib/notion';
import { NotionBlocks } from '@/components/blog/notion-blocks';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialLinks } from '@/components/common/social-links';
import { AboutWrapper } from '@/components/common/about-wrapper';
import { Calendar, Clock, User, Terminal } from 'lucide-react';
import { notFound } from 'next/navigation';

// 프로덕션 환경에서도 최신 데이터를 가져오도록 설정
export const revalidate = 0;

export default async function AboutPage() {
  const selfIntroducePage = await getSelfIntroducePage();

  if (!selfIntroducePage) {
    notFound();
  }

  return (
    <AboutWrapper>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Header */}
      <section className="pt-24 pb-16 px-4 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <Terminal className="h-12 w-12 text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            {selfIntroducePage.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {selfIntroducePage.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {selfIntroducePage.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Social Links */}
          <SocialLinks className="mb-8" iconSize={6} />

          {/* Meta Information */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>작성자: 주환</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>작성일: {selfIntroducePage.publishedDate ? new Date(selfIntroducePage.publishedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul' }) : '날짜 없음'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>최종 수정: {selfIntroducePage.lastUpdated ? new Date(selfIntroducePage.lastUpdated).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' }) : '날짜 없음'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800/50 transition-colors duration-200">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">자기소개</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-em:text-slate-700 dark:prose-em:text-slate-300 prose-code:text-slate-800 dark:prose-code:text-slate-200 prose-code:bg-slate-100 dark:prose-code:bg-slate-700 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:hover:text-blue-800 dark:prose-a:hover:text-blue-300 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400 prose-blockquote:border-slate-300 dark:prose-blockquote:border-slate-600 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800 prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-hr:border-slate-200 dark:prose-hr:border-slate-700 prose-table:border-slate-200 dark:prose-table:border-slate-700 prose-th:text-slate-900 dark:prose-th:text-slate-100 prose-td:text-slate-700 dark:prose-td:text-slate-300 prose-img:rounded-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-700 prose-p:leading-relaxed prose-p:mb-6 prose-headings:mb-6 prose-headings:mt-8 prose-ul:mb-6 prose-ol:mb-6 prose-blockquote:my-8 prose-code:my-4">
              <NotionBlocks blocks={selfIntroducePage.content} />
            </CardContent>
          </Card>
        </div>
      </section>
      </div>
    </AboutWrapper>
  );
}
