"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { NotionPage } from '@/types/notion';
import { collectClickEvent } from '@/lib/analytics';

interface BlogCardProps {
  post: NotionPage;
  /** 검색 결과 스니펫 (본문 검색 시 표시) */
  snippet?: string;
}

export function BlogCard({ post, snippet }: BlogCardProps) {
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString || typeof dateString !== 'string') return '날짜 없음';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '날짜 없음';
    try {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Seoul'
      }).replace(/\. /g, '.').replace(/\.$/, '');
    } catch {
      return '날짜 없음';
    }
  };

  // 발행일 > 최종수정일 > 생성일 순으로 표시할 날짜 선택
  const displayDate = post.publishedDate || post.lastUpdated || post.created;

  return (
    <Card className="group hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all duration-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900">
      <Link 
        href={`/blog/${post.id}`} 
        className="block h-full"
        onClick={() => collectClickEvent(`블로그 카드: ${post.title}`)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
              {formatDate(displayDate)}
            </span>
            <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          </div>
          
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </CardTitle>
          
          <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed text-sm">
            {post.description}
          </CardDescription>
          {snippet && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500 line-clamp-2 leading-relaxed">
              {snippet}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-500">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
