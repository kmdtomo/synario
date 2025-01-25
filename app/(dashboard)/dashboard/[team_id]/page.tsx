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

  return (
    <div className="p-8 space-y-6">
      {/* チーム情報ヘッダー - よりコンパクトに */}
      <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {team.name}
            </h1>
            <p className="text-sm text-gray-600">
              {memberCount}人のメンバーと共に目標達成を目指しています
            </p>
          </div>
          <button className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            チーム設定
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPIセクション - コンパクトに */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                チームKPI
              </h2>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                進行中
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
              <p className="text-base font-bold text-gray-900">
                {team.team_kpi}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
                    style={{ width: '60%' }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">60%</span>
              </div>
            </div>
          </div>
        </div>

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
  );
}
