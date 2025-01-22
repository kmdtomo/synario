"use server";

import { cookies as nextCookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "@/env";
import type { Database } from "@/types/supabase";

/** nextCookies() をawaitした結果の型を定義 */
type CookieStore = Awaited<ReturnType<typeof nextCookies>>;

/**
 * 引数で受け取った CookieStore を使って Supabase クライアントを生成
 */
export async function createClient(cookieStore: CookieStore) {
  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? "";
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component 上では .set() がエラーになる場合があるので無視
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options });
          } catch {
            // 同上
          }
        },
      },
    }
  );
}
