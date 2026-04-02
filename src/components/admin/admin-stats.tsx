'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Heart, TrendingUp } from 'lucide-react';

interface BlogStats {
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
  recentPosts: Array<{
    id: string;
    title: string;
    views: number;
    comments: number;
    reactions: number;
    publishedAt: string;
  }>;
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    comments: number;
    reactions: number;
  }>;
}

export function AdminStats() {
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogStats = async () => {
      try {
        setLoading(true);
        
        // 실제로는 API에서 데이터를 가져와야 합니다
        // 현재는 임시 데이터를 사용
        const mockStats: BlogStats = {
          totalPosts: 12,
          totalComments: 45,
          totalReactions: 128,
          recentPosts: [
            {
              id: '1',
              title: 'React Hooks 완벽 가이드',
              views: 234,
              comments: 12,
              reactions: 28,
              publishedAt: '2024-01-15',
            },
            {
              id: '2',
              title: 'TypeScript 타입 시스템 이해하기',
              views: 189,
              comments: 8,
              reactions: 22,
              publishedAt: '2024-01-10',
            },
            {
              id: '3',
              title: 'Next.js 14 새로운 기능들',
              views: 156,
              comments: 15,
              reactions: 31,
              publishedAt: '2024-01-05',
            },
          ],
          topPosts: [
            {
              id: '1',
              title: 'React Hooks 완벽 가이드',
              views: 234,
              comments: 12,
              reactions: 28,
            },
            {
              id: '2',
              title: 'TypeScript 타입 시스템 이해하기',
              views: 189,
              comments: 8,
              reactions: 22,
            },
            {
              id: '3',
              title: 'Next.js 14 새로운 기능들',
              views: 156,
              comments: 15,
              reactions: 31,
            },
          ],
        };
        
        setStats(mockStats);
      } catch (err) {
        setError('블로그 통계를 불러오는데 실패했습니다.');
        console.error('Error fetching blog stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>블로그 통계</CardTitle>
          <CardDescription>
            블로그 데이터를 불러오는 중...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>블로그 통계</CardTitle>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>블로그 통계</CardTitle>
          <CardDescription>
            블로그의 전체적인 성과 지표
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">총 포스트</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                이번 달 +2개
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">총 댓글</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalComments}</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                이번 주 +5개
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">총 반응</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalReactions}</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                이번 주 +12개
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 포스트</CardTitle>
            <CardDescription>
              최근에 발행된 포스트들의 성과
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{post.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{post.views} 조회</span>
                    <span>{post.comments} 댓글</span>
                    <span>{post.reactions} 반응</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>인기 포스트</CardTitle>
            <CardDescription>
              가장 인기 있는 포스트 TOP 3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300">
                      {index + 1}
                    </div>
                    <h4 className="text-sm font-medium truncate">{post.title}</h4>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{post.views}</span>
                    <span>{post.comments}</span>
                    <span>{post.reactions}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
