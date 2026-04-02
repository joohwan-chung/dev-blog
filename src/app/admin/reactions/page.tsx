'use client';

import { useAdminAuth } from '@/components/admin/admin-auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  X,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  User,
  FileText,
  Trash2,
  Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Reaction {
  id: string;
  postId: string;
  reactionType: string;
  userIp: string;
  createdAt: string;
  updatedAt: string;
  postTitle: string;
  postPublished: boolean;
}

export default function AdminReactionsPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'like' | 'dislike' | 'recommend' | 'not_recommend'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string): string => {
    if (!dateString) return '날짜 없음';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '날짜 없음' : date.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  // 시간 포맷팅 함수
  const formatTime = (dateString: string): string => {
    if (!dateString) return '시간 없음';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '시간 없음' : date.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchReactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reactions');
      if (response.ok) {
        const data = await response.json();
        setReactions(data.reactions);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReactions();
    }
  }, [isAuthenticated]);

  const handleDeleteReaction = async (reactionId: string, reactionType: string) => {
    if (!confirm(`"${reactionType}" 반응을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reactions?id=${reactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReactions(reactions.filter(reaction => reaction.id !== reactionId));
      }
    } catch (error) {
      console.error('Error deleting reaction:', error);
    }
  };

  const getReactionIcon = (reactionType: string) => {
    switch (reactionType) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'dislike':
        return <X className="h-4 w-4 text-gray-500" />;
      case 'recommend':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'not_recommend':
        return <ThumbsDown className="h-4 w-4 text-orange-500" />;
      default:
        return <Star className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getReactionLabel = (reactionType: string) => {
    switch (reactionType) {
      case 'like':
        return '좋아요';
      case 'dislike':
        return '싫어요';
      case 'recommend':
        return '추천';
      case 'not_recommend':
        return '비추천';
      default:
        return reactionType;
    }
  };

  const getReactionBadge = (reactionType: string) => {
    switch (reactionType) {
      case 'like':
        return <Badge variant="default" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">좋아요</Badge>;
      case 'dislike':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">싫어요</Badge>;
      case 'recommend':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">추천</Badge>;
      case 'not_recommend':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">비추천</Badge>;
      default:
        return <Badge variant="outline">{reactionType}</Badge>;
    }
  };

  const filteredReactions = reactions.filter(reaction => {
    const matchesSearch = reaction.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reaction.userIp.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || reaction.reactionType === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && reaction.postPublished) ||
                         (filterStatus === 'draft' && !reaction.postPublished);

    return matchesSearch && matchesType && matchesStatus;
  });

  // 통계 계산
  const stats = {
    total: reactions.length,
    like: reactions.filter(r => r.reactionType === 'like').length,
    dislike: reactions.filter(r => r.reactionType === 'dislike').length,
    recommend: reactions.filter(r => r.reactionType === 'recommend').length,
    notRecommend: reactions.filter(r => r.reactionType === 'not_recommend').length,
    published: reactions.filter(r => r.postPublished).length,
    draft: reactions.filter(r => !r.postPublished).length,
  };

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
            접근 권한이 없습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            관리자 페이지에 접근하려면 로그인이 필요합니다.
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            반응 관리
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            포스트에 대한 사용자 반응을 관리하세요
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {lastUpdated && (
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' })}
            </div>
          )}
          <Button
            onClick={fetchReactions}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* 반응 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">반응 통계</CardTitle>
          <CardDescription className="text-sm">
            현재 반응 유형별 및 포스트 상태별 통계
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">전체</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {stats.like}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">좋아요</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-gray-600">
                {stats.dislike}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">싫어요</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {stats.recommend}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">추천</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">
                {stats.notRecommend}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">비추천</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {stats.published}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">발행 포스트</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                {stats.draft}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">초안 포스트</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="포스트 제목이나 IP 주소로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'like' | 'dislike' | 'recommend' | 'not_recommend')}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">전체 반응</option>
                  <option value="like">좋아요</option>
                  <option value="dislike">싫어요</option>
                  <option value="recommend">추천</option>
                  <option value="not_recommend">비추천</option>
                </select>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="all">전체 포스트</option>
                <option value="published">발행된 포스트</option>
                <option value="draft">초안 포스트</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 반응 목록 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">반응을 불러오는 중...</p>
          </div>
        ) : filteredReactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                반응이 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? '검색 조건에 맞는 반응이 없습니다.' 
                  : '아직 등록된 반응이 없습니다.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReactions.map((reaction) => (
            <Card key={reaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* 헤더 섹션 */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                        {getReactionIcon(reaction.reactionType)}
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {reaction.postTitle}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getReactionBadge(reaction.reactionType)}
                        {reaction.postPublished ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                            발행됨
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                            초안
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 정보 섹션 */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>IP: {reaction.userIp}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{formatDate(reaction.createdAt)} {formatTime(reaction.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        포스트 ID: {reaction.postId}
                      </span>
                    </div>
                  </div>

                  {/* 액션 버튼 섹션 */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {filteredReactions.indexOf(reaction) + 1} / {filteredReactions.length}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => window.open(`/blog/${reaction.postId}`, '_blank')}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 h-8 w-8 sm:h-9 sm:w-9 p-0"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-gray-900 text-white border-gray-700 rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
                          sideOffset={8}
                        >
                          <p>포스트 보기</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleDeleteReaction(reaction.id, getReactionLabel(reaction.reactionType))}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 h-8 w-8 sm:h-9 sm:w-9 p-0"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-gray-900 text-white border-gray-700 rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
                          sideOffset={8}
                        >
                          <p>반응 삭제</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
