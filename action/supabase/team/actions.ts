"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/db/supabase/server";
import { getErrorMessage } from "@/lib/db/auth/utils";

interface CreateTeamParams {
  name: string;
  kpi: string;
}

interface TeamResult {
  success: boolean;
  teamId: string;
}

interface TeamError {
  message: string;
  code?: string;
}

export async function createTeam({ name, kpi }: CreateTeamParams): Promise<TeamResult> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // 1. 認証チェック
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('認証エラー:', userError);
      throw new Error('認証エラーが発生しました');
    }
    if (!user) {
      throw new Error('認証されていません');
    }

    // 2. チーム作成
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert({ 
        name,
        team_kpi: kpi,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (teamError) {
      console.error('チーム作成エラー:', teamError);
      throw new Error('チームの作成に失敗しました');
    }
    if (!teamData) {
      throw new Error('チームデータの取得に失敗しました');
    }

    // 3. メンバー追加
    const { error: memberError } = await supabase
      .from("team_members")
      .insert({
        team_id: teamData.id,
        user_id: user.id,
        role: "owner",
      });

    if (memberError) {
      console.error('メンバー追加エラー:', memberError);
      throw new Error('チームメンバーの追加に失敗しました');
    }

    return { success: true, teamId: teamData.id };
  } catch (error) {
    console.error('createTeam エラー:', error);
    throw {
      message: getErrorMessage(error),
      code: (error as any).code,
    } as TeamError;
  }
}
