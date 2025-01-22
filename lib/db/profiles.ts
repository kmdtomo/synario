"use server";

import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/db/supabase/server";
import type { Database } from "@/types/supabase";

export const getCurrentProfile = async () => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data, error: profileError, status } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", user.id)
    .single();

  if (profileError && status !== 406) return null;
  return data;
};

export const getProfileByUsername = async (
  supabase: SupabaseClient<Database>,
  username: string
) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("username", username)
    .single();

  if (error) return null;
  return data;
};
