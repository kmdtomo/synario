import { Button } from "@/components/ui/common/button";
import { Plus } from "lucide-react";

export default function CreateCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          KPIを作成
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
          新しいKPIを追加
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          プロジェクトの新しい目標を設定しましょう
        </p>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors">
          KPIを作成
        </button>
      </div>
    </div>
  );
}
