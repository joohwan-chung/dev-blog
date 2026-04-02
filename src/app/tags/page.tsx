'use client';

import { useState, useEffect } from 'react';
import { NotionPage } from '@/types/notion';
import { BlogCard } from '@/components/blog/blog-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { collectEvent } from '@/lib/analytics';

export default function TagsPage() {
  const [posts, setPosts] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      collectEvent({
        type: 'user_visit',
        description: '태그 목록 페이지 방문',
        page: '/tags',
        userAgent: window.navigator.userAgent,
        referrer: document.referrer,
      });
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const fetchedPosts = await response.json();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('포스트를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  // 모든 태그와 해당 태그의 포스트 수 계산
  const tagCounts = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // 태그를 포스트 수로 정렬
  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Header */}
      <section className="pt-24 pb-16 px-4 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <BookOpen className="h-12 w-12 text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            태그별 보기
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            관심 있는 주제별로 포스트를 찾아보세요.
            <br className="hidden sm:block" />
            총 <span className="font-semibold text-slate-900 dark:text-slate-100">{posts.length}</span>개의 포스트가 있습니다.
          </p>
        </div>
      </section>

      {/* Tags Overview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">모든 태그</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedTags.map(([tag, count]) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                <Card className="hover:shadow-md dark:hover:shadow-slate-800/50 transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Hash className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
                      <CardTitle className="text-base text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        {tag}
                      </CardTitle>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs">
                        {count}개 포스트
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">최근 포스트</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 6).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🏷️</div>
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-3">아직 포스트가 없습니다</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg">곧 새로운 개발 내용으로 찾아뵙겠습니다!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
