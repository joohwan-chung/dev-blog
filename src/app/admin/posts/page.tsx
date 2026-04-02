'use client';

import { useAdminAuth } from '@/components/admin/admin-auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileText, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Calendar,
  Tag,
  Search,
  Filter,
  RefreshCw,
  MessageCircle,
  MessageCircleOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NotionPage } from '@/types/notion';

export default function AdminPostsPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'hidden'>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '날짜 없음';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '날짜 없음' : date.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const handleTogglePublished = async (postId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentStatus,
        }),
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, published: !currentStatus, publishedDate: !currentStatus ? new Date().toISOString() : '' }
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling published status:', error);
    }
  };

  const handleToggleHidden = async (postId: string, currentStatus: boolean | undefined) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hidden: !(currentStatus || false),
        }),
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, hidden: !(currentStatus || false) }
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling hidden status:', error);
    }
  };

  const handleToggleComments = async (postId: string, currentStatus: boolean | undefined) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allowComments: !(currentStatus ?? true), // 기본값은 true
        }),
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, allowComments: !(currentStatus ?? true) }
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling comments status:', error);
    }
  };

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (!confirm(`"${postTitle}" 포스트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (postId: string) => {
    router.push(`/admin/posts/${postId}/edit`);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    switch (filterStatus) {
      case 'published':
        matchesFilter = post.published && !post.hidden;
        break;
      case 'draft':
        matchesFilter = !post.published;
        break;
      case 'hidden':
        matchesFilter = post.hidden || false;
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

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

  const getStatusBadge = (post: NotionPage) => {
    if (post.hidden) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">숨김</Badge>;
    }
    if (post.published) {
      return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">발행됨</Badge>;
    }
    return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">초안</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            포스트 관리
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            블로그 포스트를 관리하고 편집하세요
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {lastUpdated && (
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' })}
            </div>
          )}
          <Button
            onClick={fetchPosts}
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

      {/* 포스트 통계 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>포스트 관리</CardTitle>
          <CardDescription>포스트 상태별 통계 및 검색/필터</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {posts.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">전체</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {posts.filter(p => p.published && !p.hidden).length}
              </div>
              <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">발행됨</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                {posts.filter(p => !p.published).length}
              </div>
              <div className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">초안</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {posts.filter(p => p.hidden).length}
              </div>
              <div className="text-xs sm:text-sm text-red-700 dark:text-red-300">숨김</div>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="포스트 제목이나 설명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft' | 'hidden')}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white min-w-[120px]"
                >
                  <option value="all">전체</option>
                  <option value="published">발행됨</option>
                  <option value="draft">초안</option>
                  <option value="hidden">숨김</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 포스트 목록 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">포스트를 불러오는 중...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                포스트가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStatus !== 'all' 
                  ? '검색 조건에 맞는 포스트가 없습니다.' 
                  : '아직 작성된 포스트가 없습니다.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* 포스트 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {post.title}
                      </h3>
                      {getStatusBadge(post)}
                    </div>
                    
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {post.description || '설명이 없습니다.'}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {post.publishedDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>발행: {formatDate(post.publishedDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>수정: {formatDate(post.lastUpdated)}</span>
                      </div>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {filteredPosts.indexOf(post) + 1} / {filteredPosts.length}
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleTogglePublished(post.id, post.published)}
                            variant="outline"
                            size="sm"
                            className={`${post.published ? 'text-green-600 hover:text-green-700' : 'text-gray-600 hover:text-gray-700'} h-9 w-9 p-0`}
                          >
                            {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-gray-900 text-white border-gray-700 rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
                          sideOffset={8}
                        >
                          <p>{post.published ? '발행 취소' : '포스트 발행'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleToggleHidden(post.id, post.hidden || false)}
                            variant="outline"
                            size="sm"
                            className={`${post.hidden ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-gray-700'} h-9 w-9 p-0`}
                          >
                            {post.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-gray-900 text-white border-gray-700 rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
                          sideOffset={8}
                        >
                          <p>{post.hidden ? '숨김 해제' : '포스트 숨기기'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleToggleComments(post.id, post.allowComments)}
                            variant="outline"
                            size="sm"
                            className={`${(post.allowComments ?? true) ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'} h-9 w-9 p-0`}
                          >
                            {(post.allowComments ?? true) ? <MessageCircle className="h-4 w-4" /> : <MessageCircleOff className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-gray-900 text-white border-gray-700 rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
                          sideOffset={8}
                        >
                          <p>{(post.allowComments ?? true) ? '댓글 비활성화' : '댓글 활성화'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleEditPost(post.id)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 h-9 w-9 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-gray-900 text-white border-gray-700 rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
                          sideOffset={8}
                        >
                          <p>포스트 수정</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleDeletePost(post.id, post.title)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 h-9 w-9 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-gray-900 text-white border-gray-700 rounded-lg px-3 py-2 text-sm font-medium shadow-lg"
                          sideOffset={8}
                        >
                          <p>포스트 삭제</p>
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
