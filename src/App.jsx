import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pnurseudpiyyosulmwrf.supabase.co",
  "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLwnAY"
);

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatShortDate(dateValue) {
  const d = new Date(dateValue);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function getDayKey(dateValue) {
  const d = new Date(dateValue);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");

  const [dados, setDados] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const [metaMensal, setMetaMensal] = useState(() => {
    const salva = localStorage.getItem("vertex360_meta_mensal");
    return salva ? Number(salva) : 3000;
  });

  useEffect(() => {
    localStorage.setItem("vertex360_meta_mensal", String(metaMensal || 0));
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
        setCheckingSession(false);

        if (usuario) {
          await carregarDados(usuario.id);
        }
      } catch {
        setMensagem("Falha ao iniciar o app.");
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

      setMensagem("Cadastro realizado. Verifique seu e-mail para confirmar.");
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
  }, [receita, metaMensal]);

  const grafico7Dias = useMemo(() => {
    const hoje = new Date();
    const dias = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(hoje.getDate() - i);

      dias.push({
        key: getDayKey(d),
        label: formatShortDate(d),
        receita: 0,
        despesa: 0,
      });
    }

    for (const item of dados) {
      const key = getDayKey(item.created_at);
      const index = dias.findIndex((d) => d.key === key);

      if (index !== -1) {
        if (item.tipo === "receita") dias[index].receita += Number(item.valor);
        if (item.tipo === "despesa") dias[index].despesa += Number(item.valor);
      }
    }

    return dias;
  }, [dados]);

  const maiorValorGrafico = useMemo(() => {
    const todos = grafico7Dias.flatMap((dia) => [dia.receita, dia.despesa]);
    return Math.max(...todos, 1);
  }, [grafico7Dias]);

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
          <div style={styles.logoBadge}>V360</div>
          <h1 style={styles.authTitle}>Vertex360</h1>
          <p style={styles.authSubtitle}>
            Seu aplicativo premium de planejamento financeiro.
          </p>

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
            <button
              style={styles.primaryButton}
              onClick={entrar}
              disabled={loading}
            >
              Entrar
            </button>

            <button
              style={styles.secondaryButton}
              onClick={cadastrar}
              disabled={loading}
            >
              Cadastrar
            </button>
          </div>

          {mensagem ? <div style={styles.messageBox}>{mensagem}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appBg}>
      <div style={styles.shell}>
        <aside style={styles.sidebar}>
          <div>
            <div style={styles.sidebarBrand}>Vertex360</div>
            <div style={styles.sidebarMini}>Planejamento Financeiro</div>
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarItemActive}>Dashboard</div>
            <div style={styles.sidebarItem}>Lançamentos</div>
            <div style={styles.sidebarItem}>Metas</div>
            <div style={styles.sidebarItem}>Planejamento</div>
          </div>

          <div style={styles.sidebarFooter}>
            <div style={styles.userMail}>{user.email}</div>
            <button style={styles.logoutButton} onClick={sair}>
              Sair
            </button>
          </div>
        </aside>

        <main style={styles.main}>
          <header style={styles.topbar}>
            <div>
              <h1 style={styles.pageTitle}>Dashboard Financeiro</h1>
              <p style={styles.pageSubtitle}>
                Acompanhe receitas, despesas, saldo e evolução da sua meta.
              </p>
            </div>

            <div style={styles.metaBox}>
              <span style={styles.metaLabel}>Meta mensal</span>
              <input
                type="number"
                value={metaMensal}
                onChange={(e) => setMetaMensal(Number(e.target.value || 0))}
                style={styles.metaInput}
              />
            </div>
          </header>

          {mensagem ? <div style={styles.messageBanner}>{mensagem}</div> : null}

          <section style={styles.cardsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Receitas</div>
              <div style={styles.statValue}>{formatCurrency(receita)}</div>
              <div style={styles.statTagGreen}>Entradas</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statTitle}>Despesas</div>
              <div style={styles.statValue}>{formatCurrency(despesa)}</div>
              <div style={styles.statTagRed}>Saídas</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statTitle}>Saldo Atual</div>
              <div style={styles.statValue}>{formatCurrency(saldo)}</div>
              <div style={styles.statTagBlue}>Resultado</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statTitle}>Meta Mensal</div>
              <div style={styles.statValue}>{progressoMeta.toFixed(0)}%</div>
              <div style={styles.progressWrap}>
                <div style={{ ...styles.progressBar, width: `${progressoMeta}%` }} />
              </div>
            </div>
          </section>

          <section style={styles.contentGrid}>
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Novo Lançamento</h2>
                <span style={styles.panelHint}>Adicione receitas e despesas</span>
              </div>

              <div style={styles.formRow}>
                <input
                  style={styles.inputPremium}
                  type="number"
                  placeholder="Digite o valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />

                <select
                  style={styles.selectPremium}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>

                <button
                  style={styles.addButton}
                  onClick={adicionar}
                  disabled={loading}
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Meta Financeira</h2>
                <span style={styles.panelHint}>Evolução do objetivo mensal</span>
              </div>

              <div style={styles.goalValue}>{formatCurrency(metaMensal)}</div>
              <div style={styles.progressWrapLarge}>
                <div
                  style={{
                    ...styles.progressBarLarge,
                    width: `${progressoMeta}%`,
                  }}
                />
              </div>
              <div style={styles.goalFooter}>
                {formatCurrency(receita)} de {formatCurrency(metaMensal)}
              </div>
            </div>
          </section>

          <section style={styles.contentGrid}>
            <div style={styles.panelLarge}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Últimos 7 Dias</h2>
                <span style={styles.panelHint}>Gráfico automático</span>
              </div>

              <div style={styles.chartWrap}>
                {grafico7Dias.map((dia) => {
                  const receitaHeight = Math.max(
                    (dia.receita / maiorValorGrafico) * 140,
                    dia.receita > 0 ? 8 : 0
                  );
                  const despesaHeight = Math.max(
                    (dia.despesa / maiorValorGrafico) * 140,
                    dia.despesa > 0 ? 8 : 0
                  );

                  return (
                    <div key={dia.key} style={styles.chartColumn}>
                      <div style={styles.chartBars}>
                        <div
                          title={`Receita ${formatCurrency(dia.receita)}`}
                          style={{
                            ...styles.barReceita,
                            height: `${receitaHeight}px`,
                          }}
                        />
                        <div
                          title={`Despesa ${formatCurrency(dia.despesa)}`}
                          style={{
                            ...styles.barDespesa,
                            height: `${despesaHeight}px`,
                          }}
                        />
                      </div>
                      <div style={styles.chartLabel}>{dia.label}</div>
                    </div>
                  );
                })}
              </div>

              <div style={styles.chartLegend}>
                <div style={styles.legendItem}>
                  <span style={styles.legendReceita} />
                  Receita
                </div>
                <div style={styles.legendItem}>
                  <span style={styles.legendDespesa} />
                  Despesa
                </div>
              </div>
            </div>

            <div style={styles.panelLarge}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Histórico de Lançamentos</h2>
                <span style={styles.panelHint}>{dados.length} registros</span>
              </div>

              <div style={styles.historyList}>
                {dados.length === 0 ? (
                  <div style={styles.emptyState}>Nenhum lançamento ainda.</div>
                ) : (
                  dados.map((item) => (
                    <div key={item.id} style={styles.historyItem}>
                      <div>
                        <div style={styles.historyType}>
                          {item.tipo === "receita" ? "Receita" : "Despesa"}
                        </div>
                        <div style={styles.historyDate}>
                          {formatDate(item.created_at)}
                        </div>
                      </div>

                      <div
                        style={{
                          ...styles.historyValue,
                          color: item.tipo === "receita" ? "#7CFFB2" : "#FFB2B2",
                        }}
                      >
                        {formatCurrency(item.valor)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
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
    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
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
  logoBadge: {
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
  authSubtitle: {
    marginTop: 8,
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 1.5,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 12,
    fontSize: 16,
    color: "#0b3d91",
    fontWeight: 700,
  },
  authButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    border: "none",
    borderRadius: 14,
    padding: "14px 18px",
    background: "linear-gradient(135deg, #ffffff, #b6f3ff)",
    color: "#0b3d91",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid rgba(255,255,255,0.20)",
    borderRadius: 14,
    padding: "14px 18px",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  messageBox: {
    marginTop: 16,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
  },

  appBg: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #1f6bff 0%, #0d2f7c 32%, #081735 68%, #030814 100%)",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 20,
    maxWidth: 1400,
    margin: "0 auto",
  },
  sidebar: {
    minHeight: "calc(100vh - 40px)",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: 28,
    padding: 24,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
  },
  sidebarBrand: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 4,
  },
  sidebarMini: {
    opacity: 0.8,
    fontSize: 14,
  },
  sidebarSection: {
    marginTop: 28,
    display: "grid",
    gap: 10,
  },
  sidebarItemActive: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
    borderRadius: 14,
    padding: "14px 16px",
    fontWeight: 700,
  },
  sidebarItem: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: "14px 16px",
    opacity: 0.9,
  },
  sidebarFooter: {
    display: "grid",
    gap: 12,
  },
  userMail: {
    fontSize: 12,
    lineHeight: 1.5,
    opacity: 0.9,
    wordBreak: "break-word",
  },
  logoutButton: {
    border: "none",
    borderRadius: 14,
    padding: "12px 14px",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },

  main: {
    minHeight: "calc(100vh - 40px)",
    color: "#fff",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    padding: "8px 4px 22px",
    flexWrap: "wrap",
  },
  pageTitle: {
    margin: 0,
    fontSize: 36,
    fontWeight: 900,
  },
  pageSubtitle: {
    margin: "8px 0 0",
    opacity: 0.85,
  },
  metaBox: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 14,
    minWidth: 210,
  },
  metaLabel: {
    display: "block",
    fontSize: 12,
    opacity: 0.85,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  metaInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontWeight: 700,
    color: "#0b3d91",
  },
  messageBanner: {
    marginBottom: 18,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 16,
    padding: 14,
    fontWeight: 700,
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
    gap: 18,
  },
  statCard: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(18px)",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  statTitle: {
    opacity: 0.82,
    fontSize: 14,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 12,
  },
  statTagGreen: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(124,255,178,0.12)",
    color: "#7CFFB2",
    fontSize: 12,
    fontWeight: 700,
  },
  statTagRed: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,159,159,0.12)",
    color: "#FFB2B2",
    fontSize: 12,
    fontWeight: 700,
  },
  statTagBlue: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(183,234,255,0.12)",
    color: "#D6F7FF",
    fontSize: 12,
    fontWeight: 700,
  },
  progressWrap: {
    height: 10,
    background: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #8cf6ff, #ffffff)",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    marginTop: 18,
  },
  panel: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 22,
    backdropFilter: "blur(18px)",
  },
  panelLarge: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 22,
    backdropFilter: "blur(18px)",
    minHeight: 320,
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  panelTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
  },
  panelHint: {
    opacity: 0.8,
    fontSize: 13,
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
    gap: 12,
  },
  inputPremium: {
    border: "none",
    borderRadius: 16,
    padding: "16px 18px",
    fontSize: 16,
    color: "#0b3d91",
    fontWeight: 700,
  },
  selectPremium: {
    border: "none",
    borderRadius: 16,
    padding: "16px 18px",
    fontSize: 16,
    color: "#0b3d91",
    fontWeight: 700,
  },
  addButton: {
    border: "none",
    borderRadius: 16,
    padding: "16px 18px",
    background: "linear-gradient(135deg, #ffffff, #aef3ff)",
    color: "#0b3d91",
    fontWeight: 900,
    cursor: "pointer",
  },

  goalValue: {
    fontSize: 34,
    fontWeight: 900,
    marginBottom: 16,
  },
  progressWrapLarge: {
    height: 14,
    background: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBarLarge: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #6fffe9, #ffffff)",
  },
  goalFooter: {
    opacity: 0.9,
    fontWeight: 700,
  },

  chartWrap: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 200,
    marginTop: 12,
  },
  chartColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  chartBars: {
    height: 160,
    display: "flex",
    alignItems: "flex-end",
    gap: 6,
  },
  barReceita: {
    width: 18,
    borderRadius: "10px 10px 0 0",
    background: "linear-gradient(180deg, #8cf8b8, #1fe1a6)",
    minHeight: 4,
  },
  barDespesa: {
    width: 18,
    borderRadius: "10px 10px 0 0",
    background: "linear-gradient(180deg, #ffb0b0, #ff6f91)",
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    opacity: 0.9,
  },
  chartLegend: {
    display: "flex",
    gap: 18,
    marginTop: 18,
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    opacity: 0.92,
  },
  legendReceita: {
    width: 12,
    height: 12,
    borderRadius: 999,
    background: "#4dffc3",
  },
  legendDespesa: {
    width: 12,
    height: 12,
    borderRadius: 999,
    background: "#ff7f9e",
  },

  historyList: {
    display: "grid",
    gap: 12,
    marginTop: 10,
    maxHeight: 320,
    overflowY: "auto",
    paddingRight: 4,
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.08)",
  },
  historyType: {
    fontWeight: 800,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 13,
    opacity: 0.8,
  },
  historyValue: {
    fontWeight: 900,
    fontSize: 16,
  },
  emptyState: {
    opacity: 0.85,
    padding: "14px 0",
  },
};
