import { createClient } from "@supabase/supabase-js";

// 🔗 URL do seu projeto
const supabaseUrl = "https://pnurseudpiyyosulmwrf.supabase.co";

// 🔑 SUA CHAVE (já coloquei a sua correta)
const supabaseAnonKey = "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLvmAY";

// 🚀 Cliente Supabase configurado corretamente
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce", // 🔥 ESSENCIAL pro Google login funcionar
  },
});
