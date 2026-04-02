'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Code,
  Eye,
  Copy,
  Download,
  ArrowLeft,
  ExternalLink,
  FileText,
  Palette,
  Zap
} from 'lucide-react';
import { webTemplates, WebTemplate } from '@/lib/web-templates';
import { collectEvent } from '@/lib/analytics';
import Link from 'next/link';
import { useEffect } from 'react';

export function WebTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<WebTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    collectEvent({
      type: 'user_visit',
      description: '웹 템플릿 페이지 방문',
      page: '/playground/web/templates',
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });
  }, []);

  const handleTemplateSelect = (template: WebTemplate) => {
    setSelectedTemplate(template);
    collectEvent({
      type: 'click',
      description: `웹 템플릿 선택: ${template.name}`,
      page: '/playground/web/templates'
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    collectEvent({
      type: 'click',
      description: `웹 템플릿 코드 복사 (${activeTab.toUpperCase()})`,
      page: '/playground/web/templates'
    });
  };

  const handleDownloadCode = (template: WebTemplate) => {
    const cssBlob = new Blob([template.css], { type: 'text/css' });
    const htmlBlob = new Blob([template.html], { type: 'text/html' });
    const jsBlob = new Blob([template.js], { type: 'text/javascript' });

    const cssUrl = URL.createObjectURL(cssBlob);
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const jsUrl = URL.createObjectURL(jsBlob);

    const cssLink = document.createElement('a');
    cssLink.href = cssUrl;
    cssLink.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-style.css`;
    cssLink.click();

    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-index.html`;
    htmlLink.click();

    const jsLink = document.createElement('a');
    jsLink.href = jsUrl;
    jsLink.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-script.js`;
    jsLink.click();

    URL.revokeObjectURL(cssUrl);
    URL.revokeObjectURL(htmlUrl);
    URL.revokeObjectURL(jsUrl);

    collectEvent({
      type: 'click',
      description: `웹 템플릿 다운로드: ${template.name}`,
      page: '/playground/web/templates'
    });
  };

  const handleUseInPlayground = (template: WebTemplate) => {
    window.open(`/playground/web?template=${template.id}`, '_blank');
    collectEvent({
      type: 'click',
      description: `웹 템플릿 플레이그라운드에서 사용: ${template.name}`,
      page: '/playground/web/templates'
    });
  };

  const getTemplateIcon = (templateName: string) => {
    if (templateName.includes('애니메이션')) return <Zap className="h-4 w-4" />;
    if (templateName.includes('그리드')) return <Palette className="h-4 w-4" />;
    if (templateName.includes('JavaScript')) return <Code className="h-4 w-4" />;
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
                  onClick={() => handleCopyCode(
                    activeTab === 'html' ? selectedTemplate.html :
                    activeTab === 'css' ? selectedTemplate.css :
                    selectedTemplate.js
                  )}
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
                  onClick={() => handleCopyCode(
                    activeTab === 'html' ? selectedTemplate.html :
                    activeTab === 'css' ? selectedTemplate.css :
                    selectedTemplate.js
                  )}
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
              {/* Code Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('html')}
                  className={`flex-1 px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 min-h-[44px] ${activeTab === 'html'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm border border-orange-200 dark:border-orange-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span>HTML</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('css')}
                  className={`flex-1 px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 min-h-[44px] ${activeTab === 'css'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>CSS</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('js')}
                  className={`flex-1 px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 min-h-[44px] ${activeTab === 'js'
                    ? 'bg-white dark:bg-slate-700 text-yellow-600 dark:text-yellow-400 shadow-sm border border-yellow-200 dark:border-yellow-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span>JS</span>
                  </span>
                </button>
              </div>

              {/* Code Display */}
              <Card className="p-4">
                <pre className="text-sm font-mono text-slate-900 dark:text-slate-100 overflow-x-auto whitespace-pre-wrap max-h-96 md:max-h-none overflow-y-auto">
                  <code>
                    {activeTab === 'html' ? selectedTemplate.html :
                     activeTab === 'css' ? selectedTemplate.css :
                     selectedTemplate.js}
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
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html lang="ko">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${selectedTemplate.name}</title>
                        <style>${selectedTemplate.css}</style>
                      </head>
                      <body>
                        ${selectedTemplate.html}
                        <script>${selectedTemplate.js}</script>
                      </body>
                      </html>
                    `}
                    className="w-full h-64 md:h-96 border-0"
                    sandbox="allow-scripts"
                    title={`${selectedTemplate.name} Preview`}
                  />
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
              <Link href="/playground/web">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 min-h-[44px]">
                  <ArrowLeft className="h-4 w-4" />
                  <span>플레이그라운드</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  웹 템플릿
                </h1>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {webTemplates.length}개 템플릿
              </Badge>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center justify-between">
              <Link href="/playground/web">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 min-h-[44px]">
                  <ArrowLeft className="h-4 w-4" />
                  <span>플레이그라운드</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-blue-600" />
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  웹 템플릿
                </h1>
              </div>
            </div>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {webTemplates.length}개 템플릿
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400 text-center md:text-left">
            다양한 HTML, CSS, JavaScript 템플릿을 확인하고 플레이그라운드에서 사용해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {webTemplates.map((template, index) => (
            <Card
              key={index}
              className="p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                    {getTemplateIcon(template.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base truncate">
                      {template.name}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                      HTML + CSS + JS
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span>HTML</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>CSS</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      <span>JS</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 min-h-[44px]"
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
