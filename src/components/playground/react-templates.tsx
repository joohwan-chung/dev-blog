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
  Zap as ReactIcon
} from 'lucide-react';
import { reactTemplates, ReactTemplate } from '@/lib/react-templates';
import { collectEvent } from '@/lib/analytics';
import Link from 'next/link';
import { useEffect } from 'react';

export function ReactTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReactTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<'jsx' | 'css'>('jsx');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    collectEvent({
      type: 'user_visit',
      description: 'React 템플릿 페이지 방문',
      page: '/playground/react/templates',
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });
  }, []);

  const handleTemplateSelect = (template: ReactTemplate) => {
    setSelectedTemplate(template);
    collectEvent({
      type: 'click',
      description: `React 템플릿 선택: ${template.name}`,
      page: '/playground/react/templates'
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    collectEvent({
      type: 'click',
      description: `React 템플릿 코드 복사 (${activeTab.toUpperCase()})`,
      page: '/playground/react/templates'
    });
  };

  const handleDownloadCode = (template: ReactTemplate) => {
    const cssBlob = new Blob([template.css], { type: 'text/css' });
    const jsxBlob = new Blob([template.jsx], { type: 'text/javascript' });

    const cssUrl = URL.createObjectURL(cssBlob);
    const jsxUrl = URL.createObjectURL(jsxBlob);

    const cssLink = document.createElement('a');
    cssLink.href = cssUrl;
    cssLink.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-style.css`;
    cssLink.click();

    const jsxLink = document.createElement('a');
    jsxLink.href = jsxUrl;
    jsxLink.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-App.jsx`;
    jsxLink.click();

    URL.revokeObjectURL(cssUrl);
    URL.revokeObjectURL(jsxUrl);
    collectEvent({
      type: 'click',
      description: `React 템플릿 다운로드: ${template.name}`,
      page: '/playground/react/templates'
    });
  };

  const handleUseInPlayground = (template: ReactTemplate) => {
    // 템플릿 ID만 전달
    const url = `/playground/react?template=${template.id}`;
    
    // 새창으로 열기
    window.open(url, '_blank', 'noopener,noreferrer');
    collectEvent({
      type: 'click',
      description: `React 템플릿 플레이그라운드에서 사용: ${template.name}`,
      page: '/playground/react/templates'
    });
  };

  const getTemplateIcon = (templateName: string) => {
    if (templateName.includes('카운터')) return <ReactIcon className="h-4 w-4" />;
    if (templateName.includes('폼')) return <FileText className="h-4 w-4" />;
    if (templateName.includes('애니메이션')) return <ReactIcon className="h-4 w-4" />;
    return <Code className="h-4 w-4" />;
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
                  onClick={() => handleCopyCode(activeTab === 'jsx' ? selectedTemplate.jsx : selectedTemplate.css)}
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
                  onClick={() => handleCopyCode(activeTab === 'jsx' ? selectedTemplate.jsx : selectedTemplate.css)}
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
                  onClick={() => setActiveTab('jsx')}
                  className={`flex-1 px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 min-h-[44px] ${activeTab === 'jsx'
                    ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm border border-cyan-200 dark:border-cyan-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    <span>JSX</span>
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
              </div>

              {/* Code Display */}
              <Card className="p-4">
                <pre className="text-sm font-mono text-slate-900 dark:text-slate-100 overflow-x-auto whitespace-pre-wrap max-h-96 md:max-h-none overflow-y-auto">
                  <code>
                    {activeTab === 'jsx' ? selectedTemplate.jsx : selectedTemplate.css}
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
                        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
                        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                      </head>
                      <body>
                        <div id="root"></div>
                        <script type="text/babel">
                          try {
                            // JSX 코드에서 import/export 문 제거
                            let cleanJsxCode = \`${selectedTemplate.jsx}\`
                              .replace(/^import.*?from.*?;$/gm, '')
                              .replace(/^export.*?;$/gm, '')
                              .trim();
                            
                            // React hooks를 전역으로 사용할 수 있도록 코드 앞에 추가
                            cleanJsxCode = \`
                            const { useState, useEffect, useRef, useCallback, useMemo } = React;
                              \${cleanJsxCode}
                            \`;
                            
                            // App 함수가 없으면 기본 함수 추가
                            if (!cleanJsxCode.includes('function App') && !cleanJsxCode.includes('const App') && !cleanJsxCode.includes('App =')) {
                              cleanJsxCode = \`function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>React 플레이그라운드</h1>
      <p>코드를 작성해보세요!</p>
    </div>
  );
}

\` + cleanJsxCode;
                            }
                            
                            // Babel로 JSX를 컴파일하고 실행
                            let compiledCode;
                            let hasError = false;
                            
                            try {
                              // Babel 설정을 더 명확하게 지정 - React hooks 지원
                              compiledCode = Babel.transform(cleanJsxCode, {
                                presets: [
                                  ['react', { runtime: 'classic' }]
                                ],
                                plugins: []
                              }).code;
                            } catch (babelError) {
                              console.error('Babel 컴파일 오류:', babelError);
                              // Babel 컴파일 실패 시 기본 App 함수 사용
                              window.App = function App() {
                                return React.createElement('div', { style: { padding: '20px', textAlign: 'center' } },
                                  React.createElement('h1', null, 'Babel 컴파일 오류'),
                                  React.createElement('p', null, '코드에 문법 오류가 있습니다. 다시 확인해주세요.'),
                                  React.createElement('pre', { style: { marginTop: '20px', textAlign: 'left', fontSize: '12px', color: '#666' } }, 
                                    babelError.message
                                  )
                                );
                              };
                              hasError = true;
                            }
                            
                            if (!hasError) {
                              // 컴파일된 코드를 window 스코프에서 실행하도록 수정
                              try {
                                // 더 안전한 실행 방법
                                const script = document.createElement('script');
                                script.textContent = compiledCode;
                                document.head.appendChild(script);
                                document.head.removeChild(script);
                                
                                // App 함수를 window에 명시적으로 할당
                                if (typeof App !== 'undefined') {
                                  window.App = App;
                                } else {
                                  console.log('App 함수가 정의되지 않음');
                                }
                              } catch (execError) {
                                console.error('코드 실행 오류:', execError);
                                // 코드 실행 실패 시 기본 App 함수 사용
                                window.App = function App() {
                                  return React.createElement('div', { style: { padding: '20px', textAlign: 'center' } },
                                    React.createElement('h1', null, '코드 실행 오류'),
                                    React.createElement('p', null, '코드 실행 중 오류가 발생했습니다.'),
                                    React.createElement('pre', { style: { marginTop: '20px', textAlign: 'left', fontSize: '12px', color: '#666' } }, 
                                      execError.message
                                    )
                                  );
                                };
                              }
                            }
                            
                            // App 함수가 정의되었는지 확인하고, 없으면 기본 함수 정의
                            let AppComponent;
                            if (typeof window.App !== 'undefined') {
                              AppComponent = window.App;
                            } else if (typeof App !== 'undefined') {
                              AppComponent = App;
                            } else {
                              // 기본 App 컴포넌트 생성
                              AppComponent = function App() {
                                return React.createElement('div', { style: { padding: '20px', textAlign: 'center' } },
                                  React.createElement('h1', null, 'React 플레이그라운드'),
                                  React.createElement('p', null, 'App 함수가 정의되지 않았습니다. function App() 또는 const App = () => 형태로 컴포넌트를 정의해주세요.'),
                                  React.createElement('pre', { style: { marginTop: '20px', textAlign: 'left', fontSize: '12px', color: '#666' } }, 
                                    '예시:\\n' +
                                    'function App() {\\n' +
                                    '  return <div>Hello World!</div>;\\n' +
                                    '}'
                                  )
                                );
                              };
                            }
                            
                            // React 컴포넌트 렌더링
                            const root = ReactDOM.createRoot(document.getElementById('root'));
                            root.render(React.createElement(AppComponent));
                          } catch (error) {
                            console.error('React 오류:', error);
                            document.getElementById('root').innerHTML = \`
                              <div style="padding: 20px; color: #dc3545; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px;">
                                <h3>오류가 발생했습니다:</h3>
                                <pre style="white-space: pre-wrap; font-family: monospace;">\${error.message}</pre>
                              </div>
                            \`;
                          }
                        </script>
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
              <Link href="/playground/react">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 min-h-[44px]">
                  <ArrowLeft className="h-4 w-4" />
                  <span>플레이그라운드</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <ReactIcon className="h-5 w-5 text-cyan-600" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  React 템플릿
                </h1>
              </div>
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                {reactTemplates.length}개 템플릿
              </Badge>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center justify-between">
              <Link href="/playground/react">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 min-h-[44px]">
                  <ArrowLeft className="h-4 w-4" />
                  <span>플레이그라운드</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <ReactIcon className="h-5 w-5 text-cyan-600" />
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  React 템플릿
                </h1>
              </div>
            </div>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                {reactTemplates.length}개 템플릿
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400 text-center md:text-left">
            다양한 React JSX와 CSS 템플릿을 확인하고 플레이그라운드에서 사용해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {reactTemplates.map((template, index) => (
            <Card
              key={index}
              className="p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex-shrink-0">
                    {getTemplateIcon(template.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base truncate">
                      {template.name}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                      JSX + CSS
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      <span>JSX</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>CSS</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 min-h-[44px]"
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
