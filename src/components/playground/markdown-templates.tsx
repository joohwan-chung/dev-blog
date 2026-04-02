'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  FileText,
  Eye,
  Copy,
  Download,
  ArrowLeft,
  ExternalLink,
  Code
} from 'lucide-react';
import { markdownTemplates, MarkdownTemplate } from '@/lib/markdown-templates';
import { collectEvent } from '@/lib/analytics';
import Link from 'next/link';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';

export function MarkdownTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<MarkdownTemplate | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    collectEvent({
      type: 'user_visit',
      description: '마크다운 템플릿 페이지 방문',
      page: '/playground/markdown/templates',
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });
  }, []);

  const handleTemplateSelect = (template: MarkdownTemplate) => {
    setSelectedTemplate(template);
    collectEvent({
      type: 'click',
      description: `마크다운 템플릿 선택: ${template.name}`,
      page: '/playground/markdown/templates'
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    collectEvent({
      type: 'click',
      description: '마크다운 템플릿 코드 복사',
      page: '/playground/markdown/templates'
    });
  };

  const handleDownloadCode = (template: MarkdownTemplate) => {
    const blob = new Blob([template.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    collectEvent({
      type: 'click',
      description: `마크다운 템플릿 다운로드: ${template.name}`,
      page: '/playground/markdown/templates'
    });
  };

  const handleUseInPlayground = (template: MarkdownTemplate) => {
    // 템플릿 ID만 전달
    const url = `/playground/markdown?template=${template.id}`;
    
    window.open(url, '_blank');
    collectEvent({
      type: 'click',
      description: `마크다운 템플릿 플레이그라운드에서 사용: ${template.name}`,
      page: '/playground/markdown/templates'
    });
  };

  const getTemplateIcon = (templateName: string) => {
    if (templateName.includes('블로그')) return <FileText className="h-4 w-4" />;
    if (templateName.includes('문서')) return <Code className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  if (selectedTemplate) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="container mx-auto">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2 min-h-[44px]"
                  onClick={() => setSelectedTemplate(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>템플릿 목록</span>
                </Button>
                <div className="flex items-center space-x-2">
                  {getTemplateIcon(selectedTemplate.name)}
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedTemplate.name}
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(selectedTemplate.markdown)}
                  className="flex items-center space-x-1 min-h-[44px]"
                >
                  <Copy className="h-4 w-4" />
                  <span>복사</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadCode(selectedTemplate)}
                  className="flex items-center space-x-1 min-h-[44px]"
                >
                  <Download className="h-4 w-4" />
                  <span>다운로드</span>
                </Button>
                <Button
                  onClick={() => handleUseInPlayground(selectedTemplate)}
                  className="flex items-center space-x-1 min-h-[44px]"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>플레이그라운드에서 사용</span>
                </Button>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2 min-h-[44px]"
                  onClick={() => setSelectedTemplate(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>목록</span>
                </Button>
                <div className="flex items-center space-x-2">
                  {getTemplateIcon(selectedTemplate.name)}
                  <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedTemplate.name}
                  </h1>
                </div>
              </div>
              
              {/* Mobile Action Buttons */}
              <div className="flex items-center space-x-2 overflow-x-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(selectedTemplate.markdown)}
                  className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]"
                >
                  <Copy className="h-4 w-4" />
                  <span>복사</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadCode(selectedTemplate)}
                  className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]"
                >
                  <Download className="h-4 w-4" />
                  <span>다운로드</span>
                </Button>
                <Button
                  onClick={() => handleUseInPlayground(selectedTemplate)}
                  className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>사용하기</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Code Panel */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">마크다운 코드</span>
              </div>
              
              <Card className="p-4">
                <pre className="text-sm font-mono text-slate-900 dark:text-slate-100 overflow-x-auto whitespace-pre-wrap max-h-96 md:max-h-none overflow-y-auto">
                  <code>
                    {selectedTemplate.markdown}
                  </code>
                </pre>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">미리보기</span>
              </div>
              
              <Card className="p-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                  <div className="h-64 md:h-96 overflow-y-auto p-4 prose prose-slate dark:prose-invert max-w-none">
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
                      {selectedTemplate.markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="container mx-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/playground/markdown">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 min-h-[44px]">
                  <ArrowLeft className="h-4 w-4" />
                  <span>플레이그라운드</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  마크다운 템플릿
                </h1>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                {markdownTemplates.length}개 템플릿
              </Badge>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center justify-between">
              <Link href="/playground/markdown">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 min-h-[44px]">
                  <ArrowLeft className="h-4 w-4" />
                  <span>플레이그라운드</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  마크다운 템플릿
                </h1>
              </div>
            </div>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                {markdownTemplates.length}개 템플릿
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400 text-center md:text-left">
            다양한 마크다운 템플릿을 확인하고 플레이그라운드에서 사용해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {markdownTemplates.map((template, index) => (
            <Card
              key={index}
              className="p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex-shrink-0">
                    {getTemplateIcon(template.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base truncate">
                      {template.name}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                      Markdown
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Markdown</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 min-h-[44px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateSelect(template);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="text-sm">템플릿 보기</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
