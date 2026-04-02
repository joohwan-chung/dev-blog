import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Code, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-slate-900 dark:bg-slate-100 rounded flex items-center justify-center">
                <Code className="h-4 w-4 text-white dark:text-slate-900" />
              </div>
              <span className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100">joohwan.dev</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
              풀스택 개발자로서의 경험과 지식을 공유하며, 
              함께 성장하는 개발자 커뮤니티를 만들어갑니다.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">블로그</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/blog" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  모든 포스트
                </Link>
              </li>
              <li>
                <Link href="/tags" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  태그별 보기
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  소개
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">연결</h4>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/joohwan-chung" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="http://www.linkedin.com/in/joohwan-chung-5145b5138" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:joohwan0607@gmail.com" 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <a href="mailto:joohwan0607@gmail.com" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                joohwan0607@gmail.com
              </a>
            </p>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2024 joohwan.dev. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500 dark:text-slate-400">
          </div>
        </div>
      </div>
    </footer>
  );
}
