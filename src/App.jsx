import { useEffect, useState } from "react";
import { supabase } from "./services/supabase.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // pega sessão atual
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // escuta login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) {
    return <h1>Carregando...</h1>;
  }

  if (!user) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a46d7",
          color: "#fff",
          flexDirection: "column",
        }}
      >
        <h1>Vertex360</h1>
        <p>Planejamento Financeiro</p>

        <button onClick={handleLogin}>
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Bem-vindo, {user.email}</h1>

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
