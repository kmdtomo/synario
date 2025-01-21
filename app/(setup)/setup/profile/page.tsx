"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/common/button";
import { ProgressSteps } from "@/components/ui/form/progress-steps";
import { AvatarUpload } from "@/components/ui/form/avatar-upload";
import { ErrorModal } from "@/components/ui/common/error-modal";
import { updateProfile } from "@/lib/db/auth/profile";

export default function Profile() {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({ username, avatarUrl });
      router.push("/setup/project");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setLoading(true);
      // アバターのBase64エンコード
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Error handling avatar:', error);
      setErrorMessage('アバターの処理に失敗しました');
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
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md animate-slide-in-bottom">
        <ProgressSteps
          currentStep={2}
          totalSteps={3}
          label="セットアップ 2/3"
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
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
            />
          </svg>
          <h2 className="text-3xl font-bold text-gray-800">プロフィール設定</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <AvatarUpload
              avatarUrl={avatarUrl}
              onUpload={handleAvatarUpload}
              loading={loading}
            />
          </div>

          <Input
            label="ユーザーネーム"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />

          <Button type="submit" loading={loading}>
            次へ進む
          </Button>
        </form>
      </div>
    </div>
  );
}
