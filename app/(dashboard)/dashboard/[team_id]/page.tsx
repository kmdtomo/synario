import { cookies } from "next/headers";
import { createClient } from "@/lib/db/supabase/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    team_id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function TeamDashboard({ params }: PageProps) {
  // paramsを非同期で解決
  const { team_id } = await Promise.resolve(params);
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // セッション確認
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  // チーム情報を取得
  const { data: team, error } = await supabase
    .from("teams")
    .select(`
      id,
      name,
      team_kpi,
      created_at
    `)
    .eq("id", team_id)
    .single();

  if (error || !team) {
    console.error("Team fetch error:", error);
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {team.name}のダッシュボード
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">チームKPI</h2>
        <p className="text-gray-700">{team.team_kpi}</p>
      </div>
    </div>
  );
}
