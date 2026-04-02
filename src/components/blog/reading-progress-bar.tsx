'use client';

import { useEffect, useState } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startEl = document.querySelector('[data-article-start]');
    const endEl = document.querySelector('[data-article-end]');

    const update = () => {
      if (!startEl || !endEl) {
        setProgress(0);
        return;
      }
      const startY = startEl.getBoundingClientRect().top + window.scrollY;
      const endY = endEl.getBoundingClientRect().top + window.scrollY;
      const scrollY = window.scrollY;
      const denom = endY - startY;
      if (denom <= 0) {
        setProgress(1);
        return;
      }
      const raw = (scrollY - startY) / denom;
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    update();
    const onScrollOrResize = () => window.requestAnimationFrame(update);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <div
      className="no-print fixed top-0 left-0 right-0 z-50 h-[3px] bg-stone-100 dark:bg-slate-800"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="읽기 진행률"
    >
      <div
        className="h-full bg-stone-600 dark:bg-slate-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
