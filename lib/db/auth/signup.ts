import { supabaseClient } from "../supabase/client";
import { getErrorMessage } from "./utils";
import { Session } from '@supabase/supabase-js';


interface SignUpParams {
  email: string;
  password: string;
}

interface SignUpResult {
    session: Session | null;
    success: boolean;
}

interface SignUpError {
  message: string;
  code?: string;
}

export async function signUp({ email, password }: SignUpParams): Promise<SignUpResult> {
  try {
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('ユーザー情報の取得に失敗しました');

    // プロフィール情報をprofilesテーブルに保存
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: email,
        }
      ]);

    if (profileError) throw profileError;

    return { session: authData.session, success: true };
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      code: (error as any).code
    } as SignUpError;
  }
} 