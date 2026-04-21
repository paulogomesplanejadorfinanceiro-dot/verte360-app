import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pnurseudpiyyosulmwrf.supabase.co";
const supabaseAnonKey = "SUA_CHAVE_PUBLISHABLE_AQUI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
