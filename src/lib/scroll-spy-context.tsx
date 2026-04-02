'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/** 뷰포트 상단부터 이 높이 안에 들어온 제목을 "현재 섹션"으로 간주 (px) */
const ROOT_MARGIN_TOP = 120;
/** 뷰포트 하단 기준, 이 비율 위까지를 활성 영역으로 봄 (0~1, 1 = 전체) */
const ROOT_MARGIN_BOTTOM_RATIO = 0.4;

export const ScrollSpyContext = createContext<string | null>(null);

export function useScrollSpyContext() {
  return useContext(ScrollSpyContext);
}

export function useScrollSpy(headingIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headingIds.length === 0) {
      setActiveId(null);
      return;
    }

    const rootMarginBottom = `${Math.round((1 - ROOT_MARGIN_BOTTOM_RATIO) * 100)}%`;
    const rootMargin = `-${ROOT_MARGIN_TOP}px 0px -${rootMarginBottom} 0px`;

    const visibility = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (id) visibility.set(id, entry.isIntersecting);
        }
        // 활성: 현재 보이는 제목 중 목록 순서상 가장 앞에 있는 것
        let current: string | null = null;
        for (const id of headingIds) {
          if (visibility.get(id)) {
            current = id;
            break;
          }
        }
        setActiveId((prev) => (prev !== current ? current : prev));
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    const observe = () => {
      for (const id of headingIds) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    };

    observe();
    const t = window.setTimeout(observe, 150);

    return () => {
      window.clearTimeout(t);
      observer.disconnect();
    };
  }, [headingIds.join(',')]);

  return activeId;
}
