import { createClient } from "@supabase/supabase-js";

// 🔗 URL do seu projeto
const supabaseUrl = "https://pnurseudpiyyosulmwrf.supabase.co";

// 🔑 SUA CHAVE (já configurada)
const supabaseAnonKey = "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLwnAY";

// 🚀 Cliente Supabase (CONFIGURAÇÃO CORRETA PARA GOOGLE LOGIN)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
