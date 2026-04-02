'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RotateCcw,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Code,
  Eye,
  FileText,
  GripHorizontal,
  ExternalLink
} from 'lucide-react';
import { collectEvent } from '@/lib/analytics';
import { markdownTemplates } from '@/lib/markdown-templates';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import 'highlight.js/styles/github.css';

// 빈 기본 마크다운
const emptyMarkdown = `# 마크다운 플레이그라운드

안녕하세요! 마크다운 플레이그라운드에 오신 것을 환영합니다.

## 사용법

여기에 마크다운 문법을 사용하여 문서를 작성해보세요.

### 예시

- **굵은 글씨**
- *기울임체*
- \`인라인 코드\`

\`\`\`javascript
console.log('Hello, Markdown!');
\`\`\`

> 이것은 인용문입니다.

[링크 예시](https://example.com)`;

export function MarkdownPlayground() {
  const searchParams = useSearchParams();
  const [markdownCode, setMarkdownCode] = useState(emptyMarkdown);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<'code' | 'preview'>('code');
  const [panelHeight, setPanelHeight] = useState(60); // 상단 패널 높이 비율 (60%)
  const [templateLoadError, setTemplateLoadError] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    collectEvent({
      type: 'user_visit',
      description: '마크다운 플레이그라운드 방문',
      page: '/playground/markdown',
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });
  }, []);

  // URL 파라미터에서 템플릿 로드
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = markdownTemplates.find(t => t.id === templateId);
      if (template) {
        setMarkdownCode(template.markdown);
        setTemplateLoadError(null);
        
        // 템플릿 로드 이벤트 수집
        collectEvent({
          type: 'click',
          description: `마크다운 템플릿 로드: ${template.name}`,
          page: '/playground/markdown'
        });
      } else {
        setTemplateLoadError(`템플릿을 찾을 수 없습니다: ${templateId}`);
      }
    } else {
      setTemplateLoadError(null);
    }
  }, [searchParams]);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      const wasDesktop = !isMobile && isMobileDevice;
      setIsMobile(isMobileDevice);

      // 데스크톱에서 모바일로 전환될 때만 미리보기 패널을 활성화
      if (wasDesktop && isMobileDevice) {
        setActivePanel('preview');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  const handleReset = () => {
    setMarkdownCode(emptyMarkdown);
    setTemplateLoadError(null);
    collectEvent({
      type: 'click',
      description: '마크다운 플레이그라운드 초기화',
      page: '/playground/markdown'
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(markdownCode);
    collectEvent({
      type: 'click',
      description: '마크다운 플레이그라운드 코드 복사',
      page: '/playground/markdown'
    });
  };

  const handleDownloadCode = () => {
    const blob = new Blob([markdownCode], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'markdown.md';
    link.click();
    URL.revokeObjectURL(url);
    collectEvent({
      type: 'click',
      description: '마크다운 플레이그라운드 코드 다운로드',
      page: '/playground/markdown'
    });
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-slate-50 dark:bg-slate-900`}>
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 md:p-4">
        <div className="container mx-auto">

          {/* Template Load Error Alert */}
          {templateLoadError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-sm text-red-700 dark:text-red-300">
                  {templateLoadError}
                </span>
                <Link href="/playground/markdown/templates">
                  <Button variant="outline" size="sm" className="ml-auto text-xs">
                    템플릿 목록 보기
                  </Button>
                </Link>
              </div>
            </div>
          )}
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  마크다운 플레이그라운드
                </h1>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                Markdown
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/playground/markdown/templates">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>템플릿</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-1"
              >
                <RotateCcw className="h-4 w-4" />
                <span>초기화</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center space-x-1"
              >
                <Copy className="h-4 w-4" />
                <span>복사</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCode}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>다운로드</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center space-x-1"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                <span>{isFullscreen ? '축소' : '확대'}</span>
              </Button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  마크다운 플레이그라운드
                </h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center space-x-1 min-h-[44px] min-w-[44px]"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>

            {/* Mobile Panel Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 mb-4">
              <button
                onClick={() => setActivePanel('code')}
                className={`flex-1 py-3 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] ${activePanel === 'code'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                aria-pressed={activePanel === 'code'}
                aria-label="코드 편집기로 전환"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>코드</span>
                </div>
              </button>
              <button
                onClick={() => setActivePanel('preview')}
                className={`flex-1 py-3 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] ${activePanel === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                aria-pressed={activePanel === 'preview'}
                aria-label="미리보기로 전환"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>미리보기</span>
                </div>
              </button>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Link href="/playground/markdown/templates">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>템플릿</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>초기화</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]"
              >
                <Copy className="h-4 w-4" />
                <span>복사</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCode}
                className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]"
              >
                <Download className="h-4 w-4" />
                <span>다운로드</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMobile ? 'flex flex-col' : 'flex flex-col'} h-[calc(100vh-120px)] md:h-[calc(100vh-80px)]`}>
        {/* Desktop Layout */}
        {!isMobile && (
          <>
            {/* Top Panel - Code Editor */}
            <div
              className="flex flex-col border-b border-slate-200 dark:border-slate-700"
              style={{ height: `${panelHeight}%` }}
            >
              {/* Code Editor */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg m-2 opacity-50"></div>
                <div className="relative h-full p-4">
                  <div className="h-full bg-slate-900/5 dark:bg-slate-900/20 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                    <textarea
                      value={markdownCode}
                      onChange={(e) => setMarkdownCode(e.target.value)}
                      className="w-full h-full resize-none border-0 outline-none bg-transparent font-mono text-sm leading-relaxed text-slate-900 dark:text-slate-100 p-4 rounded-lg"
                      placeholder="마크다운 코드를 입력하세요..."
                      spellCheck={false}
                      style={{
                        background: 'transparent',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        lineHeight: '1.6',
                        tabSize: 2
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resize Handle */}
            <div
              className="h-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-row-resize flex items-center justify-center group"
              onMouseDown={(e) => {
                e.preventDefault();
                const startY = e.clientY;
                const startHeight = panelHeight;

                const handleMouseMove = (e: MouseEvent) => {
                  const deltaY = e.clientY - startY;
                  const containerHeight = window.innerHeight - 80; // 헤더 높이 제외
                  const deltaPercent = (deltaY / containerHeight) * 100;
                  const newHeight = Math.max(20, Math.min(80, startHeight + deltaPercent));
                  setPanelHeight(newHeight);
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <GripHorizontal className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            </div>

            {/* Bottom Panel - Preview */}
            <div
              className="flex border-t border-slate-200 dark:border-slate-700"
              style={{ height: `${100 - panelHeight}%` }}
            >
              {/* Preview Panel */}
              <div className="flex flex-col flex-1">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">미리보기</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 overflow-y-auto">
                  <div className="h-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                    <div className="h-full overflow-y-auto p-6 prose prose-slate dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[
                          rehypeHighlight,
                          [rehypeKatex, { strict: false }]
                        ]}
                        components={{
                          // 문단 스타일링 추가
                          p({ children }) {
                            return (
                              <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                                {children}
                              </p>
                            );
                          },
                          // 제목 스타일링 개선
                          h1({ children }) {
                            return (
                              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 mt-8 first:mt-0">
                                {children}
                              </h1>
                            );
                          },
                          h2({ children }) {
                            return (
                              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 mt-6">
                                {children}
                              </h2>
                            );
                          },
                          h3({ children }) {
                            return (
                              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3 mt-5">
                                {children}
                              </h3>
                            );
                          },
                          h4({ children }) {
                            return (
                              <h4 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-2 mt-4">
                                {children}
                              </h4>
                            );
                          },
                          // 목록 스타일링 개선
                          ul({ children }) {
                            return (
                              <ul className="mb-4 ml-6 space-y-2">
                                {children}
                              </ul>
                            );
                          },
                          ol({ children }) {
                            return (
                              <ol className="mb-4 ml-6 space-y-2">
                                {children}
                              </ol>
                            );
                          },
                          li({ children }) {
                            return (
                              <li className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {children}
                              </li>
                            );
                          },
                          code(props: { className?: string; children?: React.ReactNode }) {
                            const { className, children } = props;
                            const match = /language-(\w+)/.exec(className || '');
                            const inline = !match;
                            return !inline && match ? (
                              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                          table({ children }) {
                            return (
                              <div className="overflow-x-auto mb-4">
                                <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600">
                                  {children}
                                </table>
                              </div>
                            );
                          },
                          th({ children }) {
                            return (
                              <th className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2 text-left font-semibold">
                                {children}
                              </th>
                            );
                          },
                          td({ children }) {
                            return (
                              <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">
                                {children}
                              </td>
                            );
                          },
                          blockquote({ children }) {
                            return (
                              <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-600 dark:text-slate-400 mb-4">
                                {children}
                              </blockquote>
                            );
                          },
                          hr() {
                            return <hr className="border-slate-300 dark:border-slate-600 my-6" />;
                          },
                          // 강조 텍스트 스타일링
                          strong({ children }) {
                            return (
                              <strong className="font-semibold text-slate-900 dark:text-slate-100">
                                {children}
                              </strong>
                            );
                          },
                          em({ children }) {
                            return (
                              <em className="italic text-slate-700 dark:text-slate-300">
                                {children}
                              </em>
                            );
                          }
                        }}
                      >
                        {markdownCode}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <>
            {/* Code Panel */}
            {activePanel === 'code' && (
              <div className="flex-1 flex flex-col">
                {/* Code Editor */}
                <div className="flex-1 p-3">
                  <div className="h-full bg-slate-900/5 dark:bg-slate-900/20 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                    <textarea
                      value={markdownCode}
                      onChange={(e) => setMarkdownCode(e.target.value)}
                      onBlur={() => {
                        // 모바일에서 코드 입력 완료 시 미리보기로 자동 전환
                        if (isMobile) {
                          setTimeout(() => setActivePanel('preview'), 1000);
                        }
                      }}
                      className="w-full h-full resize-none border-0 outline-none bg-transparent font-mono text-sm leading-relaxed text-slate-900 dark:text-slate-100 p-4 rounded-lg"
                      placeholder="마크다운 코드를 입력하세요..."
                      spellCheck={false}
                      style={{
                        background: 'transparent',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        lineHeight: '1.6',
                        tabSize: 2
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preview Panel */}
            {activePanel === 'preview' && (
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">미리보기</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 overflow-y-auto">
                  <div className="h-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                    <div className="h-full overflow-y-auto p-4 prose prose-slate dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[
                          rehypeHighlight,
                          [rehypeKatex, { strict: false }]
                        ]}
                        components={{
                          // 문단 스타일링 추가
                          p({ children }) {
                            return (
                              <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                                {children}
                              </p>
                            );
                          },
                          // 제목 스타일링 개선
                          h1({ children }) {
                            return (
                              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 mt-6 first:mt-0">
                                {children}
                              </h1>
                            );
                          },
                          h2({ children }) {
                            return (
                              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 mt-5">
                                {children}
                              </h2>
                            );
                          },
                          h3({ children }) {
                            return (
                              <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-2 mt-4">
                                {children}
                              </h3>
                            );
                          },
                          h4({ children }) {
                            return (
                              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 mt-3">
                                {children}
                              </h4>
                            );
                          },
                          // 목록 스타일링 개선
                          ul({ children }) {
                            return (
                              <ul className="mb-4 ml-4 space-y-1">
                                {children}
                              </ul>
                            );
                          },
                          ol({ children }) {
                            return (
                              <ol className="mb-4 ml-4 space-y-1">
                                {children}
                              </ol>
                            );
                          },
                          li({ children }) {
                            return (
                              <li className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                                {children}
                              </li>
                            );
                          },
                          code(props: { className?: string; children?: React.ReactNode }) {
                            const { className, children } = props;
                            const match = /language-(\w+)/.exec(className || '');
                            const inline = !match;
                            return !inline && match ? (
                              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-sm mb-4">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                          table({ children }) {
                            return (
                              <div className="overflow-x-auto mb-4">
                                <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600 text-sm">
                                  {children}
                                </table>
                              </div>
                            );
                          },
                          th({ children }) {
                            return (
                              <th className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-2 py-1 text-left font-semibold text-sm">
                                {children}
                              </th>
                            );
                          },
                          td({ children }) {
                            return (
                              <td className="border border-slate-300 dark:border-slate-600 px-2 py-1 text-sm">
                                {children}
                              </td>
                            );
                          },
                          blockquote({ children }) {
                            return (
                              <blockquote className="border-l-4 border-emerald-500 pl-3 italic text-slate-600 dark:text-slate-400 text-sm mb-4">
                                {children}
                              </blockquote>
                            );
                          },
                          hr() {
                            return <hr className="border-slate-300 dark:border-slate-600 my-4" />;
                          },
                          // 강조 텍스트 스타일링
                          strong({ children }) {
                            return (
                              <strong className="font-semibold text-slate-900 dark:text-slate-100">
                                {children}
                              </strong>
                            );
                          },
                          em({ children }) {
                            return (
                              <em className="italic text-slate-700 dark:text-slate-300">
                                {children}
                              </em>
                            );
                          }
                        }}
                      >
                        {markdownCode}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
