'use client';

import { Button } from '@/components/ui/button';

const COMMENTS_SECTION_ID = 'comments-section';

export function CommentScrollButton() {
  const handleClick = () => {
    document.getElementById(COMMENTS_SECTION_ID)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 transition-colors duration-200"
    >
      💬 댓글
    </Button>
  );
}
