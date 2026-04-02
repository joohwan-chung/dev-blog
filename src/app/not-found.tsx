'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  // 하이드레이션 완료 전에는 기본 스타일 사용
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-8xl font-bold text-slate-300 mb-8">404</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">페이지를 찾을 수 없습니다</h1>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
                <Home className="mr-2 h-5 w-5" />
                홈으로 돌아가기
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={goBack} className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <ArrowLeft className="mr-2 h-5 w-5" />
              이전 페이지로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="text-center">
        <div className={`text-8xl font-bold mb-8 ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>404</div>
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>페이지를 찾을 수 없습니다</h1>
        <p className={`text-lg mb-8 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button 
              size="lg" 
              className={isDark 
                ? "bg-slate-100 hover:bg-slate-200 text-slate-900" 
                : "bg-slate-900 hover:bg-slate-800 text-white"
              }
            >
              <Home className="mr-2 h-5 w-5" />
              홈으로 돌아가기
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={goBack} 
            className={isDark 
              ? "border-slate-600 text-slate-300 hover:bg-slate-800" 
              : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            이전 페이지로
          </Button>
        </div>
      </div>
    </div>
  );
}
