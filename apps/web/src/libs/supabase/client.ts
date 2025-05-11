import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

let _supabaseClient: SupabaseClient | null = null;

export const createClient = () => {
  if (!_supabaseClient) {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    console.log("SUPABASE_URL", SUPABASE_URL);
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || SUPABASE_URL === "") {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL in environment variables"
      );
    }
    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === "") {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables"
      );
    }
    _supabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabaseClient;
};
