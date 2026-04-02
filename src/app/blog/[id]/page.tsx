import { getPageById, getDatabasePages, getRelatedPosts } from '@/lib/notion';
import { getReadingTimeMinutes } from '@/lib/reading-time';
import { ArticleBodyWithSpy } from '@/components/blog/article-body-with-spy';
import { CommentSection } from '@/components/blog/comment-section';
import { ReadingProgressBar } from '@/components/blog/reading-progress-bar';
import { ReactionButtons } from '@/components/blog/reaction-buttons';
import { PostShareButton } from '@/components/blog/post-share-button';
import { PrintButton } from '@/components/blog/print-button';
import { CommentScrollButton } from '@/components/blog/comment-scroll-button';
import { BlogCard } from '@/components/blog/blog-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Tag, User, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogPostWrapper } from '@/components/blog/blog-post-wrapper';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

// 프로덕션 환경에서도 최신 데이터를 가져오도록 설정
export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPageById(id);
  if (!post) return {};
  const title = post.title;
  const description = post.description || post.title;
  const url = `${BASE_URL}/blog/${post.id}`;
  const images = post.coverUrl
    ? [{ url: post.coverUrl, width: 1200, height: 630, alt: post.title }]
    : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      ...(images && { images }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images && { images }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await getPageById(id);

  if (!post) {
    notFound();
  }

  const readingMinutes = getReadingTimeMinutes(post.content);
  const allPosts = await getDatabasePages();
  const relatedPosts = getRelatedPosts(allPosts, post.id, post.tags, 5);
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Seoul'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Seoul'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <BlogPostWrapper post={post}>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
        <ReadingProgressBar />
        {/* Back Button */}
        <div className="no-print bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors duration-200">
          <div className="container mx-auto px-4 py-4">
            <Link href="/blog">
              <Button variant="ghost" className="text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors duration-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                블로그 목록으로
              </Button>
            </Link>
          </div>
        </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-stone-500 dark:text-slate-400 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">작성일: {post.publishedDate ? formatDate(post.publishedDate) : formatDate(post.created)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">최종 수정: {formatDateTime(post.lastUpdated)}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">약 {readingMinutes}분 소요</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Description */}
            {post.description && (
              <p className="text-xl text-stone-600 dark:text-slate-400 mb-8 leading-relaxed max-w-3xl">
                {post.description}
              </p>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-stone-100 dark:bg-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-600 border-stone-200 dark:border-slate-600 px-3 py-1 transition-colors duration-200"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Author and Share */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-100 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-stone-200 to-stone-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-stone-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900 dark:text-slate-100">주환</p>
                  <p className="text-sm text-stone-500 dark:text-slate-400">개발자</p>
                </div>
              </div>

              <PostShareButton post={{ title: post.title, description: post.description, id: post.id }} baseUrl={BASE_URL} />
            </div>
          </header>

          {/* Article Body */}
          <div data-article-start aria-hidden="true" />
          <ArticleBodyWithSpy blocks={post.content} />
          <div data-article-end aria-hidden="true" />

          {/* Reaction Section */}
          <div className="no-print mt-16 pt-8 border-t border-stone-100 dark:border-slate-700">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-slate-100 mb-4">
                  이 글이 도움이 되셨나요?
                </h3>
                <ReactionButtons postId={post.id} />
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="no-print mt-16 pt-8 border-t border-stone-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-slate-100 mb-4">관련 포스트</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((p) => (
                  <BlogCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}

          {/* Prev/Next Post */}
          {(prevPost || nextPost) && (
            <nav className="no-print mt-12 pt-8 border-t border-stone-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.id}`}
                  className="flex items-center gap-2 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 transition-colors max-w-[50%]"
                >
                  <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">이전 글: {prevPost.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.id}`}
                  className="flex items-center gap-2 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 transition-colors max-w-[50%] sm:text-right"
                >
                  <span className="truncate">다음 글: {nextPost.title}</span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          {/* Article Footer */}
          <footer className="no-print mt-8 pt-8 border-t border-stone-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-stone-500 dark:text-slate-400">
                마지막 수정: {formatDateTime(post.lastUpdated)}
              </div>
              
              <div className="flex gap-3 no-print">
                <CommentScrollButton />
                <PrintButton />
              </div>
            </div>
          </footer>

          {/* Comments Section */}
          <div id="comments-section" className="no-print">
            <CommentSection postId={post.id} postAllowComments={post.allowComments} />
          </div>
        </article>
      </div>
    </div>
    </BlogPostWrapper>
  );
}
