import { LoadingSpinner } from '@/components/common/loading-spinner';

export default function AdminCommentsLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    </div>
  );
}
