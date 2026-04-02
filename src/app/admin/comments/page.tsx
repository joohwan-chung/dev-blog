'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Trash2, 
  User,
  Calendar,
  ExternalLink,
  Flag,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  postId: string;
  postTitle: string;
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  authorName: string;
  parentId?: string;
  depth: number;
  hidden: boolean;
  reportCount?: number;
  lastReportReason?: string;
  lastReportedAt?: string;
  reportedBy?: string[];
  reportReasons?: string[];
}

interface CommentsResponse {
  comments: Comment[];
  nextCursor?: string;
  hasMore: boolean;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<'all' | 'hidden' | 'reported'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchComments = async (cursor?: string, reset = false) => {
    try {
      const params = new URLSearchParams({
        pageSize: '20',
        ...(cursor && { startCursor: cursor }),
      });

      const response = await fetch(`/api/admin/comments?${params}`);
      if (!response.ok) {
        throw new Error('댓글을 불러오는데 실패했습니다.');
      }

      const data: CommentsResponse = await response.json();
      
      if (reset) {
        setComments(data.comments);
      } else {
        setComments(prev => [...prev, ...data.comments]);
      }
      
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(undefined, true);
  }, []);

  const handleUpdateComment = async (commentId: string, updates: { hidden?: boolean }) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('댓글 상태 변경에 실패했습니다.');
      }

      // 로컬 상태 업데이트
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, ...updates }
            : comment
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('댓글 삭제에 실패했습니다.');
      }

      // 로컬 상태에서 제거
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const filteredComments = comments.filter(comment => {
    // 검색 필터
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        comment.content.toLowerCase().includes(searchLower) ||
        comment.authorName.toLowerCase().includes(searchLower) ||
        comment.postTitle.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // 상태 필터
    switch (filter) {
      case 'hidden':
        return comment.hidden;
      case 'reported':
        return (comment.reportCount || 0) > 0;
      default:
        return true;
    }
  });

  const getStatusBadges = (hidden: boolean, reportCount?: number) => {
    return (
      <div className="flex gap-1 ml-2">
        {hidden && (
          <Badge variant="destructive">
            숨김
          </Badge>
        )}
        {(reportCount || 0) > 0 && (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <Flag className="h-3 w-3 mr-1" />
            신고 {reportCount}
          </Badge>
        )}
      </div>
    );
  };

  const getDepthIndicator = (depth: number) => {
    return depth > 0 ? (
      <span className="text-gray-400 text-sm ml-2">
        {'└ '.repeat(depth)}↳ 답글
      </span>
    ) : null;
  };

  if (loading && comments.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">댓글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            댓글 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            블로그 댓글을 관리하고 승인하세요
          </p>
        </div>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="댓글 내용, 작성자, 포스트 제목으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* 필터 버튼 */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          전체 ({comments.length})
        </Button>
        <Button
          variant={filter === 'hidden' ? 'default' : 'outline'}
          onClick={() => setFilter('hidden')}
          size="sm"
        >
          숨김됨 ({comments.filter(c => c.hidden).length})
        </Button>
        <Button
          variant={filter === 'reported' ? 'default' : 'outline'}
          onClick={() => setFilter('reported')}
          size="sm"
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          <Flag className="h-4 w-4 mr-1" />
          신고됨 ({comments.filter(c => (c.reportCount || 0) > 0).length})
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <Card key={comment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">
                      {comment.isAnonymous ? '익명' : comment.authorName}
                    </span>
                    {getStatusBadges(comment.hidden, comment.reportCount)}
                    {getDepthIndicator(comment.depth)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(comment.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                    </div>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate max-w-xs">{comment.postTitle}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={comment.hidden ? "default" : "outline"}
                    onClick={() => handleUpdateComment(comment.id, { hidden: !comment.hidden })}
                    className={comment.hidden ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
                  >
                    {comment.hidden ? '표시' : '숨김'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Separator className="mb-3" />
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>
              
              {/* 신고 정보 표시 */}
              {(comment.reportCount || 0) > 0 && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">
                      신고 정보 ({comment.reportCount}회 신고됨)
                    </span>
                  </div>
                  
                  {/* 모든 신고 사유 표시 */}
                  {comment.reportReasons && comment.reportReasons.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-2">
                        <strong>모든 신고 사유:</strong>
                      </p>
                      <div className="space-y-2">
                        {comment.reportReasons.map((reason, index) => {
                          // 시간과 사유를 분리
                          const [timestamp, ...reasonParts] = reason.split(' - ');
                          const reasonText = reasonParts.join(' - ');
                          return (
                            <div key={index} className="bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded text-xs">
                              <div className="flex items-start gap-2">
                                <span className="text-red-500 font-mono text-xs whitespace-nowrap">
                                  #{index + 1}
                                </span>
                                <div className="flex-1">
                                  <div className="text-red-600 dark:text-red-400 font-medium mb-1">
                                    {format(new Date(timestamp), 'MM/dd HH:mm', { locale: ko })}
                                  </div>
                                  <div className="text-red-700 dark:text-red-300">
                                    {reasonText}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* 마지막 신고 정보 (기존 호환성 유지) */}
                  {comment.lastReportReason && (
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                      <strong>마지막 신고 사유:</strong> {comment.lastReportReason}
                    </p>
                  )}
                  {comment.lastReportedAt && (
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                      <strong>마지막 신고 시간:</strong> {format(new Date(comment.lastReportedAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                    </p>
                  )}
                  
                  {/* 신고자 목록 */}
                  {comment.reportedBy && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      <strong>신고자 목록:</strong>
                      <div className="mt-1 space-y-1">
                        {comment.reportedBy.map((reporter, index) => (
                          <div key={index} className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-xs">
                            {reporter.includes('_') ? (
                              <span>
                                IP: {reporter.split('_')[0]} | 
                                브라우저: {reporter.split('_')[1]} | 
                                언어: {reporter.split('_')[2]} | 
                                지역: {reporter.split('_')[3]}
                              </span>
                            ) : (
                              reporter
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => fetchComments(nextCursor)}
            disabled={loading}
          >
            {loading ? '로딩 중...' : '더 보기'}
          </Button>
        </div>
      )}

      {filteredComments.length === 0 && !loading && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === 'all' 
              ? '댓글이 없습니다.' 
              : filter === 'hidden' 
                ? '숨김 처리된 댓글이 없습니다.'
                : filter === 'reported'
                ? '신고된 댓글이 없습니다.'
                : '댓글이 없습니다.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
