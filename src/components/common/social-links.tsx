"use client";

import { Github, Linkedin, Mail } from 'lucide-react';

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
}

export function SocialLinks({ className = "", iconSize = 24 }: SocialLinksProps) {
  return (
    <div className={`flex justify-center space-x-6 ${className}`}>
      <a 
        href="https://github.com/joohwan-chung" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        aria-label="GitHub 프로필"
      >
        <Github className={`h-${iconSize} w-${iconSize}`} />
      </a>
      <a 
        href="http://www.linkedin.com/in/joohwan-chung-5145b5138" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        aria-label="LinkedIn 프로필"
      >
        <Linkedin className={`h-${iconSize} w-${iconSize}`} />
      </a>
      <a 
        href="mailto:joohwan0607@gmail.com" 
        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        aria-label="이메일 보내기"
      >
        <Mail className={`h-${iconSize} w-${iconSize}`} />
      </a>
    </div>
  );
}
