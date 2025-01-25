'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const funnelData = [
  { stage: '見込み顧客', current: 100, target: 120, rate: '83%' },
  { stage: '商談中', current: 60, target: 80, rate: '75%' },
  { stage: '提案書提出', current: 40, target: 50, rate: '80%' },
  { stage: 'クロージング', current: 20, target: 30, rate: '67%' },
];

export default function SalesTemplate() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          セールスパイプライン
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {funnelData.map((stage, index) => (
          <Card key={stage.stage} className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border-0">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-700">
                {stage.stage}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-8">
                {/* 円グラフ */}
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
                    <circle
                      className="text-transparent stroke-[url(#gradientProgress)]"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="url(#gradientProgress)"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      strokeDasharray={`${parseInt(stage.rate) * 2.51} ${100 * 2.51}`}
                      strokeDashoffset="0"
                    />
                    <defs>
                      <linearGradient id="gradientProgress" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {stage.rate}
                    </div>
                  </div>
                </div>

                {/* 数値情報 */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">現在</div>
                    <div className="text-2xl font-bold text-gray-900">{stage.current}件</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">目標</div>
                    <div className="text-lg font-medium text-gray-600">{stage.target}件</div>
                  </div>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="mt-4">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
                    style={{ width: stage.rate }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 