'use client';

import { Card, CardContent } from "@/components/ui/card";
import { createProject } from "@/lib/db/project/create";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProject() {
  const params = useParams()
  const team_id = params["team_id"] as string

  const router = useRouter()

  // 文字数の状態管理
  const [trigger, setTrigger] = useState("");
  const [vision, setVision] = useState("");
  const [unite, setUnite] = useState("");
  const [achieve, setAchieve] = useState("");
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("")
  const [currentStep, setCurrentStep] = useState(1);

  const handleCreateProject = async(e:React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try{
      const project = await createProject({
        team_id,
        name,
        trigger,
        vision,
        unite,
        achieve,
        goal,
      })
      
      if(project.id){
        router.push(`/dashboard/${team_id}/project/${project.id}`)
      }
      
    }catch(error){
      console.error("プロジェクト作成失敗",{error})
    }
  }

  // 文字数制限
  const LIMIT = 300;
  const GOAL_LIMIT = 50;

  // ステップの定義
  const steps = [
    {
      id: 1,
      name: 'Trigger',
      title: 'なぜこのプロジェクトをするのか？',
      description: '現在の課題や燃える理由、衝動、スタートのきっかけ',
      value: trigger,
      setValue: setTrigger,
    },
    {
      id: 2,
      name: 'Vision',
      title: 'プロジェクトの完成形？',
      description: '理想の姿やゴールイメージ',
      value: vision,
      setValue: setVision,
    },
    {
      id: 3,
      name: 'Unite',
      title: 'チームをどう巻き込むか？',
      description: '当事者意識を高め、メンバーが自分事として取り組む仕掛けや工夫',
      value: unite,
      setValue: setUnite,
    },
    {
      id: 4,
      name: 'Achieve',
      title: 'プロジェクト成功した後の世界？',
      description: 'プロジェクトがうまくいったときの勝利のイメージや喜びの場面',
      value: achieve,
      setValue: setAchieve,
    }
  ];

  const currentStepData = steps[currentStep - 1];

  // 次のステップへ
  const handleNext = () => {
    if (currentStep <= steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // 前のステップへ
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-16 space-y-8 mx-auto">
      {/* ヘッダー */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
          新規プロジェクト作成
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
          プロジェクトの本質的な価値を見つめ直し、チーム全員で共有できるストーリーを作成しましょう。
        </p>
      </div>

      {/* ステップバー */}
      <div className="relative">
        <div className="absolute top-5 w-[calc(100%-2rem)] h-0.5 bg-gray-200 left-4">
          <div 
            className="absolute h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
            style={{ 
              width: currentStep > steps.length ? '100%' : `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center w-24">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs mb-2 transition-all duration-300 bg-white ${
                  currentStep > steps.length ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' :
                  step.id === currentStep
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-110'
                    : step.id < currentStep
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {step.id}
              </div>
              <span className={`text-sm font-bold tracking-wider text-center ${
                currentStep > steps.length ? 'text-purple-600' :
                step.id === currentStep 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent scale-105'
                  : step.id < currentStep
                  ? 'text-purple-600'
                  : 'text-gray-400'
              }`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* フォーム */}
      {currentStep <= steps.length ? (
        <Card className="bg-gray-50/50 border border-gray-100 shadow-md mt-8">
          <CardContent className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* ステップタイトル */}
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {currentStepData.description}
                </p>
              </div>

              {/* 入力フィールド */}
              <div className="space-y-2">
                <textarea
                  value={currentStepData.value}
                  onChange={(e) => currentStepData.setValue(e.target.value.slice(0, LIMIT))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 min-h-[160px] resize-y"
                  placeholder={currentStepData.description}
                />
                <p className="text-xs text-gray-500 text-right">
                  {currentStepData.value.length} / {LIMIT}文字
                </p>
              </div>

              {/* ナビゲーションボタン */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBack}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentStep === 1
                      ? 'opacity-0 pointer-events-none'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  前へ
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                >
                  次へ
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // 目標入力画面
        <Card className="bg-white border border-gray-100 shadow-md mt-8">
          <CardContent className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-900">
                  プロジェクト名
                </h2>
                <p className="text-sm text-gray-600">
                  プロジェクト名を入力してください
                </p>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, GOAL_LIMIT))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="プロジェクト名を入力してください"
                />
                <p className="text-xs text-gray-500 text-right">
                  {name.length} / {GOAL_LIMIT}文字
                </p>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-900">
                  プロジェクトの目標
                </h2>
                <p className="text-sm text-gray-600">
                  これまでのストーリーを踏まえて、プロジェクトの目指す最終目標を一言で表現してください
                </p>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value.slice(0, GOAL_LIMIT))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 text-right">
                  {goal.length} / {GOAL_LIMIT}文字
                </p>
              </div>
              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300"
                >
                  前へ
                </button>
                <button
                onClick={handleCreateProject}
                  className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  プロジェクトを作成
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
