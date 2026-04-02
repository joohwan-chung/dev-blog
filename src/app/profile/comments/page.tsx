'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  ExternalLink,
  BookOpen,
  Reply,
  Edit,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserComment {
  id: string;
  postId: string;
  postTitle: string;
  postSlug: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isReply: boolean;
  parentId?: string;
  postExcerpt?: string;
  likes?: number;
  replies?: number;
}

export default function UserCommentsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [comments, setComments] = useState<UserComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/comments', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchComments();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            댓글 내역을 보려면 로그인해주세요.
          </p>
          <Button onClick={() => router.push('/')}>
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul'
    });
  };

  const filteredComments = (type: string) => {
    if (type === 'all') return comments;
    if (type === 'comments') return comments.filter(comment => !comment.isReply);
    if (type === 'replies') return comments.filter(comment => comment.isReply);
    return comments;
  };

  const getCommentCount = (type: string) => {
    return filteredComments(type).length;
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">댓글 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">내 댓글</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              내가 작성한 댓글과 답글 내역을 확인하세요
            </p>
          </div>

          {/* 댓글 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {getCommentCount('comments')}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">댓글</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Reply className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {getCommentCount('replies')}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">답글</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {getCommentCount('all')}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">전체</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 댓글 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>댓글 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="comments">댓글</TabsTrigger>
                  <TabsTrigger value="replies">답글</TabsTrigger>
                </TabsList>

                {['all', 'comments', 'replies'].map((type) => (
                  <TabsContent key={type} value={type} className="space-y-4">
                    {filteredComments(type).length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        {type === 'all' ? '댓글 내역이 없습니다.' : `${type === 'comments' ? '댓글' : '답글'} 내역이 없습니다.`}
                      </div>
                    ) : (
                      filteredComments(type).map((comment) => (
                        <div key={comment.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="space-y-3">
                            {/* 댓글 헤더 */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-slate-900 dark:text-white">
                                  {comment.postTitle}
                                </h3>
                                {comment.isReply && (
                                  <Badge variant="outline" className="text-xs">
                                    <Reply className="h-3 w-3 mr-1" />
                                    답글
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-slate-500 dark:text-slate-500">
                                  {formatDate(comment.createdAt)}
                                </span>
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/blog/${comment.postSlug}`}>
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    포스트 보기
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            {/* 댓글 내용 */}
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                              <p className="text-slate-700 dark:text-slate-300">
                                {truncateContent(comment.content)}
                              </p>
                            </div>

                            {/* 댓글 메타 정보 */}
                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex items-center space-x-4">
                                {comment.likes && comment.likes > 0 && (
                                  <span>좋아요 {comment.likes}</span>
                                )}
                                {comment.replies && comment.replies > 0 && (
                                  <span>답글 {comment.replies}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  수정
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  삭제
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}