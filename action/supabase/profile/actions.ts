"use server"

import { cookies } from "next/headers";
import { createClient } from "@/lib/db/supabase/server";
import { getErrorMessage } from "@/lib/db/auth/utils";

interface UpdateProfileParams {
  user_name: string;
  avatar_url?: string | null;
}

export async function updateProfile({ user_name, avatar_url }: UpdateProfileParams) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('認証されていません');

    const { error } = await supabase
      .from('profiles')
      .update({
        user_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;
    return { success: true };

  } catch (error) {
    throw {
      message: getErrorMessage(error),
      code: (error as any).code
    };
  }
} 