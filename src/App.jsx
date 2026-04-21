import { useEffect, useState } from "react";
import { supabase } from "./services/supabase.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const currentUrl = new URL(window.location.href);
        const hasCode = currentUrl.searchParams.get("code");

        if (hasCode) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );

          if (error) {
            console.log("Erro ao trocar code por sessão:", error.message);
          } else if (mounted) {
            setUser(data.session?.user ?? null);
          }

          window.history.replaceState({}, document.title, window.location.origin);
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.log("Erro ao buscar sessão:", error.message);
        }

        if (mounted) {
          setUser(data.session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.log("Erro no initAuth:", err);
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
        redirectTo: "https://verte360-5d87aqt2t.vercel.app",
      },
    });

    if (error) {
      alert("Erro ao entrar com Google: " + error.message);
      console.log(error);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Erro ao sair: " + error.message);
      return;
    }

    setUser(null);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0a46d7 0%, #031b63 100%)",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Carregando Vertex360...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0a46d7 0%, #031b63 100%)",
          padding: "24px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #9ff3ff, #ffffff)",
              color: "#0a46d7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "28px",
              marginBottom: "20px",
            }}
          >
            V
          </div>

          <h1 style={{ margin: 0, fontSize: "42px", lineHeight: 1.1 }}>
            Vertex360
          </h1>

          <p style={{ marginTop: "12px", opacity: 0.9, fontSize: "18px" }}>
            Planejamento Financeiro
          </p>

          <button
            onClick={handleLogin}
            style={{
              marginTop: "28px",
              width: "100%",
              padding: "16px 20px",
              border: "none",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #29d8ff, #0fb6ff)",
              color: "#08204f",
              fontWeight: "700",
              fontSize: "18px",
              cursor: "pointer",
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
        background: "linear-gradient(180deg, #0a46d7 0%, #031b63 100%)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h1>Bem-vindo, {user.email}</h1>
      <button
        onClick={handleLogout}
        style={{
          padding: "12px 20px",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
        }}
      >
        Sair
      </button>
    </div>
  );
}
