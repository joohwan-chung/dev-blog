'use client';

import Link from 'next/link';
import { Code, Palette, Zap, Globe, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { collectEvent } from '@/lib/analytics';
import { useEffect } from 'react';

const playgroundSections = [
  {
    id: 'web',
    title: '웹 플레이그라운드',
    description: 'HTML, CSS, JavaScript를 함께 작성하고 실시간으로 미리보기할 수 있습니다',
    icon: Code,
    href: '/playground/web',
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'react',
    title: 'React 플레이그라운드',
    description: 'React 컴포넌트를 작성하고 실시간으로 미리보기할 수 있습니다',
    icon: Globe,
    href: '/playground/react',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'markdown',
    title: '마크다운 플레이그라운드',
    description: '마크다운 문법을 작성하고 실시간으로 렌더링된 결과를 확인할 수 있습니다',
    icon: FileText,
    href: '/playground/markdown',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'sth',
    title: 'Comming Soon',
    description: 'Comming Soon',
    icon: Zap,
    href: '/playground/sth',
    color: 'from-yellow-500 to-orange-600',
    comingSoon: true,
  },
];

export default function PlaygroundPage() {

  useEffect(() => {
    if (typeof window === 'undefined') return;
    collectEvent({
      type: 'user_visit',
      description: '플레이그라운드 페이지 방문',
      page: '/playground',
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });
  }, []);

  const handlePlaygroundClick = (playgroundId: string, playgroundName: string) => {
    // 플레이그라운드 클릭 이벤트 수집
    collectEvent({
      type: 'click',
      description: `플레이그라운드 선택: ${playgroundName}`,
      page: '/playground'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Code className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            플레이그라운드
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            실시간 코드 작성 및 미리보기 환경에서 다양한 기술을 실험해보세요
          </p>
        </div>

        {/* Playground Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {playgroundSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.id}
                href={section.comingSoon ? '#' : section.href}
                className={`group block ${section.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !section.comingSoon && handlePlaygroundClick(section.id, section.title)}
              >
                <Card className={`h-full p-6 transition-all duration-300 ${
                  section.comingSoon 
                    ? 'opacity-60' 
                    : 'hover:shadow-xl hover:scale-105 hover:border-slate-300 dark:hover:border-slate-600'
                }`}>
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {section.description}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      {section.comingSoon ? (
                        <span className="text-sm text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                          준비 중
                        </span>
                      ) : (
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          시작하기 →
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-8">
            주요 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">실시간 미리보기</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                코드를 작성하는 즉시 결과를 확인할 수 있습니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">다양한 언어 지원</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                HTML, CSS, JavaScript, JSX, Markdown 등 다양한 언어를 지원합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">직관적인 인터페이스</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                친숙한 인터페이스로 쉽게 사용할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
