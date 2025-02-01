'use client';

import KpiCard from "@/components/modules/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, LineChart, Megaphone, User, Info, X } from "lucide-react";
import { ReactElement, useState } from 'react';
import { Modal } from "@/components/ui/common/modal";

// アバターの型を定義
type TaskWithAvatar = {
  name: string;
  completed: boolean;
  priority?: "high" | "medium" | "low";
  assignee: {
    name: string;
    avatar?: string;
  };
};

const demoData = [
  {
    category: "営業",
    kpiDescription: "月間売上目標達成",
    targetValue: 1000000,
    currentValue: 750000,
    tasks: {
      total: 10,
      completed: 7,
      list: [
        { 
          name: "新規顧客商談", 
          completed: true,
          assignee: {
            name: "山田太郎",
            avatar: "/avatars/user1.png"
          }
        },
        { 
          name: "提案書作成", 
          completed: true,
          assignee: {
            name: "鈴木花子",
            avatar: "/avatars/user2.png"
          }
        },
        { 
          name: "見積書送付", 
          completed: false,
          assignee: {
            name: "佐藤次郎",
            avatar: "/avatars/user3.png"
          }
        }
      ] as TaskWithAvatar[]
    },
    unit: "円",
    gradient: {
      card: "from-emerald-500/5 to-green-500/5",
      text: "from-emerald-600 to-green-600",
      progress: "from-emerald-600 to-green-600"
    }
  },
  {
    category: "開発",
    kpiDescription: "プロジェクト進捗率",
    targetValue: 100,
    currentValue: 65,
    tasks: {
      total: 20,
      completed: 13,
      list: [
        { name: "要件定義", completed: true },
        { name: "設計", completed: true },
        { name: "実装", completed: false }
      ]
    },
    unit: "%",
    gradient: {
      card: "from-cyan-500/5 to-blue-500/5",
      text: "from-cyan-600 to-blue-600",
      progress: "from-cyan-600 to-blue-600"
    }
  },
  {
    category: "マーケティング",
    kpiDescription: "新規リード獲得数",
    targetValue: 1000,
    currentValue: 580,
    tasks: {
      total: 15,
      completed: 9,
      list: [
        { name: "市場調査", completed: true },
        { name: "広告配信", completed: true },
        { name: "効果測定", completed: false }
      ]
    },
    unit: "件",
    gradient: {
      card: "from-rose-500/5 to-orange-500/5",
      text: "from-rose-600 to-orange-600",
      progress: "from-rose-600 to-orange-600"
    }
  }
];

// 全体の進捗を計算
const totalTasks = demoData.reduce((acc, kpi) => acc + kpi.tasks.total, 0);
const completedTasks = demoData.reduce((acc, kpi) => acc + kpi.tasks.completed, 0);
const totalProgress = Math.round((completedTasks / totalTasks) * 100);

// 全てのタスクを1つの配列にまとめる
const allTasks = demoData.flatMap(kpi => 
  kpi.tasks.list.map(task => ({
    ...task,
    category: kpi.category,
    gradient: kpi.gradient.text,
    priority: "medium", // デフォルト値を設定
    assignee: {
      name: "山田太郎",
      avatar: "/avatars/user1.png"
    }
  }))
);

// 未完了のタスクを優先的に表示
const recentTasks = allTasks
  .sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1)
  .slice(0, 4);

// カテゴリーごとのアイコンマッピングの型を定義
type CategoryIconsType = {
  [key in "営業" | "開発" | "マーケティング"]: ReactElement;
};

const categoryIcons: CategoryIconsType = {
  "営業": <Building2 className="w-4 h-4" />,
  "開発": <LineChart className="w-4 h-4" />,
  "マーケティング": <Megaphone className="w-4 h-4" />
};

// 優先度の定義を追加
const priorityStyles: Record<string, { color: string; label: string }> = {
  "high": { color: "text-rose-600 bg-rose-50", label: "高" },
  "medium": { color: "text-amber-600 bg-amber-50", label: "中" },
  "low": { color: "text-green-600 bg-green-50", label: "低" }
};

