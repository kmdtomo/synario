"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/common/button";
import { ProgressSteps } from "@/components/ui/form/progress-steps";
import { createTeam } from "@/action/supabase/team/actions";
import { ErrorModal } from "@/components/ui/common/error-modal";
import { Modal } from "@/components/ui/common/modal";

export default function TeamSetup() {
  const [teamName, setTeamName] = useState("");
  const [kpi, setKpi] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showKpiModal, setShowKpiModal] = useState(false);
  const router = useRouter();
  const KPI_MAX_LENGTH = 30;  // 30文字を上限に設定

  const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (kpi.length > KPI_MAX_LENGTH) {
      setErrorMessage('KPIは30文字以内で設定してください');
      return;
    }
    setLoading(true);

    try {
      const result = await createTeam({
        name: teamName,
        kpi: kpi,
      });

      if (result.success) {
        router.push(`/dashboard/${result.teamId}`);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 overflow-hidden">
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      <Modal
        isOpen={showKpiModal}
        onClose={() => setShowKpiModal(false)}
        title="KPIの本質とは？"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-gray-500 text-sm leading-relaxed">
              KPIとは、<span className="font-bold text-base text-indigo-600">「最も注力すべき指標」</span>をあえてひとつに絞り込み、組織やプロジェクトの成果を加速させるための羅針盤です。
            </p>
            <div className="pl-4 border-l-4 border-indigo-200 py-1">
              <p className="text-gray-500 text-sm leading-relaxed">
                膨大な数字すべてを追うのではなく、<span className="font-bold text-base text-indigo-600"><br />「本当に大事な一つのメトリクス」</span>を定めることで、目標達成へと迷いなく突き進むことができます。
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg">
            <p className="text-gray-500 text-sm leading-relaxed">
              これがKPIの本質――<span className="font-bold text-base text-indigo-600"><br />多くの可能性から"あえて一つ"を選び抜く勇気</span>が、ビジョンをブレさせないカギとなるのです。
            </p>
          </div>
        </div>
      </Modal>
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md animate-slide-in-bottom">
        <ProgressSteps
          currentStep={3}
          totalSteps={3}
          label="セットアップ 3/3"
        />

        <div className="flex items-center gap-2 mb-8">
          <svg
            className="w-8 h-8 text-purple-600"
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
          <h2 className="text-3xl font-bold text-gray-800">チームを作成</h2>
        </div>
        
        <form onSubmit={handleCreateTeam} className="space-y-8">
          <Input
            label="チーム名"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            disabled={loading}
          />

          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <label className="block text-lg font-semibold text-purple-900 mb-2">
              チームのKPI
              <button
                type="button"
                onClick={() => setShowKpiModal(true)}
                className="text-sm font-normal text-orange-500 font-bold ml-2 hover:text-orange-600 "
              >
                KPIの本質とは？
              </button>
            </label>
            <p className="text-sm text-purple-700 mb-3">
              KPIを<span className="font-bold text-base">１つだけ</span>を設定してください
            </p>
            <Input
              label=""
              type="text"
              value={kpi}
              onChange={(e) => {
                if (e.target.value.length <= KPI_MAX_LENGTH) {
                  setKpi(e.target.value);
                }
              }}
              placeholder="例：年間売上高5000万円"
              required
              disabled={loading}
              maxLength={KPI_MAX_LENGTH}
              className="bg-white"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {kpi.length}/{KPI_MAX_LENGTH}
            </p>
          </div>

          <Button type="submit" loading={loading}>
            チームを作成
          </Button>
        </form>
      </div>
    </div>
  );
}
