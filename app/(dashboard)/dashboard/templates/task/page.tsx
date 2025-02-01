'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, LineChart, Megaphone, Info, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";

// タスクの型定義
type Task = {
  id: string;
  title: string;
  category: "営業" | "開発" | "マーケティング";
  priority: "high" | "medium" | "low";
  createdAt: string;
  creator: {
    name: string;
    avatar?: string;
  };
  assignee: {
    name: string;
    avatar?: string;
  };
};

// カンバンカラムの型定義
type Column = {
  id: "todo" | "doing" | "done";
  title: string;
  tasks: Task[];
};

// KPIの型定義を追加
type KpiData = {
  category: string;
  kpiDescription: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  gradient: {
    card: string;
    text: string;
    progress: string;
  };
};

// 担当者リストの型定義を追加
type Member = {
  id: string;
  name: string;
  avatar?: string;
};

// 担当者のデモデータ
const members: Member[] = [
  { id: "1", name: "山田花子", avatar: "/avatars/user1.png" },
  { id: "2", name: "鈴木花子", avatar: "/avatars/user2.png" },
  { id: "3", name: "佐藤次郎", avatar: "/avatars/user3.png" },
  { id: "4", name: "田中明", avatar: "/avatars/user4.png" },
  { id: "5", name: "山田太郎", avatar: "/avatars/user5.png" },
];

// デモデータ
const columns: Column[] = [
  {
    id: "todo",
    title: "ToDo",
    tasks: [
      {
        id: "1",
        title: "新規顧客商談",
        category: "営業",
        priority: "high",
        createdAt: "2024-03-25T10:00:00",
        creator: { name: "田中太郎", avatar: "/avatars/creator1.png" },
        assignee: { name: "山田花子", avatar: "/avatars/user1.png" }
      },
      {
        id: "2",
        title: "市場調査",
        category: "マーケティング",
        priority: "medium",
        createdAt: "2024-03-28T10:00:00",
        creator: { name: "鈴木花子", avatar: "/avatars/creator2.png" },
        assignee: { name: "鈴木花子", avatar: "/avatars/user2.png" }
      }
    ]
  },
  {
    id: "doing",
    title: "Doing",
    tasks: [
      {
        id: "3",
        title: "要件定義",
        category: "開発",
        priority: "low",
        createdAt: "2024-03-25T10:00:00",
        creator: { name: "佐藤次郎", avatar: "/avatars/creator3.png" },
        assignee: { name: "佐藤次郎", avatar: "/avatars/user3.png" }
      },
      {
        id: "4",
        title: "広告配信",
        category: "マーケティング",
        priority: "medium",
        createdAt: "2024-03-28T10:00:00",
        creator: { name: "田中明", avatar: "/avatars/creator4.png" },
        assignee: { name: "田中明", avatar: "/avatars/user4.png" }
      }
    ]
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "5",
        title: "提案書作成",
        category: "営業",
        priority: "high",
        createdAt: "2024-03-25T10:00:00",
        creator: { name: "山田太郎", avatar: "/avatars/creator5.png" },
        assignee: { name: "山田太郎", avatar: "/avatars/user5.png" }
      }
    ]
  }
];

// KPIデータを更新
const kpiData: KpiData = {
  category: "営業",
  kpiDescription: "月間売上目標達成",
  targetValue: 1000000,
  currentValue: 750000,
  unit: "円",
  gradient: {
    card: "from-emerald-500/5 to-green-500/5",
    text: "from-emerald-600 to-green-600",
    progress: "from-emerald-600 to-green-600"
  }
};

// 営業タスクのみにフィルター
const salesTasks = {
  todo: columns[0].tasks.filter(task => task.category === "営業"),
  doing: columns[1].tasks.filter(task => task.category === "営業"),
  done: columns[2].tasks.filter(task => task.category === "営業")
};

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "ToDo",
    tasks: salesTasks.todo
  },
  {
    id: "doing",
    title: "Doing",
    tasks: salesTasks.doing
  },
  {
    id: "done",
    title: "Done",
    tasks: salesTasks.done
  }
];

// カテゴリーごとのグラデーション設定
const categoryGradients: Record<string, string> = {
  "営業": "from-emerald-600 to-green-600",
  "開発": "from-cyan-600 to-blue-600",
  "マーケティング": "from-rose-600 to-orange-600"
};

// 優先度ごとのスタイル設定
const priorityStyles: Record<string, { color: string; label: string }> = {
  "high": { color: "text-rose-600 bg-rose-50", label: "高" },
  "medium": { color: "text-amber-600 bg-amber-50", label: "中" },
  "low": { color: "text-green-600 bg-green-50", label: "低" }
};

