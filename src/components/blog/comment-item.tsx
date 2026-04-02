'use client';

import { useState } from 'react';
import { Comment } from '@/types/notion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Reply, ChevronDown, ChevronRight, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply: (parentId: string, content: string, authorName?: string) => void;
  depth: number;
}

interface ReplyItemProps {
  reply: Comment;
  onReply: (parentId: string, content: string, authorName?: string) => void;
  depth: number;
}

export function CommentItem({ comment, postId, onReply, depth }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState('');
  const [showAuthorInput, setShowAuthorInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const formatDate = (dateString: string) => {
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

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim()) return;

    try {
      setIsSubmitting(true);
      await onReply(comment.id, replyContent.trim(), showAuthorInput ? replyAuthorName.trim() : undefined);
      setReplyContent('');
      setReplyAuthorName('');
      setShowAuthorInput(false);
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canReply = depth < 2; // 3차 댓글까지만 허용
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleReport = async () => {
    if (!reportReason.trim()) return;

    try {
      setIsReporting(true);
      
      const response = await fetch(`/api/comments/${comment.id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: reportReason.trim(),
        }),
      });

      if (response.ok) {
        alert('댓글이 신고되었습니다.');
        setShowReportDialog(false);
        setReportReason('');
      } else {
        const error = await response.json();
        alert(`신고에 실패했습니다: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error reporting comment:', error);
      alert('신고에 실패했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setIsReporting(false);
    }
  };
  

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-stone-200 dark:border-slate-700 pl-4' : ''}`}>
      <Card className={`border-stone-200 dark:border-slate-700 ${depth > 0 ? 'bg-stone-50 dark:bg-slate-800/50' : ''}`}>
        <CardContent className="pt-2 pb-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-stone-200 to-stone-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-stone-600 dark:text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-stone-900 dark:text-slate-100">
                  {comment.isAnonymous ? '익명' : (comment.authorName || '익명')}
                </span>
                <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-slate-400">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                {depth > 0 && (
                  <span className="text-xs px-2 py-1 bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-slate-400 rounded-full">
                    {depth === 1 ? '대댓글' : '대대댓글'}
                  </span>
                )}
              </div>
              <p className="text-stone-700 dark:text-slate-300 whitespace-pre-wrap break-words mb-2">
                {comment.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReplies(!showReplies)}
                      className="text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-700 px-2 py-1 rounded-md transition-all duration-200"
                    >
                      {showReplies ? (
                        <ChevronDown className="h-4 w-4 mr-1" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-1" />
                      )}
                      {comment.replies!.length}개 답글
                    </Button>
                  )}
                </div>
                
                {/* 오른쪽 하단에 답글 버튼과 신고 버튼 */}
                <div className="flex items-center gap-2">
                  {canReply && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      className="text-stone-600 dark:text-slate-400 border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-800 hover:border-stone-300 dark:hover:border-slate-500 px-3 py-1.5 text-xs transition-all duration-200"
                    >
                      <Reply className="h-3.5 w-3.5 mr-1.5" />
                      답글 달기
                    </Button>
                  )}
                  
                  <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-stone-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1.5 text-xs transition-all duration-200"
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>댓글 신고</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            신고 사유를 입력해주세요:
                          </p>
                          <Textarea
                            placeholder="예: 스팸, 부적절한 내용, 욕설 등"
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className="min-h-[100px] resize-none"
                            disabled={isReporting}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowReportDialog(false);
                              setReportReason('');
                            }}
                            disabled={isReporting}
                          >
                            취소
                          </Button>
                          <Button
                            onClick={handleReport}
                            disabled={!reportReason.trim() || isReporting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isReporting ? '신고 중...' : '신고하기'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* 답글 작성 폼 */}
              {showReplyForm && canReply && (
                <div className="mt-4 p-4 bg-stone-50 dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700">
                  <form onSubmit={handleReplySubmit} className="space-y-3">
                    <Textarea
                      placeholder="답글을 입력해주세요..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px] resize-none border-stone-200 dark:border-slate-600 focus:border-stone-400 dark:focus:border-slate-400"
                      disabled={isSubmitting}
                    />
                    
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={`showAuthor-${comment.id}`}
                          checked={showAuthorInput}
                          onChange={(e) => setShowAuthorInput(e.target.checked)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`showAuthor-${comment.id}`}
                          className="flex items-center justify-center w-4 h-4 border-2 border-stone-300 dark:border-slate-600 rounded cursor-pointer transition-all duration-200 hover:border-stone-400 dark:hover:border-slate-500"
                        >
                          {showAuthorInput && (
                            <svg
                              className="w-2.5 h-2.5 text-stone-700 dark:text-slate-300"
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
                      <label htmlFor={`showAuthor-${comment.id}`} className="text-xs text-stone-600 dark:text-slate-400 cursor-pointer select-none">
                        이름 표시
                      </label>
                    </div>

                    {showAuthorInput && (
                      <Input
                        placeholder="이름을 입력해주세요 (선택사항)"
                        value={replyAuthorName}
                        onChange={(e) => setReplyAuthorName(e.target.value)}
                        className="border-stone-200 dark:border-slate-600 focus:border-stone-400 dark:focus:border-slate-400"
                        disabled={isSubmitting}
                      />
                    )}

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyContent('');
                          setReplyAuthorName('');
                          setShowAuthorInput(false);
                        }}
                        disabled={isSubmitting}
                      >
                        취소
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!replyContent.trim() || isSubmitting}
                        className="bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-stone-800 dark:hover:bg-slate-200"
                      >
                        {isSubmitting ? '작성 중...' : '답글 작성'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 하위 댓글들 */}
      {hasReplies && showReplies && (
        <div className="mt-2 space-y-2">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ReplyItem({ reply, onReply, depth }: ReplyItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState('');
  const [showAuthorInput, setShowAuthorInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
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

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim()) return;

    try {
      setIsSubmitting(true);
      await onReply(reply.id, replyContent.trim(), showAuthorInput ? replyAuthorName.trim() : undefined);
      setReplyContent('');
      setReplyAuthorName('');
      setShowAuthorInput(false);
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canReply = depth < 2; // 3차 댓글까지만 허용

  return (
    <div className="bg-stone-50 dark:bg-slate-800/30 rounded-lg p-3 border border-stone-200 dark:border-slate-700">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-gradient-to-br from-stone-200 to-stone-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-3 w-3 text-stone-600 dark:text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-stone-900 dark:text-slate-100">
              {reply.isAnonymous ? '익명' : (reply.authorName || '익명')}
            </span>
            <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-slate-400">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(reply.createdAt)}</span>
            </div>
          </div>
          <p className="text-sm text-stone-700 dark:text-slate-300 whitespace-pre-wrap break-words mb-2">
            {reply.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div></div>
            {canReply && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-stone-600 dark:text-slate-400 border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-800 hover:border-stone-300 dark:hover:border-slate-500 px-2 py-1 text-xs transition-all duration-200"
              >
                <Reply className="h-3 w-3 mr-1" />
                답글 달기
              </Button>
            )}
          </div>

          {/* 답글 작성 폼 */}
          {showReplyForm && canReply && (
            <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-stone-200 dark:border-slate-700">
              <form onSubmit={handleReplySubmit} className="space-y-2">
                <Textarea
                  placeholder="답글을 입력해주세요..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px] resize-none border-stone-200 dark:border-slate-600 focus:border-stone-400 dark:focus:border-slate-400 text-sm"
                  disabled={isSubmitting}
                />
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`showAuthor-reply-${reply.id}`}
                      checked={showAuthorInput}
                      onChange={(e) => setShowAuthorInput(e.target.checked)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`showAuthor-reply-${reply.id}`}
                      className="flex items-center justify-center w-3 h-3 border-2 border-stone-300 dark:border-slate-600 rounded cursor-pointer transition-all duration-200 hover:border-stone-400 dark:hover:border-slate-500"
                    >
                      {showAuthorInput && (
                        <svg
                          className="w-2 h-2 text-stone-700 dark:text-slate-300"
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
                  <label htmlFor={`showAuthor-reply-${reply.id}`} className="text-xs text-stone-600 dark:text-slate-400 cursor-pointer select-none">
                    이름 표시
                  </label>
                </div>

                {showAuthorInput && (
                  <Input
                    placeholder="이름을 입력해주세요 (선택사항)"
                    value={replyAuthorName}
                    onChange={(e) => setReplyAuthorName(e.target.value)}
                    className="border-stone-200 dark:border-slate-600 focus:border-stone-400 dark:focus:border-slate-400 text-sm"
                    disabled={isSubmitting}
                  />
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent('');
                      setReplyAuthorName('');
                      setShowAuthorInput(false);
                    }}
                    disabled={isSubmitting}
                    className="text-xs"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!replyContent.trim() || isSubmitting}
                    className="bg-stone-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-stone-800 dark:hover:bg-slate-200 text-xs"
                  >
                    {isSubmitting ? '작성 중...' : '답글 작성'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
