import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function getSession() {
    const { data } = await supabase.auth.getSession();
    setUser(data.session?.user ?? null);
    setLoading(false);
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://verte360-5d87aqt2t.vercel.app",
      },
    });

    if (error) {
      alert("Erro ao entrar com Google: " + error.message);
      console.log(error);
    }
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
          background: "#0f172a",
          color: "#fff",
          flexDirection: "column",
        }}
      >
        <h1>Vertex360</h1>
        <p>Planejamento Financeiro</p>

        <button
          onClick={handleLogin}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#22c55e",
            color: "#000",
            fontWeight: "bold",
          }}
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Bem-vindo, {user.email}</h1>

      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
