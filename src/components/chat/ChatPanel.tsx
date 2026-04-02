'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Search, FileText, Zap, PlusCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import type { SearchResultItem } from '@/lib/notion-search';
import { cn } from '@/lib/utils';

export interface WebSearchResultItem {
  title: string;
  url: string;
  snippet: string;
}

export interface ChatMessageEntry {
  role: 'user' | 'assistant';
  content: string;
  results?: SearchResultItem[];
  webResults?: WebSearchResultItem[];
}

const SUGGESTIONS = [
  { label: '최근 포스트 보기', icon: FileText, query: '' },
  { label: 'React 관련 글 찾기', icon: Search, query: 'React' },
  { label: '성능 최적화 글 검색', icon: Zap, query: '성능 최적화' },
] as const;

interface ChatPanelProps {
  onClose: () => void;
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageEntry[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const runSearch = async (apiQuery: string, displayMessage?: string) => {
    const q = apiQuery.trim();
    const display = displayMessage?.trim() || q || '검색';

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: display },
    ]);
    setInput('');
    setLoading(true);

    try {
      const blogUrl = q ? `/api/blog/search?q=${encodeURIComponent(q)}` : '/api/blog/search';
      const webUrl = q ? `/api/search/web?q=${encodeURIComponent(q)}` : null;

      const [blogRes, webRes] = await Promise.all([
        fetch(blogUrl),
        webUrl ? fetch(webUrl) : Promise.resolve(null),
      ]);

      if (!blogRes.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '검색 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.',
          },
        ]);
        return;
      }

      const blogData = await blogRes.json();
      const results: SearchResultItem[] = blogData.results ?? [];

      let webResults: WebSearchResultItem[] = [];
      if (webRes?.ok) {
        const webData = await webRes.json();
        webResults = webData.results ?? [];
      }

      const totalCount = results.length + webResults.length;
      const parts: string[] = [];
      if (results.length > 0) parts.push(`블로그 ${results.length}건`);
      if (webResults.length > 0) parts.push(`인터넷 ${webResults.length}건`);
      const summary = parts.length > 0 ? parts.join(', ') : '없어요';

      const replyText =
        totalCount > 0
          ? q
            ? `"${display}"에 대한 검색 결과: ${summary}.`
            : `최근 포스트 ${results.length}건이에요.`
          : `"${display}"에 맞는 글이 없어요. 다른 키워드로 검색해 보세요.`;

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: replyText, results, webResults },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '검색 요청에 실패했어요. 네트워크를 확인한 뒤 다시 시도해 주세요.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    runSearch(trimmed);
  };

  const handleSuggestion = (label: string, query: string) => {
    runSearch(query, label);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className={cn(
        'flex flex-col w-full overflow-hidden bg-[#2f3437] shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#373c3f]',
        'h-[95dvh] max-h-[95dvh] rounded-t-2xl border-b-0',
        'md:h-[80vh] md:max-h-[600px] md:max-w-[400px] md:rounded-[20px] md:border-b md:border-[#373c3f]'
      )}
      role="dialog"
      aria-label="블로그 검색 챗봇"
    >
      {/* Header - Notion AI style + safe area */}
      <div className="flex items-center justify-between shrink-0 px-4 py-3 bg-[#2f3437] border-b border-[#373c3f] pt-[env(safe-area-inset-top)] md:pt-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-medium text-white tracking-tight">
            블로그 검색
          </h2>
          <button
            type="button"
            onClick={handleNewChat}
            className="rounded-md p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#d1d5db] hover:text-white hover:bg-[#40454a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6b7280] md:p-1.5 md:min-w-0 md:min-h-0"
            aria-label="새 채팅"
            title="새 채팅"
          >
            <PlusCircle className="size-4" strokeWidth={2} />
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#d1d5db] hover:text-white hover:bg-[#40454a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6b7280] md:p-1.5 md:min-w-0 md:min-h-0"
          aria-label="챗봇 닫기"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>

      {/* Messages + suggestions - 터치 스크롤 개선 */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 space-y-5 min-h-0 text-[15px] overscroll-contain touch-pan-y"
      >
        {isEmpty && (
          <div className="space-y-5">
            {/* Greeting - 모바일 가독성 */}
            <div className="flex gap-3">
              <div className="shrink-0 flex size-8 items-center justify-center rounded-full bg-[#40454a] text-white">
                <Search className="size-4" strokeWidth={2} />
              </div>
              <div className="pt-0.5 flex-1 min-w-0">
                <p className="text-white font-medium leading-snug">
                  무엇을 도와드릴까요?
                </p>
                <p className="mt-1 text-[14px] text-[#d1d5db] leading-relaxed">
                  블로그 글을 검색해 드려요. 키워드나 제안을 눌러 보세요.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {SUGGESTIONS.map(({ label, icon: Icon, query }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleSuggestion(label, query)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3.5 min-h-[48px] text-left text-[14px] text-white bg-[#40454a] hover:bg-[#454b52] active:bg-[#4b5258] border border-[#525861] transition-colors touch-manipulation"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#383d42] text-[#d1d5db]">
                        <Icon className="size-4" />
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            results={msg.results}
            webResults={msg.webResults}
          />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-[#454b52] px-4 py-2.5 border border-[#525861]">
              <Loader2 className="size-4 animate-spin text-white" />
              <span className="text-[14px] text-white">검색 중...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input - safe area 하단 + 모바일 16px로 줌 방지 */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 p-3 pt-2 bg-[#2f3437] border-t border-[#373c3f] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-3"
      >
        <div className="flex items-end gap-2 rounded-2xl bg-[#40454a] border border-[#525861] focus-within:border-[#6b7280] focus-within:ring-1 focus-within:ring-[#6b7280]/50 transition-all px-2 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="블로그에서 검색해 보세요..."
            className={cn(
              'flex-1 min-w-0 bg-transparent px-3 py-2.5 text-base md:text-[15px] text-white placeholder:text-[#9ca3af] outline-none rounded-xl'
            )}
            disabled={loading}
            aria-label="검색어 입력"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 flex size-10 min-h-[44px] items-center justify-center rounded-xl text-[#d1d5db] hover:text-white hover:bg-[#454b52] disabled:opacity-50 disabled:pointer-events-none transition-colors touch-manipulation md:size-9 md:min-h-0"
            aria-label="검색 전송"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
