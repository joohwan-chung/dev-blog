'use client';

import { useMemo } from 'react';
import type { NotionBlock } from '@/types/notion';
import { getHeadingsFromBlocks, NotionBlocks } from '@/components/blog/notion-blocks';
import { ScrollSpyContext, useScrollSpy } from '@/lib/scroll-spy-context';

const PROSE_CLASSNAME =
  'prose prose-stone dark:prose-invert max-w-none prose-headings:text-stone-900 dark:prose-headings:text-slate-100 prose-p:text-stone-700 dark:prose-p:text-slate-200 prose-strong:text-stone-900 dark:prose-strong:text-slate-100 prose-em:text-stone-700 dark:prose-em:text-slate-300 prose-code:text-stone-800 dark:prose-code:text-slate-200 prose-code:bg-stone-100 dark:prose-code:bg-slate-700 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:hover:text-blue-800 dark:prose-a:hover:text-blue-300 prose-blockquote:text-stone-600 dark:prose-blockquote:text-slate-300 prose-blockquote:border-stone-300 dark:prose-blockquote:border-slate-600 prose-blockquote:bg-stone-50 dark:prose-blockquote:bg-slate-800 prose-li:text-stone-700 dark:prose-li:text-slate-200 prose-hr:border-stone-200 dark:prose-hr:border-slate-700 prose-table:border-stone-200 dark:prose-table:border-slate-700 prose-th:text-stone-900 dark:prose-th:text-slate-100 prose-td:text-stone-700 dark:prose-td:text-slate-200 prose-img:rounded-lg prose-img:border prose-img:border-stone-200 dark:prose-img:border-slate-700 prose-p:leading-relaxed prose-p:mb-6 prose-headings:mb-6 prose-headings:mt-8 prose-ul:mb-6 prose-ol:mb-6 prose-blockquote:my-8 prose-code:my-4';

interface ArticleBodyWithSpyProps {
  blocks: NotionBlock[];
}

export function ArticleBodyWithSpy({ blocks }: ArticleBodyWithSpyProps) {
  const headingIds = useMemo(
    () => getHeadingsFromBlocks(blocks).map((h) => h.id),
    [blocks]
  );
  const activeId = useScrollSpy(headingIds);

  return (
    <ScrollSpyContext.Provider value={activeId}>
      <div className={PROSE_CLASSNAME}>
        <NotionBlocks blocks={blocks} />
      </div>
    </ScrollSpyContext.Provider>
  );
}
