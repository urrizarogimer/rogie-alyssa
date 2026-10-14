import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
export const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not configured. Check .env.local");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);