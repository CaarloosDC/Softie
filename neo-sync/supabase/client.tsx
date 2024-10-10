import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!URL || !ANON_KEY) {
  throw new Error('Missing env variables for Supabase')
}

export const supabaseClient = createClient(URL, ANON_KEY)