import CreateProjectSection from '@/components/modules/dashboard/CreateProjectSection'
import ProjectList from '@/components/modules/dashboard/ProjectList'
import { getTeamProfile } from '@/lib/db/team/team-profile'

type PageProps = {
  params: {
    team_id: string;
  };
};

export default async function TeamDashboard({ params }: PageProps) {
  const teamData = await getTeamProfile(params.team_id)
  
  if (!teamData || teamData.length === 0) {
    return <div>チームが見つかりません</div>
  }

  const team = teamData[0]

  // 進捗率の計算（仮の値）
  const progress = {
    current: 3000000,
    target: 5000000,
    progressPercentage: 60
  };

  return (
    <div className="p-8 space-y-6">
      {/* チーム情報とKPIのヘッダー部分 */}
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
                1人のメンバーと共に目標達成を目指しています
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
        <CreateProjectSection teamId={params.team_id} />
        <ProjectList teamId={params.team_id} />
      </div>
    </div>
  );
}
