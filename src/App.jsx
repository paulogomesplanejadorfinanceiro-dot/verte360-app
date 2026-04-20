import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pnurseudpiyyosulmwrf.supabase.co",
  "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLwnAY"
);

const isMobile = window.innerWidth < 900;

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR");
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [mensagem, setMensagem] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [dados, setDados] = useState([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");

  const [abaAtiva, setAbaAtiva] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const [metaMensal, setMetaMensal] = useState(() => {
    const salva = localStorage.getItem("vertex360_meta");
    return salva ? Number(salva) : 3000;
  });

  useEffect(() => {
    localStorage.setItem("vertex360_meta", String(metaMensal || 0));
  }, [metaMensal]);

  useEffect(() => {
    async function init() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setMensagem("Erro ao carregar sessão: " + error.message);
          setCheckingSession(false);
          return;
        }

        const usuario = data.session?.user || null;
        setUser(usuario);

        if (usuario) {
          await carregarDados(usuario.id);
        }
      } catch {
        setMensagem("Falha ao iniciar o app.");
      } finally {
        setCheckingSession(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const usuario = session?.user || null;
      setUser(usuario);

      if (usuario) {
        await carregarDados(usuario.id);
      } else {
        setDados([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function carregarDados(userId) {
    const { data, error } = await supabase
      .from("movimentacoes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setMensagem("Erro ao carregar dados: " + error.message);
      setDados([]);
      return;
    }

    setDados(data || []);
  }

  async function cadastrar() {
    setMensagem("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (error) {
        setMensagem("Erro no cadastro: " + error.message);
        return;
      }

      setMensagem("Cadastro realizado. Verifique seu e-mail.");
    } catch {
      setMensagem("Falha inesperada no cadastro.");
    } finally {
      setLoading(false);
    }
  }

  async function entrar() {
    setMensagem("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        setMensagem("Erro no login: " + error.message);
        return;
      }

      setMensagem("Login realizado com sucesso.");
    } catch {
      setMensagem("Falha inesperada no login.");
    } finally {
      setLoading(false);
    }
  }

  async function sair() {
    await supabase.auth.signOut();
    setMensagem("");
    setAbaAtiva("dashboard");
  }

  async function adicionar() {
    setMensagem("");

    if (!user) {
      setMensagem("Usuário não está logado.");
      return;
    }

    if (!valor || Number(valor) <= 0) {
      setMensagem("Digite um valor válido.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("movimentacoes").insert([
        {
          user_id: user.id,
          tipo,
          valor: Number(valor),
        },
      ]);

      if (error) {
        setMensagem("Erro ao salvar: " + error.message);
        return;
      }

      setValor("");
      setMensagem("Lançamento salvo com sucesso.");
      await carregarDados(user.id);
      setAbaAtiva("lancamentos");
    } catch {
      setMensagem("Falha inesperada ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  const receita = useMemo(() => {
    return dados
      .filter((item) => item.tipo === "receita")
      .reduce((acc, item) => acc + Number(item.valor), 0);
  }, [dados]);

  const despesa = useMemo(() => {
    return dados
      .filter((item) => item.tipo === "despesa")
      .reduce((acc, item) => acc + Number(item.valor), 0);
  }, [dados]);

  const saldo = receita - despesa;

  const progressoMeta = useMemo(() => {
    if (!metaMensal || metaMensal <= 0) return 0;
    return Math.min((receita / metaMensal) * 100, 100);
  }, [metaMensal, receita]);

  if (checkingSession) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingCard}>Carregando Vertex360...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.authBg}>
        <div style={styles.authCard}>
          <div style={styles.logo}>V360</div>
          <h1 style={styles.authTitle}>Vertex360</h1>
          <p style={styles.authText}>Entre na sua conta para continuar.</p>

          <input
            style={styles.input}
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div style={styles.authButtons}>
            <button style={styles.primaryButton} onClick={entrar} disabled={loading}>
              Entrar
            </button>
            <button style={styles.secondaryButton} onClick={cadastrar} disabled={loading}>
              Cadastrar
            </button>
          </div>

          {mensagem ? <div style={styles.message}>{mensagem}</div> : null}
        </div>
      </div>
    );
  }

  function renderConteudo() {
    if (abaAtiva === "dashboard") {
      return (
        <>
          <div style={styles.cards}>
            <Card titulo="Receita" valor={formatCurrency(receita)} />
            <Card titulo="Despesa" valor={formatCurrency(despesa)} />
            <Card titulo="Saldo" valor={formatCurrency(saldo)} />
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Meta mensal</div>
            <input
              style={styles.input}
              type="number"
              value={metaMensal}
              onChange={(e) => setMetaMensal(Number(e.target.value || 0))}
            />
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progressoMeta}%`,
                }}
              />
            </div>
            <div style={styles.metaInfo}>
              {formatCurrency(receita)} de {formatCurrency(metaMensal)}
            </div>
          </div>
        </>
      );
    }

    if (abaAtiva === "lancamentos") {
      return (
        <>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Novo lançamento</div>

            <div style={styles.formGrid}>
              <input
                style={styles.input}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Valor"
                type="number"
              />

              <select
                style={styles.input}
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>

              <button style={styles.primaryButton} onClick={adicionar} disabled={loading}>
                Adicionar
              </button>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Histórico</div>

            {dados.length === 0 ? (
              <div style={styles.empty}>Nenhum lançamento ainda.</div>
            ) : (
              dados.map((item) => (
                <div key={item.id} style={styles.item}>
                  <div>
                    <div style={styles.itemTitle}>
                      {item.tipo === "receita" ? "Receita" : "Despesa"}
                    </div>
                    <div style={styles.itemDate}>{formatDate(item.created_at)}</div>
                  </div>
                  <div
                    style={{
                      ...styles.itemValue,
                      color: item.tipo === "receita" ? "#7CFFB2" : "#FFB2B2",
                    }}
                  >
                    {formatCurrency(item.valor)}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      );
    }

    if (abaAtiva === "metas") {
      return (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Metas</div>
          <div style={styles.bigValue}>{progressoMeta.toFixed(0)}%</div>
          <div style={styles.metaInfo}>Sua evolução da meta mensal.</div>
        </div>
      );
    }

    if (abaAtiva === "config") {
      return (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Configurações</div>
          <div style={styles.userEmail}>{user.email}</div>
          <button style={styles.secondaryButton} onClick={sair}>
            Sair
          </button>
        </div>
      );
    }

    return null;
  }

  return (
    <div style={styles.appBg}>
      <div style={styles.container}>
        {!isMobile && (
          <aside style={styles.sidebar}>
            <div>
              <div style={styles.brand}>Vertex360</div>
              <div style={styles.brandSub}>Planejamento Financeiro</div>
            </div>

            <div style={styles.sideMenu}>
              <MenuButton
                ativo={abaAtiva === "dashboard"}
                onClick={() => setAbaAtiva("dashboard")}
              >
                Dashboard
              </MenuButton>
              <MenuButton
                ativo={abaAtiva === "lancamentos"}
                onClick={() => setAbaAtiva("lancamentos")}
              >
                Lançamentos
              </MenuButton>
              <MenuButton
                ativo={abaAtiva === "metas"}
                onClick={() => setAbaAtiva("metas")}
              >
                Metas
              </MenuButton>
              <MenuButton
                ativo={abaAtiva === "config"}
                onClick={() => setAbaAtiva("config")}
              >
                Configurações
              </MenuButton>
            </div>

            <div>
              <div style={styles.userEmail}>{user.email}</div>
              <button style={styles.secondaryButton} onClick={sair}>
                Sair
              </button>
            </div>
          </aside>
        )}

        <main style={styles.main}>{renderConteudo()}</main>

        {isMobile && (
          <>
            <button
              style={styles.fab}
              onClick={() => setAbaAtiva("lancamentos")}
              aria-label="Adicionar lançamento"
            >
              +
            </button>

            <nav style={styles.bottomNav}>
              <NavButton
                ativo={abaAtiva === "dashboard"}
                onClick={() => setAbaAtiva("dashboard")}
              >
                🏠
              </NavButton>
              <NavButton
                ativo={abaAtiva === "lancamentos"}
                onClick={() => setAbaAtiva("lancamentos")}
              >
                📊
              </NavButton>
              <NavButton
                ativo={abaAtiva === "metas"}
                onClick={() => setAbaAtiva("metas")}
              >
                🎯
              </NavButton>
              <NavButton
                ativo={abaAtiva === "config"}
                onClick={() => setAbaAtiva("config")}
              >
                ⚙️
              </NavButton>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}

function Card({ titulo, valor }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{titulo}</div>
      <div style={styles.cardValue}>{valor}</div>
    </div>
  );
}

function MenuButton({ children, ativo, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.menuButton,
        ...(ativo ? styles.menuButtonActive : {}),
      }}
    >
      {children}
    </button>
  );
}

function NavButton({ children, ativo, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.navButton,
        ...(ativo ? styles.navButtonActive : {}),
      }}
    >
      {children}
    </button>
  );
}

const styles = {
  loadingScreen: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #163b8f 0%, #0a2259 45%, #050c1f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingCard: {
    color: "#fff",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    padding: "24px 32px",
    borderRadius: 20,
    fontSize: 18,
    fontWeight: 700,
  },

  authBg: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1d5eff 0%, #0c2d7a 40%, #050c1f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  authCard: {
    width: "100%",
    maxWidth: 430,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(18px)",
    borderRadius: 28,
    padding: 32,
    boxShadow: "0 25px 70px rgba(0,0,0,0.32)",
    color: "#fff",
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: "linear-gradient(135deg, #9cecff, #ffffff)",
    color: "#0b3d91",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 22,
    marginBottom: 20,
  },
  authTitle: {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
  },
  authText: {
    marginTop: 8,
    marginBottom: 24,
    opacity: 0.9,
  },

  appBg: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #1f6bff 0%, #0d2f7c 32%, #081735 68%, #030814 100%)",
    fontFamily: "Arial, sans-serif",
    overflowX: "hidden",
  },
  container: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: 260,
    padding: 24,
    background: "rgba(255,255,255,0.08)",
    borderRight: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  brand: {
    fontSize: 28,
    fontWeight: 900,
  },
  brandSub: {
    marginTop: 4,
    opacity: 0.8,
  },
  sideMenu: {
    display: "grid",
    gap: 10,
    marginTop: 30,
  },
  menuButton: {
    border: "none",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: 14,
    textAlign: "left",
    fontWeight: 700,
    cursor: "pointer",
  },
  menuButtonActive: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
  },

  main: {
    flex: 1,
    padding: isMobile ? "18px 16px 110px" : "24px",
    color: "#fff",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
    gap: 16,
  },
  card: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 22,
    minHeight: 120,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 14,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 900,
  },

  section: {
    marginTop: 20,
    background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 16,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
    gap: 12,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    borderRadius: 16,
    padding: "16px 18px",
    fontSize: 16,
    color: "#0b3d91",
    fontWeight: 700,
    marginBottom: isMobile ? 0 : undefined,
  },

  primaryButton: {
    border: "none",
    borderRadius: 16,
    padding: "16px 18px",
    background: "linear-gradient(135deg, #25d4ff, #16b8e5)",
    color: "#05204f",
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "none",
    borderRadius: 16,
    padding: "14px 18px",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },

  message: {
    marginTop: 16,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
  },

  progressTrack: {
    height: 14,
    background: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #6fffe9, #ffffff)",
  },
  metaInfo: {
    marginTop: 12,
    fontWeight: 700,
    opacity: 0.92,
  },
  bigValue: {
    fontSize: 42,
    fontWeight: 900,
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.08)",
    marginTop: 10,
  },
  itemTitle: {
    fontWeight: 800,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 13,
    opacity: 0.8,
  },
  itemValue: {
    fontWeight: 900,
    fontSize: 16,
  },
  empty: {
    opacity: 0.85,
  },

  userEmail: {
    fontSize: 13,
    lineHeight: 1.5,
    marginBottom: 12,
    opacity: 0.92,
    wordBreak: "break-word",
  },

  fab: {
    position: "fixed",
    right: 20,
    bottom: 88,
    width: 64,
    height: 64,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #25d4ff, #16b8e5)",
    color: "#05204f",
    fontSize: 34,
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(0,0,0,0.28)",
    zIndex: 20,
  },

  bottomNav: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    height: 68,
    background: "rgba(8,23,53,0.96)",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backdropFilter: "blur(16px)",
    zIndex: 19,
  },
  navButton: {
    border: "none",
    background: "transparent",
    color: "#d7e7ff",
    fontSize: 24,
    cursor: "pointer",
    opacity: 0.8,
  },
  navButtonActive: {
    opacity: 1,
    transform: "scale(1.08)",
  },
};
