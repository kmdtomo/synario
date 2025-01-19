// lib/supabaseClient.ts
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase"; // DB型 (Optional)

export const supabaseClient = createClientComponentClient<Database>();
