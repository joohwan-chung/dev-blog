export default function StatisticsLoading() {
  return (
    <div className="space-y-6">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* 통계 카드 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* 이벤트 타입별 통계 스켈레톤 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 시간대별 통계 스켈레톤 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 일별 통계 스켈레톤 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="space-y-4">
          <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-52 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
