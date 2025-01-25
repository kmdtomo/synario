'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KpiCardProps = {
  category: string;
  kpiDescription: string;
  targetValue: number;
  currentValue: number;
  tasks: {
    total: number;
    completed: number;
  };
  unit?: string;
  gradient: {
    card: string;
    text: string;
    progress: string;
  };
};

export default function KpiCard({
  category,
  kpiDescription,
  targetValue,
  currentValue,
  tasks,
  unit = '',
  gradient
}: KpiCardProps) {
  const progressPercentage = tasks.total > 0 ? Math.round((tasks.completed / tasks.total) * 100) : 0;
  const kpiPercentage = targetValue > 0 ? Math.round((currentValue / targetValue) * 100) : 0;

  // グラデーションの色を直接指定
  const gradientColors: { [key: string]: [string, string] } = {
    '営業': ['rgb(147, 51, 234)', 'rgb(79, 70, 229)'], // purple to indigo
    '開発': ['rgb(6, 182, 212)', 'rgb(59, 130, 246)'],  // cyan to blue
    'マーケティング': ['rgb(244, 63, 94)', 'rgb(249, 115, 22)'] // rose to orange
  };

  return (
    <Card className={`bg-gradient-to-br ${gradient.card} border-0`}>
      <CardHeader>
        <CardTitle className="flex flex-col gap-1">
          <span className={`text-lg font-bold bg-gradient-to-r ${gradient.text} bg-clip-text text-transparent`}>
            {category}
          </span>
          <span className="text-sm font-normal text-gray-500">
            {kpiDescription}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-24 h-24">
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
                <linearGradient id={`${category}-gradient`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={gradientColors[category][0]} />
                  <stop offset="100%" stopColor={gradientColors[category][1]} />
                </linearGradient>
              </defs>
              <circle
                strokeWidth="8"
                strokeLinecap="round"
                stroke={`url(#${category}-gradient)`}
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                strokeDasharray={`${progressPercentage * 2.51} ${100 * 2.51}`}
                strokeDashoffset="0"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className={`text-lg font-bold bg-gradient-to-r ${gradient.text} bg-clip-text text-transparent`}>
                {progressPercentage}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-500">目標</div>
              <div className="text-lg font-bold text-gray-900">
                {targetValue.toLocaleString()}{unit}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">現在</div>
              <div className="text-lg font-bold text-gray-900">
                {currentValue.toLocaleString()}{unit}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">タスク達成率</span>
            <span className="font-medium text-gray-700">{kpiPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${gradient.progress}`}
              style={{ width: `${kpiPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 