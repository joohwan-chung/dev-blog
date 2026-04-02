'use client';

import Link from 'next/link';
import type { SearchResultItem } from '@/lib/notion-search';
import type { WebSearchResultItem } from './ChatPanel';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  results?: SearchResultItem[];
  webResults?: WebSearchResultItem[];
}

export function ChatMessage({ role, content, results, webResults }: ChatMessageProps) {
  const isUser = role === 'user';
  const hasBlog = !isUser && results && results.length > 0;
  const hasWeb = !isUser && webResults && webResults.length > 0;

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[88%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-[#4b5563] text-white shadow-sm'
            : 'bg-[#454b52] text-white border border-[#525861]'
        )}
      >
        {content && (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-white">
            {content}
          </p>
        )}
        {hasBlog && (
          <div className="mt-3 space-y-2">
            {hasWeb && (
              <p className="text-[12px] font-medium text-[#9ca3af] mb-1.5">
                블로그
              </p>
            )}
            {results!.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="block rounded-xl bg-[#383d42] hover:bg-[#454b52] active:bg-[#4b5258] p-3 text-left transition-colors border border-[#525861] touch-manipulation min-h-[44px]"
              >
                <p className="font-medium text-white text-[14px]">
                  {item.title}
                </p>
                {item.snippet && (
                  <p className="mt-1 text-[13px] text-[#d1d5db] line-clamp-2 leading-relaxed">
                    {item.snippet}
                  </p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#525861] px-2 py-0.5 text-[11px] text-[#d1d5db]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
        {hasWeb && (
          <div className="mt-3 space-y-2">
            <p className="text-[12px] font-medium text-[#9ca3af] mb-1.5">
              인터넷 검색 결과
            </p>
            {webResults!.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-[#383d42] hover:bg-[#454b52] active:bg-[#4b5258] p-3 text-left transition-colors border border-[#525861] touch-manipulation min-h-[44px]"
              >
                <p className="font-medium text-white text-[14px]">
                  {item.title}
                </p>
                {item.snippet && (
                  <p className="mt-1 text-[13px] text-[#d1d5db] line-clamp-2 leading-relaxed">
                    {item.snippet}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
