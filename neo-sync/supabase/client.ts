import { createClient } from "@/utils/supabase/client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export const supabaseClient = createClient();