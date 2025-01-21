"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/common/button";
import { signIn } from "@/lib/db/auth/signin";
import { ErrorModal } from "@/components/ui/common/error-modal";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn({ email, password });
      if (result.success) {
        console.log('Redirecting to:', result.redirectTo); // デバッグ用
        await router.push(result.redirectTo);
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
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
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md animate-slide-in-bottom">

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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-gray-800">ログイン</h2>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <Input
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          
          <Input
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Button type="submit" loading={loading}>
            ログイン
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          アカウントをお持ちでない方は
          <Link href="/setup/signup" className="text-purple-600 hover:text-purple-500 font-medium ml-1">
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}