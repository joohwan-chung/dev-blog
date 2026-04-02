import { LoadingSpinner } from '@/components/common/loading-spinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
