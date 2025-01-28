'use client';

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Target, Lightbulb, Users } from "lucide-react";
import { useState } from "react";

export default function CreateProject() {
  // 文字数の状態管理
  const [vision, setVision] = useState("");
  const [trigger, setTrigger] = useState("");
  const [goalBefore, setGoalBefore] = useState("");
  const [goalAfter, setGoalAfter] = useState("");
  const [ownership, setOwnership] = useState("");

  // 文字数制限
  const LIMITS = {
    vision: 200,
    trigger: 400,
    goal: 100,
    ownership: 300
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
          新規プロジェクト作成
        </h1>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          社内の課題解決や業務改善に向けて、チーム全員で取り組むプロジェクトを作成しましょう。
        </p>
      </div>

      {/* プロジェクト作成フォーム */}
      <Card className="bg-gray-50/50 border border-gray-100 shadow-xl">
        <CardContent className="p-8 space-y-10">
          {/* プロジェクトの基本情報 */}
          <div className="space-y-8">
            {/* ビジョン */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <svg
                  className="w-5 h-5 text-purple-500"
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
                <label className="text-xl font-bold text-gray-900">
                  ビジョン（どんな未来を目指す？）
                </label>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="space-y-2">
                  <textarea
                    value={vision}
                    onChange={(e) => setVision(e.target.value.slice(0, LIMITS.vision))}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 min-h-[100px] resize-y"
                    placeholder="例：全員が同じ目標に向かって、自主的に行動できる組織を目指します。メンバー一人一人の意見が尊重され、より良い職場環境を作っていきます。"
                  />
                  <p className="text-sm text-gray-500 text-right">
                    {vision.length} / {LIMITS.vision}文字
                  </p>
                </div>
              </div>
            </div>

            {/* きっかけ */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <svg
                  className="w-5 h-5 text-purple-500"
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
                <label className="text-xl font-bold text-gray-900">
                  きっかけ（なぜ必要？）
                </label>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="space-y-2">
                  <textarea
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value.slice(0, LIMITS.trigger))}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 min-h-[100px] resize-y"
                    placeholder="例：業務の効率化が課題となっています。情報共有の遅れや重複作業が発生しており、チーム全体の生産性に影響が出ています。この状況を改善し、より良い職場にしていく必要があります。"
                  />
                  <p className="text-sm text-gray-500 text-right">
                    {trigger.length} / {LIMITS.trigger}文字
                  </p>
                </div>
              </div>
            </div>

            {/* ゴール */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <svg
                  className="w-5 h-5 text-purple-500"
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
                <label className="text-xl font-bold text-gray-900">
                  ゴール（何が変わる？）
                </label>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 mb-2">Before</h4>
                    <div className="space-y-2">
                      <textarea
                        value={goalBefore}
                        onChange={(e) => setGoalBefore(e.target.value.slice(0, LIMITS.goal))}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 min-h-[120px] resize-y"
                        placeholder="・業務効率が悪く、時間がかかっている"
                      />
                      <p className="text-sm text-gray-500 text-right">
                        {goalBefore.length} / {LIMITS.goal}文字
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 mb-2">After</h4>
                    <div className="space-y-2">
                      <textarea
                        value={goalAfter}
                        onChange={(e) => setGoalAfter(e.target.value.slice(0, LIMITS.goal))}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 min-h-[120px] resize-y"
                        placeholder="・効率的な業務フローが確立されている"
                      />
                      <p className="text-sm text-gray-500 text-right">
                        {goalAfter.length} / {LIMITS.goal}文字
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 当事者意識 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <svg
                  className="w-5 h-5 text-purple-500"
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
                <label className="text-xl font-bold text-gray-900">
                  当事者意識（メンバーへの期待）
                </label>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="space-y-2">
                  <textarea
                    value={ownership}
                    onChange={(e) => setOwnership(e.target.value.slice(0, LIMITS.ownership))}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 min-h-[120px] resize-y"
                    placeholder="例：
・気づいた課題は積極的に共有する
・チーム全体の目標を意識して行動する
・建設的な意見を出し合う"
                  />
                  <p className="text-sm text-gray-500 text-right">
                    {ownership.length} / {LIMITS.ownership}文字
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 作成ボタン */}
          <div className="flex justify-center pt-6">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-3 rounded-xl text-base font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              プロジェクトを作成する
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
