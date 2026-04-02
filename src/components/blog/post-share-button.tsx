'use client';

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { trackSocialShare } from '@/lib/analytics';

interface PostShareButtonProps {
  post: { title: string; description: string; id: string };
  baseUrl: string;
}

export function PostShareButton({ post, baseUrl }: PostShareButtonProps) {
  const url = `${baseUrl}/blog/${post.id}`;

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.description || post.title,
          url,
        });
        trackSocialShare('native', post.title);
        toast.success('공유되었습니다.');
      } else {
        await navigator.clipboard.writeText(url);
        trackSocialShare('copy', post.title);
        toast.success('링크가 복사되었습니다.');
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        trackSocialShare('copy', post.title);
        toast.success('링크가 복사되었습니다.');
      } catch {
        toast.error('공유에 실패했습니다.');
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 transition-colors duration-200"
    >
      <Share2 className="h-4 w-4 mr-2" />
      공유하기
    </Button>
  );
}
