"use client"

interface ProjectListProps {
  teamId: string;
}

export default function ProjectList({ teamId }: ProjectListProps) {
  return (
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
  )
}