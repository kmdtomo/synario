import { cookies } from "next/headers";
import { createClient } from "@/lib/db/supabase/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    team_id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function TeamDashboard({ params }: PageProps) {
  const { team_id } = await Promise.resolve(params);
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  const { data: team, error } = await supabase
    .from("teams")
    .select(`
      id,
      name,
      team_kpi,
      created_at,
      team_members (
        id
      )
    `)
    .eq("id", team_id)
    .single();

  if (error || !team) {
    console.error("Team fetch error:", error);
    notFound();
  }

  const memberCount = team.team_members?.length || 0;

  // 進捗率の計算（仮の値）
  const progress = {
    current: 3000000,
    target: 5000000,
    progressPercentage: 60
  };

  return (
    <div className="p-8 space-y-6">
      {/* チーム情報とKPIを統合したヘッダー */}
      <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl p-6">
        <div className="flex items-center gap-12">
          {/* 左側: チーム情報とKPI */}
          <div className="flex-1 space-y-6">
            {/* チーム情報 */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {team.name}
                </h1>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                  進行中
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {memberCount}人のメンバーと共に目標達成を目指しています
              </p>
            </div>

            {/* チームKPI */}
            <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                <svg 
                  className="w-5 h-5 text-purple-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                チームKPI
              </h2>
              <p className="text-lg font-bold text-gray-900 pl-7">
                {team.team_kpi}
              </p>
            </div>
          </div>

          {/* 右側: 進捗グラフと数値 */}
          <div className="flex items-center gap-10 shrink-0 pr-4">
            {/* 円グラフ */}
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <defs>
                  <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgb(147, 51, 234)" />
                    <stop offset="100%" stopColor="rgb(79, 70, 229)" />
                  </linearGradient>
                </defs>
                <circle
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="url(#progress-gradient)"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${progress.progressPercentage * 2.51} ${100 * 2.51}`}
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {progress.progressPercentage}%
                </div>
              </div>
            </div>

            {/* 数値情報 */}
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">目標</div>
                <div className="text-xl font-bold text-gray-900">
                  {progress.target.toLocaleString()}円
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">現在</div>
                <div className="text-lg font-bold text-gray-900">
                  {progress.current.toLocaleString()}円
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* プロジェクト作成セクション */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              プロジェクトを作成
            </h2>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg flex items-center justify-center mb-3">
              <svg 
                className="w-6 h-6 text-purple-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              新しいプロジェクトを始めましょう
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              チームの目標達成に向けて、新しいプロジェクトを作成できます
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors">
              プロジェクトを作成
            </button>
          </div>
        </div>

        {/* プロジェクト一覧セクション */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                進行中のプロジェクト
              </h2>
              <button className="text-sm text-purple-600 font-medium hover:text-purple-700">
                すべて表示
              </button>
            </div>
          </div>
          <div className="p-4">
            {/* プロジェクトがない場合 */}
            <div className="text-center py-8 text-gray-500">
              まだプロジェクトがありません
            </div>
            {/* プロジェクト一覧はここに追加 */}
          </div>
        </div>
      </div>
    </div>
  );
}
