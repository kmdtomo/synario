import { supabaseClient } from "../supabase/client";
import { getErrorMessage } from "./utils";
import { Session } from '@supabase/supabase-js';

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
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // メール未確認の場合
      if (error.message.includes('Email not confirmed')) {
        // メール再送信
        await supabaseClient.auth.resend({
          type: 'signup',
          email,
        });
        throw new Error('メールアドレスの確認が必要です。確認メールを再送信しました。');
      }
      throw error;
    }
    if (!data.session) throw new Error('セッションの取得に失敗しました');

    // プロフィール情報を確認
    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('user_name')
      .eq('id', data.session.user.id)
      .single();

    if (!profileData?.user_name) {
      return {
        session: data.session,
        success: true,
        redirectTo: '/setup/profile'
      };
    }

    // チーム情報を確認
    const { data: teamData } = await supabaseClient
      .from('team_members')
      .select('team_id')
      .eq('user_id', data.session.user.id)
      .single();

    if (!teamData?.team_id) {
      return {
        session: data.session,
        success: true,
        redirectTo: '/setup/project'
      };
    }

    // 全ての設定が完了している場合
    return {
      session: data.session,
      success: true,
      redirectTo: '/dashboard'
    };

  } catch (error) {
    throw {
      message: getErrorMessage(error),
      code: (error as any).code
    } as SignInError;
  }
} 