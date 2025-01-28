'use client';

import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";

// タスクの型定義
type Task = {
  id: string;
  title: string;
  category: "営業" | "開発" | "マーケティング";
  priority: "high" | "medium" | "low";
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
        creator: { name: "田中太郎", avatar: "/avatars/creator1.png" },
        assignee: { name: "山田花子", avatar: "/avatars/user1.png" }
      },
      {
        id: "2",
        title: "市場調査",
        category: "マーケティング",
        priority: "medium",
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
        creator: { name: "佐藤次郎", avatar: "/avatars/creator3.png" },
        assignee: { name: "佐藤次郎", avatar: "/avatars/user3.png" }
      },
      {
        id: "4",
        title: "広告配信",
        category: "マーケティング",
        priority: "medium",
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
        creator: { name: "山田太郎", avatar: "/avatars/creator5.png" },
        assignee: { name: "山田太郎", avatar: "/avatars/user5.png" }
      }
    ]
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
  const [columnData, setColumnData] = useState(columns);

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

  return (
    <div className="p-8 space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            チームシナリオ
          </h1>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            タスク管理
          </h2>
        </div>
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
          タスクを追加
        </button>
      </div>

      {/* カンバンボード */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="overflow-x-auto">
          <div className="inline-flex gap-6 min-w-[1200px] pb-4">
            {columnData.map((column) => (
              <div key={column.id} className="flex-1 space-y-4 min-w-[400px]">
                {/* カラムヘッダー */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-700">
                    {column.title}
                    <span className="ml-2 text-sm text-gray-500">
                      {column.tasks.length}
                    </span>
                  </h3>
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

                {/* タスクカードのコンテナ */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 p-3 rounded-lg min-h-[500px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-gray-100' : 'bg-gray-50'
                      }`}
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
                              <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-3">
                                  <div className="relative pl-12">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                      {task.creator.avatar ? (
                                        <img
                                          src={task.creator.avatar}
                                          alt={task.creator.name}
                                          className="w-full h-full rounded-full"
                                        />
                                      ) : (
                                        <User className="w-6 h-6 text-gray-500" />
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm text-gray-900 font-medium truncate">
                                          {task.title}
                                        </p>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${categoryGradients[task.category]} bg-clip-text text-transparent border border-current shrink-0`}>
                                          {task.category}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 bg-gray-50 px-2 py-0.5 rounded-full">
                                          <span className="text-xs text-gray-500">担当:</span>
                                          <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center" title={task.assignee.name}>
                                              {task.assignee.avatar ? (
                                                <img
                                                  src={task.assignee.avatar}
                                                  alt={task.assignee.name}
                                                  className="w-full h-full rounded-full"
                                                />
                                              ) : (
                                                <User className="w-2.5 h-2.5 text-gray-400" />
                                              )}
                                            </div>
                                            <span className="text-xs text-gray-700">{task.assignee.name}</span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 bg-gray-50 px-2 py-0.5 rounded-full">
                                          <span className="text-xs text-gray-500">優先度:</span>
                                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority].color}`}>
                                            {priorityStyles[task.priority].label}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
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
        </div>
      </DragDropContext>
    </div>
  );
}
