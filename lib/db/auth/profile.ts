import { supabaseClient } from "../supabase/client";
import { getErrorMessage } from "./utils";

interface UpdateProfileParams {
  username: string;
  avatarUrl: string | null | undefined;
}

interface ProfileError {
  message: string;
  code?: string;
}

export async function updateProfile({ username, avatarUrl }: UpdateProfileParams) {
  try {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }

    // Supabase Authのユーザー情報を更新
    const { error: authUpdateError } = await supabaseClient.auth.updateUser({
      data: { username }
    });

    if (authUpdateError) throw authUpdateError;

    // プロフィール情報を更新
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        user_name: username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (profileError) throw profileError;

    return { success: true };
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      code: (error as any).code
    } as ProfileError;
  }
} 