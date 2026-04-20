import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function cadastrar() {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Cadastro realizado com sucesso.");
    } catch {
      alert("Erro no cadastro");
    } finally {
      setLoading(false);
    }
  }

  async function entrar() {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        alert(error.message);
        return;
      }
    } catch {
      alert("Erro no login");
    } finally {
      setLoading(false);
    }
  }

  async function sair() {
    await supabase.auth.signOut();
  }

  const styles = {
    page: {
      minHeight: "100vh",
      margin: 0,
      padding: 0,
      fontFamily: "Arial, sans-serif",
      background:
        "linear-gradient(135deg, #071329 0%, #0b1f43 35%, #123a78 100%)",
      color: "#ffffff",
    },
    wrapper: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    },
    card: {
      width: "100%",
      maxWidth: "1100px",
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "28px",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      backdropFilter: "blur(10px)",
    },
    left: {
      padding: "56px 48px",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "22px",
    },
    badge: {
      display: "inline-flex",
      width: "fit-content",
      padding: "8px 14px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.10)",
      color: "#d9e8ff",
      fontSize: "13px",
      fontWeight: "bold",
      letterSpacing: "0.3px",
    },
    title: {
      margin: 0,
      fontSize: "54px",
      lineHeight: 1.05,
      fontWeight: "800",
    },
    highlight: {
      color: "#6fb1ff",
    },
    subtitle: {
      margin: 0,
      fontSize: "18px",
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.82)",
      maxWidth: "520px",
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
      gap: "14px",
      marginTop: "12px",
    },
    statBox: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: "18px",
      padding: "18px",
    },
    statLabel: {
      fontSize: "13px",
      color: "rgba(255,255,255,0.72)",
      marginBottom: "8px",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "800",
    },
    right: {
      padding: "40px 32px",
      background: "rgba(255,255,255,0.96)",
      color: "#0f172a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    formCard: {
      width: "100%",
      maxWidth: "380px",
    },
    formTitle: {
      margin: 0,
      fontSize: "34px",
      fontWeight: "800",
      color: "#0b1f43",
    },
    formText: {
      marginTop: "10px",
      marginBottom: "28px",
      color: "#475569",
      lineHeight: 1.6,
      fontSize: "15px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "700",
      marginBottom: "8px",
      color: "#1e293b",
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "15px 16px",
      borderRadius: "14px",
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: "16px",
      marginBottom: "18px",
      background: "#f8fafc",
    },
    buttonRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginTop: "10px",
    },
    primaryButton: {
      padding: "14px 16px",
      borderRadius: "14px",
      border: "none",
      background: "#0b5cff",
      color: "#fff",
      fontWeight: "700",
      fontSize: "15px",
      cursor: "pointer",
    },
    secondaryButton: {
      padding: "14px 16px",
      borderRadius: "14px",
      border: "1px solid #cbd5e1",
      background: "#fff",
      color: "#0f172a",
      fontWeight: "700",
      fontSize: "15px",
      cursor: "pointer",
    },
    userPanel: {
      width: "100%",
      maxWidth: "1120px",
      padding: "28px",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      marginBottom: "24px",
      flexWrap: "wrap",
    },
    logo: {
      fontSize: "34px",
      fontWeight: "800",
      margin: 0,
    },
    userEmail: {
      color: "rgba(255,255,255,0.85)",
      fontSize: "15px",
    },
    logoutButton: {
      padding: "12px 18px",
      borderRadius: "14px",
      border: "1px solid rgba(255,255,255,0.16)",
      background: "rgba(255,255,255,0.08)",
      color: "#fff",
      fontWeight: "700",
      cursor: "pointer",
    },
    hero: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "28px",
      padding: "32px",
      boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
      marginBottom: "22px",
    },
    heroTitle: {
      margin: 0,
      fontSize: "42px",
      lineHeight: 1.1,
      fontWeight: "800",
    },
    heroText: {
      marginTop: "14px",
      color: "rgba(255,255,255,0.82)",
      fontSize: "17px",
      lineHeight: 1.7,
      maxWidth: "760px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
      gap: "18px",
    },
    panel: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "22px",
      padding: "24px",
      boxShadow: "0 14px 38px rgba(0,0,0,0.18)",
    },
    panelLabel: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.72)",
      marginBottom: "12px",
    },
    panelValue: {
      fontSize: "32px",
      fontWeight: "800",
      marginBottom: "6px",
    },
    panelNote: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.65)",
      lineHeight: 1.6,
    },
  };

  if (user) {
    return (
      <div style={styles.page}>
        <div style={styles.userPanel}>
          <div style={styles.topBar}>
            <div>
              <h1 style={styles.logo}>
                Vertex<span style={styles.highlight}>360</span>
              </h1>
              <div style={styles.userEmail}>Usuário logado: {user.email}</div>
            </div>

            <button style={styles.logoutButton} onClick={sair}>
              Sair
            </button>
          </div>

          <div style={styles.hero}>
            <h2 style={styles.heroTitle}>Bem-vindo ao seu painel financeiro</h2>
            <p style={styles.heroText}>
              Organize sua vida financeira, acompanhe metas, visualize sua
              evolução e transforme planejamento em crescimento real.
            </p>
          </div>

          <div style={styles.grid}>
            <div style={styles.panel}>
              <div style={styles.panelLabel}>Receita mensal</div>
              <div style={styles.panelValue}>R$ 0,00</div>
              <div style={styles.panelNote}>
                Cadastre suas entradas e acompanhe sua performance.
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelLabel}>Despesas mensais</div>
              <div style={styles.panelValue}>R$ 0,00</div>
              <div style={styles.panelNote}>
                Tenha clareza sobre seus gastos fixos e variáveis.
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelLabel}>Meta financeira</div>
              <div style={styles.panelValue}>0%</div>
              <div style={styles.panelNote}>
                Evolua com estratégia, disciplina e consistência.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.left}>
            <div style={styles.badge}>Planejamento financeiro inteligente</div>

            <h1 style={styles.title}>
              App Vertex<span style={styles.highlight}>360</span>
            </h1>

            <p style={styles.subtitle}>
              Controle suas finanças com uma plataforma moderna, simples e
              profissional. Organize entradas, despesas, metas e acompanhe sua
              evolução com clareza.
            </p>

            <div style={styles.stats}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Organização</div>
                <div style={styles.statValue}>100%</div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statLabel}>Clareza</div>
                <div style={styles.statValue}>360°</div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statLabel}>Estratégia</div>
                <div style={styles.statValue}>Alta</div>
              </div>
            </div>
          </div>

          <div style={styles.right}>
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Acesse sua conta</h2>
              <p style={styles.formText}>
                Entre com seu email e senha para acessar seu painel ou crie sua
                conta para começar agora.
              </p>

              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="seuemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label style={styles.label}>Senha</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <div style={styles.buttonRow}>
                <button
                  style={styles.primaryButton}
                  onClick={entrar}
                  disabled={loading}
                >
                  {loading ? "Carregando..." : "Entrar"}
                </button>

                <button
                  style={styles.secondaryButton}
                  onClick={cadastrar}
                  disabled={loading}
                >
                  {loading ? "Carregando..." : "Cadastrar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
