'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Code, LogIn, User } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { ThemeToggle } from './theme-toggle';
import { collectClickEvent } from '@/lib/analytics';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { UserDropdown } from '@/components/auth/user-dropdown';
import { Button } from '@/components/ui/button';
import { getSettingsClient } from '@/lib/settings';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const settings = getSettingsClient();

  // 번역된 텍스트들을 메모이제이션
  const translatedTexts = useMemo(() => ({
    home: t('nav.home'),
    blog: t('nav.blog'),
    about: t('nav.about'),
    login: t('nav.login'),
    playground: t('nav.playground'),
    homeDesc: t('nav.home_desc'),
    blogDesc: t('nav.blog_desc'),
    playgroundDesc: t('nav.playground_desc'),
    aboutDesc: t('nav.about_desc'),
    menuOpen: t('nav.menu_open'),
    menuClose: t('nav.menu_close'),
  }), [t]);

  // 모바일 메뉴 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 group"
          onClick={() => collectClickEvent('로고')}
        >
          {settings.logoUrl ? (
            <Image 
              src={settings.logoUrl} 
              alt="로고" 
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg group-hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-700 dark:group-hover:bg-slate-200 transition-colors">
              <Code className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
          )}
          <span className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100">
            {settings.siteTitle || 'joohwan.dev'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              {translatedTexts.home}
            </Link>
            <Link 
              href="/blog" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              {translatedTexts.blog}
            </Link>
            <Link 
              href="/playground" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              {translatedTexts.playground}
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              {translatedTexts.about}
            </Link>
          </nav>
          
          {/* 사용자 인증 섹션 */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{translatedTexts.login}</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Theme Toggle - removed from here since it's now in the navigation section */}

        {/* Mobile menu button */}
        <button
          className="md:hidden relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={translatedTexts.menuOpen}
          aria-expanded={isMobileMenuOpen}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Full-Screen Navigation */}
      <div className={`md:hidden fixed top-0 left-0 right-0 h-screen z-[9999] transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Full Screen Backdrop */}
        <div 
          className="absolute top-0 left-0 right-0 h-full bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Full Screen Sidebar */}
        <div className={`absolute top-0 left-0 right-0 h-full bg-white dark:bg-slate-900 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Theme Toggle Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={translatedTexts.menuClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-6 space-y-3 bg-white dark:bg-slate-900 overflow-y-auto">
            <Link 
              href="/" 
              className="flex items-center py-4 px-6 text-lg font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 rounded-2xl transition-all duration-300 ease-in-out group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  🏠
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-200">{translatedTexts.home}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{translatedTexts.homeDesc}</div>
                </div>
                <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  →
                </div>
              </div>
            </Link>
            
            <Link 
              href="/blog" 
              className="flex items-center py-4 px-6 text-lg font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 rounded-2xl transition-all duration-300 ease-in-out group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  📝
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-200">{translatedTexts.blog}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{translatedTexts.blogDesc}</div>
                </div>
                <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  →
                </div>
              </div>
            </Link>
            
            <Link 
              href="/playground" 
              className="flex items-center py-4 px-6 text-lg font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 rounded-2xl transition-all duration-300 ease-in-out group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  🎮
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-200">{translatedTexts.playground}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{translatedTexts.playgroundDesc}</div>
                </div>
                <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  →
                </div>
              </div>
            </Link>
            
            <Link 
              href="/about" 
              className="flex items-center py-4 px-6 text-lg font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 rounded-2xl transition-all duration-300 ease-in-out group shadow-sm hover:shadow-md border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  👤
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-200">{translatedTexts.about}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{translatedTexts.aboutDesc}</div>
                </div>
                <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  →
                </div>
              </div>
            </Link>
            
            {/* 모바일 사용자 인증 섹션 */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 py-4 px-6 border-t border-slate-200 dark:border-slate-700">
                <User className="h-5 w-5 text-slate-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user?.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 px-6 border-t border-slate-200 dark:border-slate-700">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {translatedTexts.login}
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

    </header>
  );
}
