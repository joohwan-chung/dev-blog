'use client';

import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/types/notion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CommentItem } from '@/components/blog/comment-item';
import { MessageCircle, Send, User, MessageSquare } from 'lucide-react';
import { collectCommentEvent, collectClickEvent } from '@/lib/analytics';
import { useAuth } from '@/lib/auth-context';
import { getSettingsClient } from '@/lib/settings';
import Link from 'next/link';

interface CommentSectionProps {
  postId: string;
  postAllowComments?: boolean; // 게시글별 댓글 허용 설정
}

export function CommentSection({ postId, postAllowComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showAuthorInput, setShowAuthorInput] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const settings = getSettingsClient();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?postId=${postId}`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        const errorData = await response.json();
        alert(`댓글을 불러오는데 실패했습니다: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('댓글을 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      
      // 댓글 작성 클릭 이벤트 수집
      collectClickEvent('댓글 작성 버튼');
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          postId,
          content: newComment.trim(),
          authorName: isAuthenticated ? user?.name : (showAuthorInput ? authorName.trim() : undefined),
          isAuthenticated,
          userId: isAuthenticated ? user?.id : undefined,
        }),
      });

      if (response.ok) {
        // 댓글 작성 후 목록을 다시 가져와서 최신 상태 반영
        await fetchComments();
        setNewComment('');
        setAuthorName('');
        setShowAuthorInput(false);
        
        // 댓글 작성 이벤트 수집
        collectCommentEvent(`포스트 ID: ${postId}`, 'create');
      } else {
        const error = await response.json();
        alert(`댓글 작성에 실패했습니다: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('댓글 작성에 실패했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, content: string, authorName?: string) => {
    try {
      // 답글 작성 클릭 이벤트 수집
      collectClickEvent('답글 작성 버튼');
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          postId,
          content,
          authorName: isAuthenticated ? user?.name : authorName,
          parentId,
          isAuthenticated,
          userId: isAuthenticated ? user?.id : undefined,
        }),
      });

      if (response.ok) {
        // 댓글 목록을 다시 가져와서 계층 구조를 올바르게 업데이트
        await fetchComments();
        
        // 답글 작성 이벤트 수집
        collectCommentEvent(`포스트 ID: ${postId}`, 'reply');
      } else {
        const error = await response.json();
        alert(`답글 작성에 실패했습니다: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('답글 작성에 실패했습니다. 네트워크 연결을 확인해주세요.');
    }
  };


  // 전체 댓글 개수 계산 (대댓글, 대대댓글 포함)
  const getTotalCommentCount = (comments: Comment[]): number => {
    let count = 0;
    const countComments = (commentList: Comment[]) => {
      commentList.forEach(comment => {
        count++;
        if (comment.replies && comment.replies.length > 0) {
          countComments(comment.replies);
        }
      });
    };
    countComments(comments);
    return count;
  };

  // 댓글이 비활성화된 경우 (사이트 전체 설정 또는 게시글별 설정)
  const isCommentsDisabled = !settings.allowComments || (postAllowComments !== undefined && !postAllowComments);
  
  if (isCommentsDisabled) {
    return (
      <div className="mt-12 text-center py-8">
        <MessageCircle className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
          댓글이 비활성화되어 있습니다
        </h3>
        <p className="text-slate-500 dark:text-slate-500">
          {!settings.allowComments 
            ? '사이트 전체에서 댓글이 비활성화되어 있습니다.'
            : '현재 이 포스트에서는 댓글을 작성할 수 없습니다.'
          }
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-5 w-5 text-stone-600 dark:text-slate-400" />
          <h2 className="text-2xl font-bold text-stone-900 dark:text-slate-100">댓글</h2>
        </div>
        <div className="text-center py-8 text-stone-500 dark:text-slate-400">
          댓글을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="h-5 w-5 text-stone-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-stone-900 dark:text-slate-100">댓글</h2>
        <span className="text-sm text-stone-500 dark:text-slate-400">({getTotalCommentCount(comments)})</span>
      </div>

      {/* 댓글 작성 폼 */}
      <Card className="mb-4 border-stone-200 dark:border-slate-700">
        <CardContent className="p-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                <strong>{user?.name}</strong>으로 댓글을 작성합니다
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  익명으로 댓글을 작성할 수 있습니다
                </span>
              </div>
              <Link href="/auth/register">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-700 border-blue-300 hover:bg-blue-100 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-900/30"
                >
                  회원가입하고 더 많은 혜택 받기
                </Button>
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div>
              <Textarea
                placeholder="댓글을 입력해주세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none border-stone-200 dark:border-slate-600 focus:border-stone-400 dark:focus:border-slate-400"
                disabled={submitting}
              />
            </div>

            {!isAuthenticated && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="showAuthor"
                    checked={showAuthorInput}
                    onChange={(e) => setShowAuthorInput(e.target.checked)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="showAuthor"
                    className="flex items-center justify-center w-5 h-5 border-2 border-stone-300 dark:border-slate-600 rounded-md cursor-pointer transition-all duration-200 hover:border-stone-400 dark:hover:border-slate-500 focus-within:ring-2 focus-within:ring-stone-200 dark:focus-within:ring-slate-700 focus-within:ring-offset-2"
                  >
                    {showAuthorInput && (
                      <svg
                        className="w-3 h-3 text-stone-700 dark:text-slate-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </label>
                </div>
                <label htmlFor="showAuthor" className="text-sm text-stone-600 dark:text-slate-400 cursor-pointer select-none">
                  이름을 표시하고 싶어요
                </label>
              </div>
            )}

            {showAuthorInput && !isAuthenticated && (
              <div>
                <Input
                  placeholder="이름을 입력해주세요 (선택사항)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="border-stone-200 dark:border-slate-600 focus:border-stone-400 dark:focus:border-slate-400"
                  disabled={submitting}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-stone-800 dark:hover:bg-slate-200 transition-colors duration-200"
              >
                {submitting ? (
                  '작성 중...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    댓글 작성
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 댓글 목록 */}
      <div className="space-y-2">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-stone-500 dark:text-slate-400">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </div>
        ) : (
          <div className="space-y-2">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onReply={handleReply}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
