import { useEffect, useMemo, useState } from "react";
import { supabase } from "./services/supabase";

const WHATSAPP_NUMBER = "5511987835736"; 
// troque pelo seu número com DDI + DDD, sem espaço, sem traço

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState(() => {
    const saved = localStorage.getItem("vertex360_meta");
    return saved ? Number(saved) : 3000;
  });

  const [tipo, setTipo] = useState("receita");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));

  const [agNome, setAgNome] = useState("");
  const [agData, setAgData] = useState("");
  const [agHora, setAgHora] = useState("");

  useEffect(() => {
    iniciarAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const key = `vertex360_transactions_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions([]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const key = `vertex360_transactions_${user.id}`;
    localStorage.setItem(key, JSON.stringify(transactions));
  }, [transactions, user]);

  useEffect(() => {
    localStorage.setItem("vertex360_meta", String(meta));
  }, [meta]);

  async function iniciarAuth() {
    try {
      if (window.location.search.includes("code=")) {
        await supabase.auth.exchangeCodeForSession(window.location.href);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, sessionAtual) => {
        setUser(sessionAtual?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Erro ao iniciar autenticação:", error);
    } finally {
      setLoading(false);
    }
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
      console.error(error);
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

  function adicionarLancamento(e) {
    e.preventDefault();

    const numero = Number(valor.replace(",", "."));

    if (!descricao.trim()) {
      alert("Digite a descrição.");
      return;
    }

    if (!numero || numero <= 0) {
      alert("Digite um valor válido.");
      return;
    }

    const novo = {
      id: crypto.randomUUID(),
      tipo,
      valor: numero,
      descricao: descricao.trim(),
      data,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [novo, ...prev]);

    setValor("");
    setDescricao("");
    setData(new Date().toISOString().slice(0, 10));
    setTipo("receita");
  }

  function removerLancamento(id) {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  }

  const receitaTotal = useMemo(() => {
    return transactions
      .filter((item) => item.tipo === "receita")
      .reduce((acc, item) => acc + item.valor, 0);
  }, [transactions]);

  const despesaTotal = useMemo(() => {
    return transactions
      .filter((item) => item.tipo === "despesa")
      .reduce((acc, item) => acc + item.valor, 0);
  }, [transactions]);

  const saldo = receitaTotal - despesaTotal;

  const progressoMeta = useMemo(() => {
    if (!meta || meta <= 0) return 0;
    return Math.min((saldo / meta) * 100, 100);
  }, [saldo, meta]);

  function abrirWhatsAppAgendamento() {
    if (!agNome || !agData || !agHora) {
      alert("Preencha nome, data e horário.");
      return;
    }

    const mensagem =
      `Olá, Paulo. Gostaria de agendar uma consultoria.%0A%0A` +
      `Nome: ${encodeURIComponent(agNome)}%0A` +
      `Data desejada: ${encodeURIComponent(agData)}%0A` +
      `Horário desejado: ${encodeURIComponent(agHora)}%0A%0A` +
      `Enviei pelo app Vertex360.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`, "_blank");
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2 style={styles.loadingText}>Carregando...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBox}>
          <h1 style={styles.logo}>Vertex360</h1>
          <p style={styles.subtitle}>Planejamento Financeiro</p>
          <button style={styles.googleButton} onClick={handleLogin}>
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appShell}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarLogo}>Vertex360</h2>
          <p style={styles.sidebarText}>Planejamento Financeiro</p>
        </div>

        <div style={styles.menuBox}>
          <div style={styles.menuItem}>Menu</div>
          <div style={styles.menuItem}>Planejamento</div>
          <div style={styles.menuItem}>Meta</div>
          <div style={styles.menuItem}>Lançamentos</div>
        </div>

        <div style={styles.userBox}>
          <p style={styles.userName}>
            {user.user_metadata?.name || user.email}
          </p>
          <p style={styles.userEmail}>{user.email}</p>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <h1 style={styles.pageTitle}>Painel Financeiro</h1>

        <div style={styles.cardsRow}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Receita</h3>
            <p style={styles.cardValue}>R$ {receitaTotal.toFixed(2)}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Despesa</h3>
            <p style={styles.cardValue}>R$ {despesaTotal.toFixed(2)}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Saldo</h3>
            <p style={styles.cardValue}>R$ {saldo.toFixed(2)}</p>
          </div>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Meta</h2>
          <div style={styles.metaBox}>
            <input
              style={styles.input}
              type="number"
              value={meta}
              onChange={(e) => setMeta(Number(e.target.value))}
              placeholder="Digite sua meta"
            />
            <div style={styles.progressBarBg}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${progressoMeta}%`,
                }}
              />
            </div>
            <p style={styles.metaText}>
              Meta: R$ {meta.toFixed(2)} | Progresso: {progressoMeta.toFixed(1)}%
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Adicionar Receita ou Despesa</h2>

          <form onSubmit={adicionarLancamento} style={styles.formGrid}>
            <select
              style={styles.input}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>

            <input
              style={styles.input}
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição"
            />

            <input
              style={styles.input}
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Valor"
            />

            <input
              style={styles.input}
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <button type="submit" style={styles.primaryButton}>
              Salvar lançamento
            </button>
          </form>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Agendar Consultoria</h2>

          <div style={styles.formGrid}>
            <input
              style={styles.input}
              type="text"
              value={agNome}
              onChange={(e) => setAgNome(e.target.value)}
              placeholder="Seu nome"
            />

            <input
              style={styles.input}
              type="date"
              value={agData}
              onChange={(e) => setAgData(e.target.value)}
            />

            <input
              style={styles.input}
              type="time"
              value={agHora}
              onChange={(e) => setAgHora(e.target.value)}
            />

            <button style={styles.whatsappButton} onClick={abrirWhatsAppAgendamento}>
              Agendar pelo WhatsApp
            </button>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Lançamentos</h2>

          {transactions.length === 0 ? (
            <div style={styles.emptyBox}>
              Nenhum lançamento ainda.
            </div>
          ) : (
            <div style={styles.list}>
              {transactions.map((item) => (
                <div key={item.id} style={styles.listItem}>
                  <div>
                    <strong>{item.descricao}</strong>
                    <p style={styles.listSub}>
                      {item.tipo.toUpperCase()} • {item.data}
                    </p>
                  </div>

                  <div style={styles.listRight}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor:
                          item.tipo === "receita" ? "#16a34a" : "#dc2626",
                      }}
                    >
                      R$ {item.valor.toFixed(2)}
                    </span>

                    <button
                      style={styles.deleteButton}
                      onClick={() => removerLancamento(item.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0b3b8f",
  },
  loadingText: {
    color: "#fff",
    fontSize: "24px",
  },
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0b3b8f, #1158d3)",
    padding: "20px",
  },
  loginBox: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    textAlign: "center",
    width: "100%",
    maxWidth: "420px",
  },
  logo: {
    fontSize: "44px",
    margin: 0,
    color: "#0b3b8f",
  },
  subtitle: {
    marginTop: "10px",
    marginBottom: "24px",
    color: "#4b5563",
    fontSize: "18px",
  },
  googleButton: {
    background: "#0b3b8f",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    width: "100%",
  },
  appShell: {
    minHeight: "100vh",
    display: "flex",
    background: "#eaf1ff",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "280px",
    background: "#0b3b8f",
    color: "#fff",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  sidebarLogo: {
    fontSize: "34px",
    margin: 0,
  },
  sidebarText: {
    marginTop: "6px",
    opacity: 0.9,
  },
  menuBox: {
    marginTop: "30px",
    display: "grid",
    gap: "12px",
  },
  menuItem: {
    background: "rgba(255,255,255,0.12)",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  userBox: {
    background: "rgba(255,255,255,0.12)",
    padding: "16px",
    borderRadius: "16px",
  },
  userName: {
    margin: 0,
    fontWeight: "700",
  },
  userEmail: {
    marginTop: "6px",
    fontSize: "13px",
    opacity: 0.9,
    wordBreak: "break-word",
  },
  logoutButton: {
    marginTop: "14px",
    background: "#fff",
    color: "#0b3b8f",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
  main: {
    flex: 1,
    padding: "28px",
  },
  pageTitle: {
    color: "#0b3b8f",
    marginTop: 0,
    fontSize: "34px",
  },
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(11,59,143,0.08)",
  },
  cardTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "16px",
  },
  cardValue: {
    marginTop: "10px",
    fontSize: "28px",
    color: "#0b3b8f",
    fontWeight: "700",
  },
  section: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 10px 30px rgba(11,59,143,0.08)",
  },
  sectionTitle: {
    marginTop: 0,
    color: "#0b3b8f",
  },
  metaBox: {
    display: "grid",
    gap: "12px",
  },
  metaText: {
    margin: 0,
    color: "#374151",
    fontWeight: "600",
  },
  progressBarBg: {
    width: "100%",
    height: "16px",
    background: "#dbeafe",
    borderRadius: "999px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    background: "#0b3b8f",
    borderRadius: "999px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  primaryButton: {
    background: "#0b3b8f",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  whatsappButton: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  emptyBox: {
    padding: "18px",
    background: "#f8fafc",
    borderRadius: "12px",
    color: "#64748b",
  },
  list: {
    display: "grid",
    gap: "12px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "#f8fbff",
    border: "1px solid #dbeafe",
    borderRadius: "14px",
    flexWrap: "wrap",
  },
  listSub: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "14px",
  },
  listRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  badge: {
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "14px",
  },
  deleteButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
