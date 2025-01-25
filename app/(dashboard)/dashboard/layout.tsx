export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white">
      {/* サイドバー */}
      <div className="w-64 border-r border-slate-700/50 flex flex-col bg-[#0f172a]">
        {/* サービス名 */}
        <div className="h-14 flex items-center px-4 border-b border-slate-700/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Synario
          </h1>
        </div>

        {/* チーム情報 */}
        <div className="h-16 flex items-center px-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">チームの名前</p>
              <p className="text-xs text-white/60">5 members</p>
            </div>
          </div>
        </div>

        {/* メインメニュー */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="mb-4">
            <p className="px-3 text-xs font-semibold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">
              GENERAL
            </p>
          </div>
          <nav className="space-y-1">
            <a
              href="#"
              className="block px-3 py-2 text-sm font-bold rounded-lg bg-white/10 text-white"
            >
              ダッシュボード
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-sm font-bold rounded-lg text-white hover:bg-white/10 transition-all"
            >
              KPI
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-sm font-bold rounded-lg text-white hover:bg-white/10 transition-all"
            >
              タスク
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-sm font-bold rounded-lg text-white hover:bg-white/10 transition-all"
            >
              カレンダー
            </a>
          </nav>

          <div className="mt-8 mb-4">
            <p className="px-3 text-xs font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider">
              ANALYTICS
            </p>
          </div>
          <nav className="space-y-1">
            <a
              href="#"
              className="block px-3 py-2 text-sm font-bold rounded-lg text-white hover:bg-white/10 transition-all"
            >
              メンバー
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-sm font-bold rounded-lg text-white hover:bg-white/10 transition-all"
            >
              レポート
            </a>
          </nav>
        </div>

        {/* 下部メニュー */}
        <div className="p-4 border-t border-slate-700/50">
          <nav className="space-y-1">
            <a
              href="#"
              className="block px-3 py-2 text-sm font-bold rounded-lg text-white hover:bg-white/10 transition-all"
            >
              設定
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-sm font-bold rounded-lg text-white hover:bg-white/10 transition-all"
            >
              ヘルプ
            </a>
          </nav>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto bg-white">
        <main className="h-full">{children}</main>
      </div>
    </div>
  );
}
