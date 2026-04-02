'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PostReactionCounts, ReactionType } from '@/types/notion';
import { ThumbsUp, ThumbsDown, Heart, X } from 'lucide-react';
import { collectReactionEvent, collectClickEvent } from '@/lib/analytics';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface ReactionButtonsProps {
  postId: string;
}

export function ReactionButtons({ postId }: ReactionButtonsProps) {
  const [reactions, setReactions] = useState<PostReactionCounts>({
    like: 0,
    dislike: 0,
    recommend: 0,
    notRecommend: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { isAuthenticated, user } = useAuth();

  const fetchReactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reactions?postId=${postId}`);
      
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
  }, [postId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReaction = async (reactionType: ReactionType) => {
    if (submitting) return;

    try {
      setSubmitting(true);
      
      // 클릭 이벤트 수집
      collectClickEvent(`${reactionType} 버튼`);
      
      // 이미 같은 반응이면 삭제, 아니면 생성/업데이트
      if (reactions.userReaction === reactionType) {
        const response = await fetch(`/api/reactions?postId=${postId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setReactions(data);
        }
      } else {
        const response = await fetch('/api/reactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            postId,
            reactionType,
            isAuthenticated,
            userId: isAuthenticated ? user?.id : undefined,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setReactions(data);
          
          // 반응 이벤트 수집
          collectReactionEvent(reactionType);
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 animate-pulse">
        <div className="h-8 w-16 bg-stone-200 dark:bg-slate-700 rounded"></div>
        <div className="h-8 w-16 bg-stone-200 dark:bg-slate-700 rounded"></div>
        <div className="h-8 w-20 bg-stone-200 dark:bg-slate-700 rounded"></div>
        <div className="h-8 w-20 bg-stone-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 회원가입 혜택 안내 */}
      {!isAuthenticated && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-700 dark:text-green-300">
              익명으로도 반응을 남길 수 있습니다
            </span>
          </div>
          <Link href="/auth/register">
            <Button
              variant="outline"
              size="sm"
              className="text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-900/30"
            >
              회원가입하고 더 많은 혜택 받기
            </Button>
          </Link>
        </div>
      )}

      {/* 반응 버튼들 */}
      <div className="flex flex-wrap gap-2">
        {/* 좋아요/싫어요 */}
        <div className="flex gap-1">
              <Button
                variant={reactions.userReaction === 'like' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleReaction('like')}
                disabled={submitting}
                className={`transition-all duration-200 ${
                  reactions.userReaction === 'like'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                    : 'border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                좋아요 {reactions.like > 0 && `(${reactions.like})`}
              </Button>
          
          <Button
            variant={reactions.userReaction === 'dislike' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleReaction('dislike')}
            disabled={submitting}
            className={`transition-all duration-200 ${
              reactions.userReaction === 'dislike'
                ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                : 'border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300'
            }`}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            싫어요 {reactions.dislike > 0 && `(${reactions.dislike})`}
          </Button>
        </div>

        {/* 추천/비추천 */}
        <div className="flex gap-1">
          <Button
            variant={reactions.userReaction === 'recommend' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleReaction('recommend')}
            disabled={submitting}
            className={`transition-all duration-200 ${
              reactions.userReaction === 'recommend'
                ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                : 'border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300'
            }`}
          >
            <Heart className="h-4 w-4 mr-1" />
            추천 {reactions.recommend > 0 && `(${reactions.recommend})`}
          </Button>
          
          <Button
            variant={reactions.userReaction === 'not_recommend' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleReaction('not_recommend')}
            disabled={submitting}
            className={`transition-all duration-200 ${
              reactions.userReaction === 'not_recommend'
                ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500'
                : 'border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300'
            }`}
          >
            <X className="h-4 w-4 mr-1" />
            비추천 {reactions.notRecommend > 0 && `(${reactions.notRecommend})`}
          </Button>
        </div>
      </div>

    </div>
  );
}
