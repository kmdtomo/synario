'use client';

import { X } from "lucide-react";
import { useState } from "react";
import { Project } from "@/lib/db/project/project";

interface SynarioButtonProps {
  project: Project;
}

export default function SynarioButton({ project }: SynarioButtonProps) {
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
    <>
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
                        {project.trigger}
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
                        {project.vision}
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
                        {project.unite}
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
                        {project.achieve}
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
    </>
  );
}
