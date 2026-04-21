import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";

export default function App() {
  const [user, setUser] = useState(null);

  // 🔥 CAPTURA USUÁRIO AO ABRIR O APP
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    }

    getUser();

    // 🔥 ESCUTA LOGIN AUTOMÁTICO (ESSA É A CHAVE!)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 LOGIN GOOGLE
  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://app.vertex360planejamento.com.br",
      },
    });
  }

  // 🔥 LOGOUT
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // 🔥 SE NÃO ESTIVER LOGADO
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Vertex360</h1>
        <button onClick={handleLogin}>Entrar com Google</button>
      </div>
    );
  }

  // 🔥 SE ESTIVER LOGADO (PAINEL)
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bem-vindo</h1>
      <p>{user.email}</p>

      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