export default function KpiTemplate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            チームシナリオ
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Synario
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center gap-2">
            <svg 
              className="w-4 h-4" 
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
            KPIカードを作る
          </button>
        </div>
      </div>

      {/* プロジェクト全体の進捗カード */}
      <Card className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border-0">
        <CardHeader>
          <CardTitle className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                プロジェクト全体の進捗
              </span>
            </div>
            <span className="text-sm font-normal text-gray-500">
              全タスク: {completedTasks}/{totalTasks}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-8">
            {/* 円グラフ */}
            <div className="relative w-32 h-32 shrink-0">
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
                  strokeDasharray={`${totalProgress * 2.51} ${100 * 2.51}`}
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {totalProgress}%
                </div>
              </div>
            </div>

            {/* 直近のタスク */}
            <div className="flex-1 h-32 overflow-auto">
              <h3 className="text-sm font-medium text-gray-500 mb-3">直近のタスク</h3>
              <div className="space-y-2">
                {recentTasks.map((task, index) => (
                  <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="relative pl-12">
                        {/* アバター画像を絶対位置で配置 */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                          {task.assignee.avatar ? (
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              className="w-full h-full rounded-full"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-500" />
                          )}
                        </div>

                        <div className="space-y-2">
                          {/* タスク名とカテゴリー */}
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm text-gray-900 font-medium truncate">
                              {task.name}
                            </p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${task.gradient} bg-clip-text text-transparent border border-current shrink-0`}>
                              {task.category}
                            </span>
                          </div>

                          {/* 担当者、優先度、ステータス */}
                          <div className="flex items-center gap-2">
                            {/* 担当者 */}
                            <div className="flex items-center gap-2 bg-gray-50 px-2 py-0.5 rounded-full">
                              <span className="text-xs text-gray-500">担当:</span>
                              <span className="text-xs text-gray-700">{task.assignee.name}</span>
                            </div>

                            {/* 優先度 */}
                            <div className="flex items-center gap-2 bg-gray-50 px-2 py-0.5 rounded-full">
                              <span className="text-xs text-gray-500">優先度:</span>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority || 'medium'].color}`}>
                                {priorityStyles[task.priority || 'medium'].label}
                              </div>
                            </div>

                            {/* ステータス */}
                            <div className="flex items-center gap-2 bg-gray-50 px-2 py-0.5 rounded-full">
                              <span className="text-xs text-gray-500">状態:</span>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.completed 
                                  ? 'text-green-600 bg-green-50' 
                                  : 'text-amber-600 bg-amber-50'
                              }`}>
                                {task.completed ? '完了' : '進行中'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synarioスライドオーバー */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-8">
              {/* ステップバー */}
              <div className="relative mb-12">
                <div className="absolute top-5 w-full h-0.5 bg-gray-200">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  />
                </div>
                <div className="relative flex justify-between">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs mb-2 transition-all duration-300 ${
                          step === currentStep
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-110'
                            : step < currentStep
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                            : 'bg-white text-gray-400 border-2 border-gray-200'
                        }`}
                      >
                        {step}
                      </div>
                      <span className={`text-sm font-bold tracking-wider ${
                        step === currentStep 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent scale-105'
                          : step < currentStep
                          ? 'text-purple-600'
                          : 'text-gray-400'
                      }`}>
                        {step === 1 ? 'Trigger' : step === 2 ? 'Vision' : step === 3 ? 'Unite' : 'Achieve'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Step Content */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        なぜこのプロジェクトをするのか？
                      </h2>
                      <p className="text-sm text-gray-600">
                        現在の課題や燃える理由、衝動、スタートのきっかけ
                      </p>
                    </div>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-6">
                      <p className="text-gray-700">
                        現在の課題や燃える理由、衝動、スタートのきっかけを明確にします。
                        日々の業務に追われ、本来やるべきことができていない状況が続いています。
                        情報共有の遅れや重複作業により、チームの力が十分に発揮できていないことに課題を感じています。
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        プロジェクトの完成形？
                      </h2>
                      <p className="text-sm text-gray-600">
                        理想の姿やゴールイメージ
                      </p>
                    </div>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-6">
                      <p className="text-gray-700">
                        理想の姿やゴールイメージを描きます。
                        メンバー全員が目的を理解し、自主的に行動できる組織になっています。
                        無駄な作業が削減され、本来注力すべき業務に時間を使えるようになっています。
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        チームをどう巻き込むか？
                      </h2>
                      <p className="text-sm text-gray-600">
                        当事者意識を高め、メンバーが自分事として取り組む仕掛けや工夫
                      </p>
                    </div>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-6">
                      <p className="text-gray-700">
                        当事者意識を高め、メンバーが自分事として取り組む仕掛けや工夫を考えます。
                        定期的な振り返りの場を設け、メンバー全員が改善案を出し合える機会を作ります。
                        小さな成功体験を共有し、チーム全体のモチベーション向上につなげていきます。
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        プロジェクト成功した後の世界？
                      </h2>
                      <p className="text-sm text-gray-600">
                        プロジェクトがうまくいったときの勝利のイメージや喜びの場面
                      </p>
                    </div>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-6">
                      <p className="text-gray-700">
                        プロジェクトがうまくいったときの勝利のイメージや喜びの場面を描きます。
                        メンバーから自発的な改善提案が日常的に出るようになり、業務効率が大きく向上しています。
                        チーム全体が活気にあふれ、新しいチャレンジに積極的に取り組んでいます。
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={handlePrev}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentStep === 1
                        ? 'opacity-0 pointer-events-none'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    disabled={currentStep === 1}
                  >
                    前へ
                  </button>
                  <button
                    onClick={handleNext}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentStep === totalSteps
                        ? 'opacity-0 pointer-events-none'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                    }`}
                    disabled={currentStep === totalSteps}
                  >
                    次へ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 個別のKPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoData.map((kpi) => (
          <div key={kpi.category}>
            <KpiCard {...kpi} />
          </div>
        ))}
      </div>
    </div>
  );
}