export default function TaskTemplate() {
  const [columnData, setColumnData] = useState(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium" as "high" | "medium" | "low",
    assigneeId: "",
    description: "",
    dueDate: ""
  });

  // 進捗率を計算
  const progressPercentage = (kpiData.currentValue / kpiData.targetValue) * 100;

  // 全タスクの合計を計算
  const totalTasks = salesTasks.todo.length + salesTasks.doing.length + salesTasks.done.length;
  const completedTasks = salesTasks.done.length;
  const totalProgress = Math.round((completedTasks / totalTasks) * 100) || 0;

  // 直近のタスクを取得（未完了のタスクを優先）
  const recentTasks = [
    ...salesTasks.todo,
    ...salesTasks.doing,
    ...salesTasks.done
  ].slice(0, 4);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // ドロップ先がない場合は何もしない
    if (!destination) return;

    // 同じ場所にドロップした場合は何もしない
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // 移動元と移動先のカラムを取得
    const sourceColumn = columnData.find(col => col.id === source.droppableId);
    const destColumn = columnData.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // 同じカラム内での移動
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      const newColumns = columnData.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: newTasks };
        }
        return col;
      });

      setColumnData(newColumns);
    } else {
      // 異なるカラム間での移動
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      const newColumns = columnData.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      setColumnData(newColumns);
    }
  };

  const handleAddTask = () => {
    if (!selectedColumn || !newTask.title || !newTask.assigneeId) return;

    const assignee = members.find(m => m.id === newTask.assigneeId);
    if (!assignee) return;

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      category: "営業",
      priority: newTask.priority,
      createdAt: new Date().toISOString(),
      creator: { name: "現在のユーザー" },
      assignee: {
        name: assignee.name,
        avatar: assignee.avatar
      }
    };

    // タスクを作成日時の降順でソート
    const newColumns = columnData.map(col => {
      if (col.id === selectedColumn) {
        const updatedTasks = [...col.tasks, task].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return {
          ...col,
          tasks: updatedTasks
        };
      }
      return col;
    });

    setColumnData(newColumns);
    setNewTask({
      title: "",
      priority: "medium",
      assigneeId: "",
      description: "",
      dueDate: ""
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            チームシナリオ
          </h1>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            営業タスク管理
          </h2>
        </div>
        <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-emerald-700 hover:to-green-700 transition-colors flex items-center gap-2">
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
          タスクを追加
        </button>
      </div>

      {/* プロジェクト全体の進捗カード */}
      <Card className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border-0">
        <CardHeader>
          <CardTitle className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  プロジェクト全体の進捗
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500">達成状況</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {kpiData.currentValue.toLocaleString()}
                    <span className="text-lg ml-1">{kpiData.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">目標</p>
                  <p className="text-xl font-medium text-gray-700">
                    {kpiData.targetValue.toLocaleString()}
                    <span className="text-sm ml-1">{kpiData.unit}</span>
                  </p>
                </div>
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
                  stroke="url(#progress-gradient)"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${progressPercentage * 2.51} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(progressPercentage)}%
                  </p>
                  <p className="text-xs text-gray-500">達成率</p>
                </div>
              </div>
            </div>

            {/* タスクリスト */}
            <div className="flex-1 space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    {task.assignee.avatar ? (
                      <img
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority].color}`}>
                        {priorityStyles[task.priority].label}
                      </div>
                      <span className="text-xs text-gray-500">
                        担当: {task.assignee.name}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      task.category === "営業" ? "text-emerald-600 bg-emerald-50" :
                      task.category === "開発" ? "text-blue-600 bg-blue-50" :
                      "text-orange-600 bg-orange-50"
                    }`}>
                      {task.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* カンバンボード */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {columnData.map((column) => (
            <div key={column.id} className="bg-gray-50/80 rounded-xl p-4">
              {/* カラムヘッダー */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {column.id === "todo" ? "ToDo" :
                     column.id === "doing" ? "Doing" :
                     "Done"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-sm bg-gradient-to-r from-purple-600/10 to-indigo-600/10 text-purple-700">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
                    />
                  </svg>
                </button>
              </div>

              {/* タスク追加ボタン */}
              <button 
                onClick={() => {
                  setSelectedColumn(column.id);
                  setIsModalOpen(true);
                }}
                className="w-full py-2 px-3 mb-3 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
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
                タスクを追加
              </button>

              {/* タスクリスト */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[480px] max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transform transition-all ${
                              snapshot.isDragging ? 'scale-105 rotate-1' : ''
                            }`}
                          >
                            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    {task.assignee.avatar ? (
                                      <img
                                        src={task.assignee.avatar}
                                        alt={task.assignee.name}
                                        className="w-full h-full rounded-full"
                                      />
                                    ) : (
                                      <User className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {task.title}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 pl-1">
                                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority].color}`}>
                                    {priorityStyles[task.priority].label}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    担当: {task.assignee.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* タスク追加モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                新規タスクの追加
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    タスク名
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                    placeholder="タスク名を入力"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      優先度
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as "high" | "medium" | "low" })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                    >
                      <option value="high">高</option>
                      <option value="medium">中</option>
                      <option value="low">低</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      締切日
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    担当者
                  </label>
                  <select
                    value={newTask.assigneeId}
                    onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                  >
                    <option value="">担当者を選択</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    タスク詳細
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors min-h-[100px] resize-none"
                    placeholder="タスクの詳細を入力"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
