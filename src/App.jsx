import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔑 SUAS CHAVES
const supabase = createClient(
  "https://pnurseudpiyyosulmwrf.supabase.co",
  "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLwnAY"
);

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 verificar sessão
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

  // 🧾 cadastro
  async function cadastrar() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Cadastro realizado com sucesso");
    }

    setLoading(false);
  }

  // 🔐 login
  async function entrar() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  }

  // 🚪 logout
  async function sair() {
    await supabase.auth.signOut();
  }

  // 🔥 TELA LOGADO
  if (user) {
    return (
      <div style={styles.page}>
        <div style={styles.dashboard}>
          <h1 style={styles.logo}>Vertex360</h1>

          <p style={styles.user}>Usuário: {user.email}</p>

          <div style={styles.cards}>
            <div style={styles.card}>
              <h3>Receita</h3>
              <p>R$ 0,00</p>
            </div>

            <div style={styles.card}>
              <h3>Despesas</h3>
              <p>R$ 0,00</p>
            </div>

            <div style={styles.card}>
              <h3>Meta</h3>
              <p>0%</p>
            </div>
          </div>

          <button onClick={sair} style={styles.logout}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  // 🔥 TELA LOGIN
  return (
    <div style={styles.page}>
      <div style={styles.loginBox}>
        <h1 style={styles.logoDark}>Vertex360</h1>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
        />

        <button onClick={entrar} style={styles.btn} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button onClick={cadastrar} style={styles.btn2} disabled={loading}>
          {loading ? "Carregando..." : "Criar conta"}
        </button>
      </div>
    </div>
  );
}

// 🎨 ESTILO PROFISSIONAL
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0b1f43, #0b5cff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },

  loginBox: {
    background: "#ffffff",
    padding: 30,
    borderRadius: 15,
    width: 320,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },

  btn: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    background: "#0b5cff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },

  btn2: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    background: "#eee",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  dashboard: {
    textAlign: "center",
    color: "#fff",
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
  },

  logoDark: {
    color: "#0b1f43",
  },

  user: {
    marginTop: 10,
  },

  cards: {
    display: "flex",
    gap: 15,
    marginTop: 20,
    justifyContent: "center",
  },

  card: {
    background: "rgba(255,255,255,0.2)",
    padding: 20,
    borderRadius: 10,
    width: 120,
  },

  logout: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
};
