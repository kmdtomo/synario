import { createClient } from "@/lib/db/supabase/server";

export const getCurrentProfile = async () => {
  const supabase = createClient();

  // セッション取得（推奨される方法）
  const { data: { session } } = await supabase.auth.getSession();
  
  // セッションがない場合は未ログイン
  if (!session?.user) return null;

  // プロフィール取得
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)  // session.user.idを使用
    .single();

  return error ? null : profile;
}; 