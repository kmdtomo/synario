'use client';

import KpiCard from "@/components/modules/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectProfile, Project } from "@/lib/db/project/project";
import { Building2, LineChart, Megaphone, User, Info, X, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { ReactElement, useEffect, useState } from 'react';
import SynarioButton from "@/components/modules/synario/button";
import CreateCard from "@/components/modules/dashboard/CreateCard";
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
      text: "from-[rgb(244,63,94)] to-[rgb(249,115,22)]",
      progress: "from-[rgb(244,63,94)] to-[rgb(249,115,22)]"
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

export default function ProjectPage() {
  const params = useParams()
  const project_id = params["project_id"] as string
 
  const [projectData, setProjectData] = useState<Project[] | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectProfile(project_id);
        if (!data) {
          console.error("プロジェクトが見つかりません");
          return;
        }
        setProjectData(data);
      } catch (error) {
        console.error("プロジェクトの取得に失敗しました", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [project_id]);

  return (
    <div className="p-8 space-y-8">
      {isLoading ? (
        <div>読み込み中...</div>
      ) : projectData?.map((project) => (
        <div key={project.id}>
          {/* ヘッダー部分 */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
            </div>
            <div className="flex gap-4">
              <SynarioButton project={project} />
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
          <Card className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border-0 mb-8">
            <CardHeader>
              <CardTitle className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {project.name}の全体の進捗
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                    <span className="text-sm font-medium text-gray-500">目標：</span>
                    <span className="text-base font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                      {project.goal}
                    </span>
                  </div>
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
                          <div className="space-y-2">
                            {/* タスク名とカテゴリー */}
                            <div className="flex items-center justify-between gap-3 ml-2">
                              <p className="text-base text-gray-900 font-medium truncate">
                                {task.name}
                              </p>
                              <span className={`px-2 rounded-full text-base font-medium bg-gradient-to-r ${task.gradient} bg-clip-text text-transparent border border-current shrink-0`}>
                                {task.category}
                              </span>
                            </div>

                            {/* 担当者、優先度、ステータス */}
                            <div className="flex items-center gap-2">
                              {/* 担当者 */}
                              <div className="flex items-center gap-2 bg-gray-50 px-2 py-0.5 rounded-full mr-2">
                                {task.assignee.avatar ? (
                                  <img
                                    src={task.assignee.avatar}
                                    alt={task.assignee.name}
                                    className="w-5 h-5 rounded-full"
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-gray-500" />
                                )}
                                <span className="text-xs text-gray-700">{task.assignee.name}</span>
                              </div>

                              {/* 優先度 */}
                              <div className="flex items-center gap-2 bg-gray-50 px-2 py-0.5 rounded-full mr-2">
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 個別のKPIカード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoData.map((kpi) => (
              <div key={kpi.category}>
                <KpiCard {...kpi} />
              </div>
            ))}
            <div>
              <Card className="h-full bg-white hover:bg-gray-50/50 transition-colors">
             
                  <CreateCard />
    
              </Card>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
