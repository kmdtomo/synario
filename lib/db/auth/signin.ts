"use client";

import { getErrorMessage } from "./utils";
import { Session } from '@supabase/supabase-js';
import { createClient } from "@/lib/db/supabase/client";

interface SignInParams {
  email: string;
  password: string;
}

interface SignInResult {
  session: Session | null;
  success: boolean;
  redirectTo: string;
}

interface SignInError {
  message: string;
  code?: string;
}

export async function signIn({ email, password }: SignInParams): Promise<SignInResult> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data?.session) throw new Error('セッションの取得に失敗しました');

    // プロフィール確認
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_name')
      .eq('id', data.session.user.id)
      .single();

    if (profileError) throw profileError;

    if (!profileData?.user_name) {
      return {
        session: data.session,
        success: true,
        redirectTo: '/setup/profile'
      };
    }

    // チーム情報を確認
    const { data: teamData } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', data.session.user.id)
      .single();

    if (!teamData?.team_id) {
      return {
        session: data.session,
        success: true,
        redirectTo: '/setup/team'
      };
    }

    return {
      session: data.session,
      success: true,
      redirectTo: `/dashboard/${teamData.team_id}`
    };

  } catch (error) {
    throw {
      message: getErrorMessage(error),
      code: (error as any).code
    } as SignInError;
  }
}

export function useSignIn() {
  const supabase = createClient();

  return {
    signInWithOAuth: async (provider: 'google' | 'github') => {
      return await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${location.origin}/auth/callback` }
      });
    },
    
    // リアルタイムの認証状態監視など
    onAuthStateChange: (callback: () => void) => {
      return supabase.auth.onAuthStateChange(callback);
    }
  };
} 