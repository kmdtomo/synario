"use client";

import { getErrorMessage } from "./utils";
import { Session } from '@supabase/supabase-js';
import { createClient } from "@/lib/db/supabase/client";

interface SignUpParams {
  email: string;
  password: string;
}

interface SignUpResult {
  session: Session | null;
  success: boolean;
  redirectTo: string;
}

interface SignUpError {
  message: string;
  code?: string;
}

export async function signUp({ email, password }: SignUpParams): Promise<SignUpResult> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data?.session) {
      return {
        session: null,
        success: true,
        redirectTo: '/auth/verify-email'  // メール確認が必要な場合
      };
    }

    // プロフィール作成
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.session.user.id,
        email: data.session.user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) throw profileError;

    return {
      session: data.session,
      success: true,
      redirectTo: '/setup/profile'  // プロフィール設定ページへ
    };

  } catch (error) {
    throw {
      message: getErrorMessage(error),
      code: (error as any).code
    } as SignUpError;
  }
} 