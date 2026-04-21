import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao buscar sessão:", error.message);
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro inesperado ao carregar sessão:", err);
        if (mounted) setLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      alert("Erro ao entrar com Google: " + error.message);
      console.error(error);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Erro ao sair: " + error.message);
      console.error(error);
      return;
    }

    setUser(null);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f7f7f7",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 32,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            textAlign: "center",
            minWidth: 320,
          }}
        >
          <h1 style={{ marginBottom: 16 }}>Vertex360</h1>
          <p style={{ marginBottom: 24, color: "#555" }}>
            Entre com sua conta Google
          </p>
          <button
            onClick={handleLogin}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "none",
              background: "#111827",
              color: "#fff",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Vertex360</h1>
        <p><strong>Login feito com sucesso.</strong></p>
        <p><strong>Nome:</strong> {user.user_metadata?.full_name || "Sem nome"}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 20,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: "#dc2626",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
