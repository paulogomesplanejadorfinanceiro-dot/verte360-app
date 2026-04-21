import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pnurseudpiyyosulmwrf.supabase.co";
const supabaseAnonKey = "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLvmAY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "implicit", // 👈 ESSENCIAL
  },
});
