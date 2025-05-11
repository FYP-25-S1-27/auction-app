import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || SUPABASE_URL === "") {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in environment variables");
}
if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === "") {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables"
  );
}

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
