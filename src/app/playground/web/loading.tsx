export default function WebPlaygroundLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 bg-white rounded"></div>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 dark:border-slate-400 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">웹 플레이그라운드를 불러오는 중...</p>
      </div>
    </div>
  );
}
