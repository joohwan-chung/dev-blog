export default function PlaygroundLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 bg-white rounded-lg"></div>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 dark:border-slate-400 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">플레이그라운드를 불러오는 중...</p>
      </div>
    </div>
  );
}
