'use client';

import { useState, useEffect } from 'react';
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
  Terminal,
  X,
  GripHorizontal,
  ExternalLink
} from 'lucide-react';
import { collectEvent } from '@/lib/analytics';
import { webTemplates } from '@/lib/web-templates';
import Link from 'next/link';

// 빈 기본 코드
const emptyCSS = `/* CSS 코드를 여기에 작성하세요 */`;
const emptyHTML = `<!-- HTML 코드를 여기에 작성하세요 -->`;
const emptyJS = `// JavaScript 코드를 여기에 작성하세요`;

export function WebPlayground() {
  const [cssCode, setCssCode] = useState(emptyCSS);
  const [htmlCode, setHtmlCode] = useState(emptyHTML);
  const [jsCode, setJsCode] = useState(emptyJS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<'code' | 'preview' | 'console'>('code');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [panelHeight, setPanelHeight] = useState(60); // 상단 패널 높이 비율 (60%)
  const [consoleWidth, setConsoleWidth] = useState(50); // 콘솔 패널 너비 비율 (50%)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    collectEvent({
      type: 'user_visit',
      description: '웹 플레이그라운드 방문',
      page: '/playground/web',
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });
  }, []);

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

  // URL 파라미터에서 템플릿 로드
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('template');

    if (templateId) {
      const template = webTemplates.find(t => t.id === templateId);
      if (template) {
        setHtmlCode(template.html);
        setCssCode(template.css);
        setJsCode(template.js);
        
        // 템플릿 로드 이벤트 수집
        collectEvent({
          type: 'click',
          description: `웹 템플릿 로드: ${template.name}`,
          page: '/playground/web'
        });
      }
    }
  }, []);

  // iframe에서 오는 콘솔 출력 메시지 처리
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'console-output') {
        setConsoleOutput(event.data.output);
        setShowConsole(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleReset = () => {
    setCssCode(emptyCSS);
    setHtmlCode(emptyHTML);
    setJsCode(emptyJS);
    setConsoleOutput([]);
    setShowConsole(false);
    
    collectEvent({
      type: 'click',
      description: '웹 플레이그라운드 초기화',
      page: '/playground/web'
    });
  };

  const handleClearConsole = () => {
    setConsoleOutput([]);
    setShowConsole(false);
    
    collectEvent({
      type: 'click',
      description: '웹 플레이그라운드 콘솔 초기화',
      page: '/playground/web'
    });
  };

  const handleCopyCode = () => {
    const codeToCopy = activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode;
    navigator.clipboard.writeText(codeToCopy);
    
    collectEvent({
      type: 'click',
      description: `웹 플레이그라운드 코드 복사 (${activeTab.toUpperCase()})`,
      page: '/playground/web'
    });
  };

  const handleDownloadCode = () => {
    const cssBlob = new Blob([cssCode], { type: 'text/css' });
    const htmlBlob = new Blob([htmlCode], { type: 'text/html' });
    const jsBlob = new Blob([jsCode], { type: 'text/javascript' });

    const cssUrl = URL.createObjectURL(cssBlob);
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const jsUrl = URL.createObjectURL(jsBlob);

    const cssLink = document.createElement('a');
    cssLink.href = cssUrl;
    cssLink.download = 'style.css';
    cssLink.click();

    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'index.html';
    htmlLink.click();

    const jsLink = document.createElement('a');
    jsLink.href = jsUrl;
    jsLink.download = 'script.js';
    jsLink.click();

    URL.revokeObjectURL(cssUrl);
    URL.revokeObjectURL(htmlUrl);
    URL.revokeObjectURL(jsUrl);

    collectEvent({
      type: 'click',
      description: '웹 플레이그라운드 코드 다운로드',
      page: '/playground/web'
    });
  };

  const previewHTML = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>웹 플레이그라운드 미리보기</title>
      <style>
        ${cssCode}
      </style>
    </head>
    <body>
      ${htmlCode}
      <script>
        // 콘솔 출력을 캡처하기 위한 오버라이드
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;
        
        const consoleOutputs = [];
        
        function captureConsoleOutput(type, ...args) {
          const timestamp = new Date().toLocaleTimeString();
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          consoleOutputs.push(\`[\${timestamp}] \${type.toUpperCase()}: \${message}\`);
          
          // 부모 창에 콘솔 출력 전송
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'console-output',
              output: consoleOutputs
            }, '*');
          }
        }
        
        console.log = (...args) => {
          originalLog.apply(console, args);
          captureConsoleOutput('log', ...args);
        };
        
        console.error = (...args) => {
          originalError.apply(console, args);
          captureConsoleOutput('error', ...args);
        };
        
        console.warn = (...args) => {
          originalWarn.apply(console, args);
          captureConsoleOutput('warn', ...args);
        };
        
        console.info = (...args) => {
          originalInfo.apply(console, args);
          captureConsoleOutput('info', ...args);
        };
        
        try {
          ${jsCode}
        } catch (error) {
          console.error('JavaScript 오류:', error);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-slate-50 dark:bg-slate-900`}>
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 md:p-4">
        <div className="container mx-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  웹 플레이그라운드
                </h1>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                HTML + CSS + JS
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/playground/web/templates">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 !cursor-pointer"
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
                variant={showConsole ? "default" : "outline"}
                size="sm"
                onClick={() => setShowConsole(!showConsole)}
                className="flex items-center space-x-1"
              >
                <Terminal className="h-4 w-4" />
                <span>콘솔</span>
                {consoleOutput.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                    {consoleOutput.length}
                  </Badge>
                )}
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
                <Code className="h-5 w-5 text-blue-600" />
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  웹 플레이그라운드
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
                className={`flex-1 py-3 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] ${activePanel === 'code'
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
                className={`flex-1 py-3 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] ${activePanel === 'preview'
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
              <button
                onClick={() => setActivePanel('console')}
                className={`flex-1 py-3 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] ${activePanel === 'console'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                aria-pressed={activePanel === 'console'}
                aria-label="콘솔로 전환"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Terminal className="h-4 w-4" />
                  <span>콘솔</span>
                  {consoleOutput.length > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                      {consoleOutput.length}
                    </Badge>
                  )}
                </div>
              </button>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Link href="/playground/web/templates">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 whitespace-nowrap min-h-[44px] !cursor-pointer"
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


              {/* Code Tabs */}
              <div className="px-4 py-2">
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('html')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'html'
                      ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm border border-orange-200 dark:border-orange-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    <span className="flex items-center justify-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span>HTML</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('css')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'css'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    <span className="flex items-center justify-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>CSS</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('js')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'js'
                      ? 'bg-white dark:bg-slate-700 text-yellow-600 dark:text-yellow-400 shadow-sm border border-yellow-200 dark:border-yellow-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    <span className="flex items-center justify-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      <span>JS</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg m-2 opacity-50"></div>
                <div className="relative h-full p-4">
                  <div className="h-full bg-slate-900/5 dark:bg-slate-900/20 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                    <textarea
                      value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
                      onChange={(e) => {
                        if (activeTab === 'html') {
                          setHtmlCode(e.target.value);
                        } else if (activeTab === 'css') {
                          setCssCode(e.target.value);
                        } else {
                          setJsCode(e.target.value);
                        }
                      }}
                      className="w-full h-full resize-none border-0 outline-none bg-transparent font-mono text-sm leading-relaxed text-slate-900 dark:text-slate-100 p-4 rounded-lg"
                      placeholder={
                        activeTab === 'html' ? '<!-- HTML 코드를 입력하세요 -->' :
                          activeTab === 'css' ? '/* CSS 코드를 입력하세요 */' :
                            '// JavaScript 코드를 입력하세요'
                      }
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

            {/* Bottom Panel - Preview and Console */}
            <div
              className="flex border-t border-slate-200 dark:border-slate-700"
              style={{ height: `${100 - panelHeight}%` }}
            >
              {/* Preview Panel */}
              <div
                className="flex flex-col border-r border-slate-200 dark:border-slate-700"
                style={{ width: showConsole ? `${100 - consoleWidth}%` : '100%' }}
              >
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

                <div className="flex-1 p-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  <div className="h-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                    <iframe
                      srcDoc={previewHTML}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts"
                      title="Web Playground Preview"
                    />
                  </div>
                </div>
              </div>

              {/* Console Panel */}
              {showConsole && (
                <>
                  {/* Vertical Resize Handle */}
                  <div
                    className="w-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-col-resize flex items-center justify-center group"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const startX = e.clientX;
                      const startWidth = consoleWidth;

                      const handleMouseMove = (e: MouseEvent) => {
                        const deltaX = e.clientX - startX;
                        const containerWidth = window.innerWidth;
                        const deltaPercent = (deltaX / containerWidth) * 100;
                        const newWidth = Math.max(20, Math.min(80, startWidth - deltaPercent));
                        setConsoleWidth(newWidth);
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };

                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <GripHorizontal className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 rotate-90" />
                  </div>

                  <div
                    className="flex flex-col"
                    style={{ width: `${consoleWidth}%` }}
                  >
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                          <Terminal className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">콘솔</span>
                          {consoleOutput.length > 0 && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 text-xs">
                              {consoleOutput.length}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearConsole}
                          className="h-6 w-6 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 bg-gradient-to-b from-slate-900 to-slate-800 text-green-400 font-mono text-sm overflow-y-auto">
                      <div className="p-3 h-full">
                        {consoleOutput.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <Terminal className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                              <div className="text-slate-500 italic text-xs">
                                JavaScript 실행 결과가<br />여기에 표시됩니다...
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {consoleOutput.map((output, index) => {
                              const isError = output.includes('ERROR');
                              const isWarning = output.includes('WARN');
                              const isInfo = output.includes('INFO');

                              return (
                                <div
                                  key={index}
                                  className={`p-2 rounded text-xs break-words ${isError ? 'bg-red-900/20 text-red-400 border-l-2 border-red-500' :
                                    isWarning ? 'bg-yellow-900/20 text-yellow-400 border-l-2 border-yellow-500' :
                                      isInfo ? 'bg-blue-900/20 text-blue-400 border-l-2 border-blue-500' :
                                        'bg-slate-800/50 text-green-400 border-l-2 border-green-500'
                                    }`}
                                >
                                  {output}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <>
            {/* Code Panel */}
            {activePanel === 'code' && (
              <div className="flex-1 flex flex-col">


                {/* Code Tabs */}
                <div className="px-3 py-3">
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
                </div>

                {/* Code Editor */}
                <div className="flex-1 p-3">
                  <div className="h-full bg-slate-900/5 dark:bg-slate-900/20 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                    <textarea
                      value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
                      onChange={(e) => {
                        if (activeTab === 'html') {
                          setHtmlCode(e.target.value);
                        } else if (activeTab === 'css') {
                          setCssCode(e.target.value);
                        } else {
                          setJsCode(e.target.value);
                        }
                      }}
                      onBlur={() => {
                        // 모바일에서 코드 입력 완료 시 미리보기로 자동 전환
                        if (isMobile) {
                          setTimeout(() => setActivePanel('preview'), 1000);
                        }
                      }}
                      className="w-full h-full resize-none border-0 outline-none bg-transparent font-mono text-sm leading-relaxed text-slate-900 dark:text-slate-100 p-4 rounded-lg"
                      placeholder={
                        activeTab === 'html' ? '<!-- HTML 코드를 입력하세요 -->' :
                          activeTab === 'css' ? '/* CSS 코드를 입력하세요 */' :
                            '// JavaScript 코드를 입력하세요'
                      }
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

                <div className="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  <div className="h-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                    <iframe
                      srcDoc={previewHTML}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts"
                      title="Web Playground Preview"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Console Panel */}
            {activePanel === 'console' && (
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                      <Terminal className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">콘솔</span>
                      {consoleOutput.length > 0 && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 text-xs">
                          {consoleOutput.length}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearConsole}
                      className="h-8 w-8 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/20 min-h-[44px] min-w-[44px]"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 bg-gradient-to-b from-slate-900 to-slate-800 text-green-400 font-mono text-sm overflow-y-auto">
                  <div className="p-4 h-full">
                    {consoleOutput.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Terminal className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                          <div className="text-slate-500 italic text-sm">
                            JavaScript 실행 결과가<br />여기에 표시됩니다...
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {consoleOutput.map((output, index) => {
                          const isError = output.includes('ERROR');
                          const isWarning = output.includes('WARN');
                          const isInfo = output.includes('INFO');

                          return (
                            <div
                              key={index}
                              className={`p-3 rounded text-sm break-words ${isError ? 'bg-red-900/20 text-red-400 border-l-2 border-red-500' :
                                isWarning ? 'bg-yellow-900/20 text-yellow-400 border-l-2 border-yellow-500' :
                                  isInfo ? 'bg-blue-900/20 text-blue-400 border-l-2 border-blue-500' :
                                    'bg-slate-800/50 text-green-400 border-l-2 border-green-500'
                                }`}
                            >
                              {output}
                            </div>
                          );
                        })}
                      </div>
                    )}
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
