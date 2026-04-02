'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 transition-colors duration-200"
    >
      <Printer className="h-4 w-4 mr-2" />
      인쇄
    </Button>
  );
}
