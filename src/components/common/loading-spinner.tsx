'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-stone-600 dark:text-slate-400 transition-colors duration-200`} />
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-stone-600 dark:text-slate-400 text-lg transition-colors duration-200">페이지를 불러오는 중...</p>
      </div>
    </div>
  );
}

export function CardLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <LoadingSpinner size="md" className="mb-2" />
        <p className="text-stone-500 dark:text-slate-500 text-sm transition-colors duration-200">로딩 중...</p>
      </div>
    </div>
  );
}
