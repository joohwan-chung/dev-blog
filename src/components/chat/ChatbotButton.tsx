'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { cn } from '@/lib/utils';

export function ChatbotButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'fixed z-50 flex size-14 items-center justify-center rounded-full cursor-pointer',
          'right-4 sm:right-6 bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6',
          'bg-[#e5e7eb] dark:bg-[#40454a] border-2 border-[#d1d5db] dark:border-[#525861] text-[#1f2937] dark:text-white',
          'shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:bg-[#d1d5db] dark:hover:bg-[#454b52] hover:border-[#9ca3af] dark:hover:border-[#6b7280] transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6b7280] focus-visible:ring-offset-2'
        )}
        aria-label={open ? '챗봇 닫기' : '블로그 검색 챗봇 열기'}
        aria-expanded={open}
      >
        <MessageCircle className="size-6" strokeWidth={2} />
      </button>

      {open && (
        <>
          {/* 모바일: 백드롭 탭 시 닫기 */}
          <button
            type="button"
            aria-label="챗봇 닫기 (배경)"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              'fixed z-50 flex flex-col',
              'inset-x-0 bottom-0 top-auto max-h-[95dvh] md:inset-auto md:bottom-24 md:right-6 md:max-h-[600px] md:items-end'
            )}
            role="presentation"
          >
            <ChatPanel onClose={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
