import { useEffect, useMemo, useState } from "react";
import { supabase } from "./services/supabase.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");
  const [meta, setMeta] = useState(3000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchTransactions(currentUser.id);
      } else {
        setTransactions([]);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function getSession() {
    setLoading(true);

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log("Erro ao buscar sessão:", error.message);
      setLoading(false);
      return;
    }

    const currentUser = data.session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      await fetchTransactions(currentUser.id);
    }

    setLoading(false);
  }

  async function fetchTransactions(userId) {
    const { data, error } = await supabase
      .from("movimentacoes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Erro ao buscar movimentações:", error.message);
      return;
    }

    setTransactions(data || []);
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://app.vertex360planejamento.com.br",
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
    setTransactions([]);
  }

  async function addTransaction() {
    if (!user) {
      alert("Faça login primeiro.");
      return;
    }

    if (!valor || Number(valor) <= 0) {
      alert("Digite um valor válido.");
      return;
    }

    const { error } = await supabase.from("movimentacoes").insert([
      {
        user_id: user.id,
        valor: Number(valor),
        tipo,
      },
    ]);

    if (error) {
      console.log("Erro ao salvar:", error.message);
      alert("Erro ao adicionar lançamento.");
      return;
    }

    setValor("");
    await fetchTransactions(user.id);
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const receita = useMemo(() => {
    return transactions
      .filter((item) => item.tipo === "receita")
      .reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [transactions]);

  const despesa = useMemo(() => {
    return transactions
      .filter((item) => item.tipo === "despesa")
      .reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [transactions]);

  const saldo = receita - despesa;
  const progresso = meta > 0 ? Math.min((receita / meta) * 100, 100) : 0;

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
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "24px",
        }}
      >
        <aside
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: "24px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 48px)",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "38px" }}>Vertex360</h1>
            <p style={{ marginTop: "8px", opacity: 0.9 }}>
              Planejamento Financeiro
            </p>
          </div>

          <div style={{ marginTop: "28px", display: "grid", gap: "12px" }}>
            <button style={menuButtonStyle}>Dashboard</button>
            <button style={menuButtonStyle}>Lançamentos</button>
            <button style={menuButtonStyle}>Metas</button>
            <button style={menuButtonStyle}>Planejamento</button>
          </div>

          <div style={{ marginTop: "auto" }}>
            <p style={{ fontSize: "14px", opacity: 0.85 }}>{user.email}</p>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Sair
            </button>
          </div>
        </aside>

        <main>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "20px",
            }}
          >
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Receita</h3>
              <h2 style={cardValueStyle}>{formatMoney(receita)}</h2>
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Despesa</h3>
              <h2 style={cardValueStyle}>{formatMoney(despesa)}</h2>
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Saldo</h3>
              <h2 style={cardValueStyle}>{formatMoney(saldo)}</h2>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              marginTop: "20px",
            }}
          >
            <h3 style={cardTitleStyle}>Meta mensal</h3>

            <input
              type="number"
              value={meta}
              onChange={(e) => setMeta(Number(e.target.value))}
              style={inputStyle}
            />

            <div
              style={{
                marginTop: "16px",
                width: "100%",
                height: "18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progresso}%`,
                  height: "100%",
                  background: "linear-gradient(135deg, #b8fff4, #8ef6ff)",
                  borderRadius: "999px",
                }}
              />
            </div>

            <p style={{ marginTop: "14px", fontSize: "16px", opacity: 0.95 }}>
              {formatMoney(receita)} de {formatMoney(meta)}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>WhatsApp</h3>
              <p style={{ opacity: 0.9 }}>
                Fale direto comigo para suporte e orientação.
              </p>
              <a
                href="https://wa.me/5511987835736?text=Olá,%20vim%20pelo%20app%20Vertex360."
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button style={primaryButtonStyle}>Falar agora</button>
              </a>
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Agendar mentoria</h3>
              <p style={{ opacity: 0.9 }}>
                Marque uma conversa para análise financeira.
              </p>
              <a
                href="https://wa.me/5511987835736?text=Olá,%20quero%20agendar%20uma%20mentoria%20pelo%20Vertex360."
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button style={primaryButtonStyle}>Agendar</button>
              </a>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              marginTop: "20px",
            }}
          >
            <h3 style={cardTitleStyle}>Novo lançamento</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 220px 180px",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <input
                type="number"
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                style={inputStyle}
              />

              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={inputStyle}
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>

              <button onClick={addTransaction} style={primaryButtonStyle}>
                Adicionar
              </button>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              marginTop: "20px",
            }}
          >
            <h3 style={cardTitleStyle}>Histórico</h3>

            <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
              {transactions.length === 0 ? (
                <div
                  style={{
                    padding: "18px",
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.08)",
                  }}
                >
                  Nenhum lançamento ainda.
                </div>
              ) : (
                transactions.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "18px",
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "700", textTransform: "capitalize" }}>
                        {item.tipo}
                      </div>
                      <div style={{ opacity: 0.8, fontSize: "14px" }}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString("pt-BR")
                          : "Sem data"}
                      </div>
                    </div>

                    <strong>{formatMoney(item.valor)}</strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const menuButtonStyle = {
  padding: "14px 18px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #0e7bff, #0a53ff)",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
  textAlign: "left",
};

const logoutButtonStyle = {
  marginTop: "10px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  background: "rgba(255,255,255,0.14)",
  color: "#fff",
  cursor: "pointer",
};

const cardStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
};

const cardTitleStyle = {
  margin: 0,
  fontSize: "18px",
  opacity: 0.95,
};

const cardValueStyle = {
  marginTop: "18px",
  marginBottom: 0,
  fontSize: "28px",
};

const inputStyle = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: "16px",
  border: "none",
  outline: "none",
  fontSize: "16px",
  boxSizing: "border-box",
};

const primaryButtonStyle = {
  padding: "16px 20px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #29d8ff, #0fb6ff)",
  color: "#08204f",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "14px",
};
