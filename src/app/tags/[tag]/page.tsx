'use client';

import { useState, useEffect } from 'react';
import { NotionPage } from '@/types/notion';
import { BlogCard } from '@/components/blog/blog-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Hash } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { collectEvent } from '@/lib/analytics';

interface TagPageProps {
  params: {
    tag: string;
  };
}

export default function TagPage({ params }: TagPageProps) {
  const [tag, setTag] = useState('');
  const [posts, setPosts] = useState<NotionPage[]>([]);
  const [allPosts, setAllPosts] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const { tag: tagParam } = await params;
        const decodedTag = decodeURIComponent(tagParam);
        setTag(decodedTag);

        if (typeof window !== 'undefined') {
          collectEvent({
            type: 'user_visit',
            description: `태그 페이지 방문: ${decodedTag}`,
            page: `/tags/${encodeURIComponent(decodedTag)}`,
            userAgent: window.navigator.userAgent,
            referrer: document.referrer,
          });
        }

        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const fetchedPosts = await response.json();
        setAllPosts(fetchedPosts);
        
        const filteredPosts = fetchedPosts.filter((post: NotionPage) => 
          post.tags.some((postTag: string) => postTag === decodedTag)
        );
        setPosts(filteredPosts);

        if (filteredPosts.length === 0) {
          notFound();
        }
      } catch (error) {
        console.error('페이지 초기화 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [params]);

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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Header */}
      <section className="pt-24 pb-16 px-4 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/tags">
              <Button variant="ghost" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                모든 태그로
              </Button>
            </Link>
          </div>

          {/* Tag Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center transition-colors">
                <Hash className="h-8 w-8 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">#{tag}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">{posts.length}개의 포스트</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              &ldquo;{tag}&rdquo; 태그와 관련된 포스트들을 확인해보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Posts Count */}
          <div className="mb-8">
            <p className="text-slate-600 dark:text-slate-400">
              총 <span className="font-semibold text-slate-900 dark:text-slate-100">{posts.length}</span>개의 포스트
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Related Tags */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">관련 태그</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from(new Set(allPosts.flatMap(post => post.tags)))
              .filter(t => t !== tag)
              .slice(0, 12)
              .map((relatedTag) => (
                <Link key={relatedTag} href={`/tags/${encodeURIComponent(relatedTag)}`}>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 text-sm border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {relatedTag}
                  </Badge>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
