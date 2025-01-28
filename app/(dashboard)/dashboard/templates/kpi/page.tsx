'use client';

import KpiCard from "@/components/modules/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, LineChart, Megaphone, User, Info } from "lucide-react";
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 right-0 w-full max-w-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl">
            <div className="h-full p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Synario</h2>
                  <p className="text-white text-sm">プロジェクトの背景とチームの目指す未来</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-8">
                {/* ビジョン */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-b border-white/30 pb-2 flex items-center gap-2 text-white">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                    ビジョン（どんな未来を目指す？）
                  </h3>
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 space-y-4">
                    <p className="text-white">
                      メンバー一人一人が主体性を持ち、自律的に行動できる組織を目指します。
                      全員が目的を理解し、共に成長しながら、より良い未来を創造していく組織へと進化します。
                    </p>
                  </div>
                </div>

                {/* きっかけ */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-b border-white/30 pb-2 flex items-center gap-2 text-white">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    きっかけ（なぜ必要？）
                  </h3>
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 space-y-4">
                    <p className="text-white">
                      業務効率化や生産性向上が求められる中、部門間の連携不足や情報共有の遅れが目立ってきています。
                      特に、営業部門と製造部門の連携、バックオフィスと現場の情報共有など、組織の成長に伴う課題が増えています。
                      この状況を改善し、より効率的で活気のある職場を作るために、新しい取り組みが必要となりました。
                    </p>
                  </div>
                </div>

                {/* ゴール */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-b border-white/30 pb-2 flex items-center gap-2 text-white">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                      />
                    </svg>
                    ゴール（何が変わる？）
                  </h3>
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 p-4 bg-white/10 rounded-lg border border-white/10">
                        <h4 className="font-semibold text-white">Before</h4>
                        <ul className="list-disc list-inside space-y-1 text-white">
                          <li>部門間の情報共有の遅れ</li>
                          <li>業務の属人化</li>
                          <li>非効率な会議や重複作業</li>
                          <li>改善提案の機会不足</li>
                        </ul>
                      </div>
                      <div className="space-y-2 p-4 bg-white/10 rounded-lg border border-white/10">
                        <h4 className="font-semibold text-white">After</h4>
                        <ul className="list-disc list-inside space-y-1 text-white">
                          <li>スムーズな情報共有</li>
                          <li>標準化された業務フロー</li>
                          <li>効率的な会議運営</li>
                          <li>活発な改善活動</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 当事者意識 */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-b border-white/30 pb-2 flex items-center gap-2 text-white">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    当事者意識（メンバーへの期待）
                  </h3>
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 space-y-4">
                    <div className="space-y-4">
                      <p className="text-white">
                        業務改善の成功には、メンバー一人一人の積極的な参加が不可欠です。
                        以下のような行動を期待しています：
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-white">
                        <li>日々の業務で気づいた改善点を積極的に共有する</li>
                        <li>部門の垣根を越えて、お互いの業務を理解し合う</li>
                        <li>定例ミーティングで建設的な意見を出し合う</li>
                        <li>新しい業務プロセスの定着に協力する</li>
                      </ul>
                    </div>
                  </div>
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
