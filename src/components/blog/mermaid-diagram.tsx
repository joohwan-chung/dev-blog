'use client';

import { useEffect, useId, useRef, useState } from 'react';

interface MermaidDiagramProps {
  source: string;
}

function getMermaidTheme(): 'default' | 'dark' {
  if (typeof document === 'undefined') return 'default';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'default';
}

function DiagramShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="my-6">
      <div className="bg-stone-900 dark:bg-slate-800 text-stone-100 dark:text-slate-200 rounded-lg overflow-hidden border border-stone-700 dark:border-slate-600">
        <DiagramLabel>{label}</DiagramLabel>
        {children}
      </div>
    </div>
  );
}

function DiagramLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-stone-800 dark:bg-slate-700 px-4 py-2 text-sm text-stone-200 border-b border-stone-700 dark:border-slate-600 font-medium">
      {children}
    </div>
  );
}

function CodeFallback({ source, label }: { source: string; label: string }) {
  return (
    <DiagramShell label={label}>
      <pre className="p-4 bg-stone-900 dark:bg-slate-800 min-w-max overflow-x-auto">
        <code className="text-sm font-mono text-stone-100 dark:text-slate-200 whitespace-pre">
          {source}
        </code>
      </pre>
    </DiagramShell>
  );
}

export function MermaidDiagram({ source }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = source.trim();
    if (!trimmed || !containerRef.current) return;

    let cancelled = false;

    async function renderDiagram() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: getMermaidTheme(),
          securityLevel: 'strict',
        });

        const renderId = `mermaid-${reactId.replace(/:/g, '')}`;
        const { svg } = await mermaid.render(renderId, trimmed);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Mermaid 렌더링 실패';
          console.warn('Mermaid render failed:', message);
          setError(message);
        }
      }
    }

    renderDiagram();

    const observer = new MutationObserver(() => {
      if (!cancelled) renderDiagram();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [source, reactId]);

  if (error) {
    return <CodeFallback source={source} label="mermaid (렌더 실패)" />;
  }

  return (
    <DiagramShell label="mermaid">
      <div className="overflow-x-auto p-4 bg-white dark:bg-slate-900 flex justify-center">
        <div ref={containerRef} className="mermaid-diagram w-full [&_svg]:max-w-full" />
      </div>
    </DiagramShell>
  );
}
