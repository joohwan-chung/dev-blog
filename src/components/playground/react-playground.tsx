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
  Terminal,
  X,
  GripHorizontal,
  Zap as ReactIcon,
  FileText
} from 'lucide-react';
import { collectEvent } from '@/lib/analytics';
import { reactTemplates } from '@/lib/react-templates';
import Link from 'next/link';

// 빈 기본 코드
const emptyJSX = `function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Hello World!</h1>
      <p>React 플레이그라운드에 오신 것을 환영합니다.</p>
    </div>
  );
}`;

const emptyCSS = `/* CSS 스타일을 여기에 작성하세요 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}`;

export function ReactPlayground() {
  const searchParams = useSearchParams();
  const [jsxCode, setJsxCode] = useState(emptyJSX);
  const [cssCode, setCssCode] = useState(emptyCSS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'jsx' | 'css'>('jsx');
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
      description: 'React 플레이그라운드 방문',
      page: '/playground/react',
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });
  }, []);

  // URL 파라미터에서 템플릿 로드
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = reactTemplates.find(t => t.id === templateId);
      if (template) {
        setJsxCode(template.jsx);
        setCssCode(template.css);
        setConsoleOutput([]);
        setShowConsole(false);
        
        // 템플릿 로드 이벤트 수집
        collectEvent({
          type: 'click',
          description: `React 템플릿 로드: ${template.name}`,
          page: '/playground/react'
        });
      }
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
    setJsxCode(emptyJSX);
    setCssCode(emptyCSS);
    setConsoleOutput([]);
    setShowConsole(false);
    collectEvent({
      type: 'click',
      description: 'React 플레이그라운드 초기화',
      page: '/playground/react'
    });
  };

  const handleClearConsole = () => {
    setConsoleOutput([]);
    setShowConsole(false);
    collectEvent({
      type: 'click',
      description: 'React 플레이그라운드 콘솔 초기화',
      page: '/playground/react'
    });
  };

  const handleCopyCode = () => {
    const codeToCopy = activeTab === 'jsx' ? jsxCode : cssCode;
    navigator.clipboard.writeText(codeToCopy);
    collectEvent({
      type: 'click',
      description: `React 플레이그라운드 코드 복사 (${activeTab.toUpperCase()})`,
      page: '/playground/react'
    });
  };

  const handleDownloadCode = () => {
    const jsxBlob = new Blob([jsxCode], { type: 'text/javascript' });
    const cssBlob = new Blob([cssCode], { type: 'text/css' });

    const jsxUrl = URL.createObjectURL(jsxBlob);
    const cssUrl = URL.createObjectURL(cssBlob);

    const jsxLink = document.createElement('a');
    jsxLink.href = jsxUrl;
    jsxLink.download = 'App.jsx';
    jsxLink.click();

    const cssLink = document.createElement('a');
    cssLink.href = cssUrl;
    cssLink.download = 'styles.css';
    cssLink.click();

    URL.revokeObjectURL(jsxUrl);
    URL.revokeObjectURL(cssUrl);
    collectEvent({
      type: 'click',
      description: 'React 플레이그라운드 코드 다운로드',
      page: '/playground/react'
    });
  };



  const previewHTML = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React 플레이그라운드 미리보기</title>
      <style>
        ${cssCode}
      </style>
      <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
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
          // JSX 코드에서 import/export 문 제거
          let cleanJsxCode = \`${jsxCode}\`
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
                <ReactIcon className="h-5 w-5 text-cyan-600" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  React 플레이그라운드
                </h1>
              </div>
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                JSX + CSS
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/playground/react/templates">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <FileText className="h-4 w-4" />
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
                <ReactIcon className="h-5 w-5 text-cyan-600" />
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  React 플레이그라운드
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
                className={`flex-1 py-3 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[44px] ${activePanel === 'code'
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
                className={`flex-1 py-3 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[44px] ${activePanel === 'preview'
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
                className={`flex-1 py-3 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[44px] ${activePanel === 'console'
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
              <Link href="/playground/react/templates">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]"
                >
                  <FileText className="h-4 w-4" />
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
                    onClick={() => setActiveTab('jsx')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'jsx'
                      ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm border border-cyan-200 dark:border-cyan-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    <span className="flex items-center justify-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      <span>JSX</span>
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
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg m-2 opacity-50"></div>
                <div className="relative h-full p-4">
                  <div className="h-full bg-slate-900/5 dark:bg-slate-900/20 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                    <textarea
                      value={activeTab === 'jsx' ? jsxCode : cssCode}
                      onChange={(e) => {
                        if (activeTab === 'jsx') {
                          setJsxCode(e.target.value);
                        } else {
                          setCssCode(e.target.value);
                        }
                      }}
                      className="w-full h-full resize-none border-0 outline-none bg-transparent font-mono text-sm leading-relaxed text-slate-900 dark:text-slate-100 p-4 rounded-lg"
                      placeholder={
                        activeTab === 'jsx' ? '// JSX 코드를 입력하세요' : '/* CSS 코드를 입력하세요 */'
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
                      title="React Playground Preview"
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
                                React 실행 결과가<br />여기에 표시됩니다...
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
                </div>

                {/* Code Editor */}
                <div className="flex-1 p-3">
                  <div className="h-full bg-slate-900/5 dark:bg-slate-900/20 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                    <textarea
                      value={activeTab === 'jsx' ? jsxCode : cssCode}
                      onChange={(e) => {
                        if (activeTab === 'jsx') {
                          setJsxCode(e.target.value);
                        } else {
                          setCssCode(e.target.value);
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
                        activeTab === 'jsx' ? '// JSX 코드를 입력하세요' : '/* CSS 코드를 입력하세요 */'
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
                      title="React Playground Preview"
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
                            React 실행 결과가<br />여기에 표시됩니다...
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
