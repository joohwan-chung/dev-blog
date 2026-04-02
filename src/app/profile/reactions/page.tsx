'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  X, 
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserReaction {
  id: string;
  postId: string;
  postTitle: string;
  postSlug: string;
  reactionType: 'like' | 'dislike' | 'recommend' | 'not_recommend';
  createdAt: string;
  postExcerpt?: string;
}

export default function UserReactionsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [reactions, setReactions] = useState<UserReaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/reactions', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setReactions(data);
        } else {
          console.error('Failed to fetch reactions');
        }
      } catch (error) {
        console.error('Error fetching reactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchReactions();
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
            반응 내역을 보려면 로그인해주세요.
          </p>
          <Button onClick={() => router.push('/')}>
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  const getReactionIcon = (type: string) => {
    const iconConfig = {
      like: { icon: ThumbsUp, color: 'text-blue-600 dark:text-blue-400' },
      dislike: { icon: ThumbsDown, color: 'text-red-600 dark:text-red-400' },
      recommend: { icon: Heart, color: 'text-green-600 dark:text-green-400' },
      not_recommend: { icon: X, color: 'text-orange-600 dark:text-orange-400' }
    };
    
    const config = iconConfig[type as keyof typeof iconConfig] || iconConfig.like;
    const Icon = config.icon;
    
    return <Icon className={`h-5 w-5 ${config.color}`} />;
  };

  const getReactionBadge = (type: string) => {
    const badgeConfig = {
      like: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', text: '좋아요' },
      dislike: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', text: '싫어요' },
      recommend: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: '추천' },
      not_recommend: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', text: '비추천' }
    };
    
    const config = badgeConfig[type as keyof typeof badgeConfig] || badgeConfig.like;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

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

  const filteredReactions = (type: string) => {
    if (type === 'all') return reactions;
    return reactions.filter(reaction => reaction.reactionType === type);
  };

  const getReactionCount = (type: string) => {
    return reactions.filter(reaction => reaction.reactionType === type).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">반응 내역을 불러오는 중...</p>
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">내 반응</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              내가 남긴 좋아요, 추천 등의 반응 내역을 확인하세요
            </p>
          </div>

          {/* 반응 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <ThumbsUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {getReactionCount('like')}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">좋아요</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <ThumbsDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {getReactionCount('dislike')}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">싫어요</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {getReactionCount('recommend')}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">추천</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <X className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {getReactionCount('not_recommend')}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">비추천</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 반응 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>반응 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="like">좋아요</TabsTrigger>
                  <TabsTrigger value="dislike">싫어요</TabsTrigger>
                  <TabsTrigger value="recommend">추천</TabsTrigger>
                  <TabsTrigger value="not_recommend">비추천</TabsTrigger>
                </TabsList>

                {['all', 'like', 'dislike', 'recommend', 'not_recommend'].map((type) => (
                  <TabsContent key={type} value={type} className="space-y-4">
                    {filteredReactions(type).length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        {type === 'all' ? '반응 내역이 없습니다.' : `${type === 'like' ? '좋아요' : type === 'dislike' ? '싫어요' : type === 'recommend' ? '추천' : '비추천'} 내역이 없습니다.`}
                      </div>
                    ) : (
                      filteredReactions(type).map((reaction) => (
                        <div key={reaction.id} className="flex items-start space-x-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex-shrink-0">
                            {getReactionIcon(reaction.reactionType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-slate-900 dark:text-white truncate">
                                  {reaction.postTitle}
                                </h3>
                                {reaction.postExcerpt && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                    {reaction.postExcerpt}
                                  </p>
                                )}
                                <div className="flex items-center space-x-2 mt-2">
                                  {getReactionBadge(reaction.reactionType)}
                                  <span className="text-xs text-slate-500 dark:text-slate-500">
                                    {formatDate(reaction.createdAt)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/blog/${reaction.postSlug}`}>
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    포스트 보기
                                  </Link>
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
