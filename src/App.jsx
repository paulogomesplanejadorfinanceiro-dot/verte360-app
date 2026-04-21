import { useEffect, useMemo, useState } from "react";
import { supabase } from "./services/supabase";
import "./app.css";

const WHATSAPP_NUMBER = "5511987835736";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("vertex360_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [tipo, setTipo] = useState("receita");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  const [agNome, setAgNome] = useState("");
  const [agData, setAgData] = useState("");
  const [agHora, setAgHora] = useState("");

  useEffect(() => {
    localStorage.setItem("vertex360_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Erro ao trocar code por sessão:", error.message);
          } else {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError.message);
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro na inicialização da autenticação:", err);
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
      console.error(error);
      return;
    }

    setUser(null);
  }

  function adicionarLancamento(e) {
    e.preventDefault();

    const numero = Number(String(valor).replace(",", "."));

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
    };

    setTransactions((prev) => [novo, ...prev]);
    setValor("");
    setDescricao("");
    setData(new Date().toISOString().slice(0, 10));
  }

  function removerLancamento(id) {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  }

  function enviarAgendamentoWhatsApp(e) {
    e.preventDefault();

    if (!agNome.trim() || !agData || !agHora) {
      alert("Preencha nome, data e horário.");
      return;
    }

    const mensagem = [
      "Olá, quero agendar uma consultoria na Vertex360.",
      "",
      `Nome: ${agNome}`,
      `Data: ${agData}`,
      `Horário: ${agHora}`,
      `Email do cliente: ${user?.email || ""}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");

    setAgNome("");
    setAgData("");
    setAgHora("");
  }

  const resumo = useMemo(() => {
    const receitas = transactions
      .filter((item) => item.tipo === "receita")
      .reduce((acc, item) => acc + item.valor, 0);

    const despesas = transactions
      .filter((item) => item.tipo === "despesa")
      .reduce((acc, item) => acc + item.valor, 0);

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
    };
  }, [transactions]);

  if (loading) {
    return (
      <div className="screen">
        <div className="card">
          <h1>Vertex360</h1>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="screen">
        <div className="login-card">
          <h1>Vertex360</h1>
          <p>Planejamento Financeiro</p>
          <button className="primary-btn" onClick={handleLogin}>
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h2>Vertex360</h2>
          <p className="sidebar-subtitle">Planejamento Financeiro</p>
        </div>

        <div className="user-box">
          <strong>{user.user_metadata?.full_name || "Cliente"}</strong>
          <span>{user.email}</span>
        </div>

        <button className="secondary-btn" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <h1>Menu principal</h1>
          <p>Receita, despesa, saldo e agendamento.</p>
        </header>

        <section className="cards-grid">
          <div className="info-card">
            <span>Receitas</span>
            <strong>R$ {resumo.receitas.toFixed(2)}</strong>
          </div>

          <div className="info-card">
            <span>Despesas</span>
            <strong>R$ {resumo.despesas.toFixed(2)}</strong>
          </div>

          <div className="info-card">
            <span>Saldo</span>
            <strong>R$ {resumo.saldo.toFixed(2)}</strong>
          </div>
        </section>

        <section className="panel">
          <h2>Agendar consultoria</h2>
          <form className="form-grid" onSubmit={enviarAgendamentoWhatsApp}>
            <input
              type="text"
              placeholder="Seu nome"
              value={agNome}
              onChange={(e) => setAgNome(e.target.value)}
            />
            <input
              type="date"
              value={agData}
              onChange={(e) => setAgData(e.target.value)}
            />
            <input
              type="time"
              value={agHora}
              onChange={(e) => setAgHora(e.target.value)}
            />
            <button className="primary-btn" type="submit">
              Agendar no WhatsApp
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>Lançamentos</h2>

          <form className="form-grid" onSubmit={adicionarLancamento}>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>

            <input
              type="text"
              placeholder="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <button className="primary-btn" type="submit">
              Adicionar
            </button>
          </form>

          <div className="list">
            {transactions.length === 0 ? (
              <p className="empty-text">Nenhum lançamento ainda.</p>
            ) : (
              transactions.map((item) => (
                <div className="list-item" key={item.id}>
                  <div>
                    <strong>{item.descricao}</strong>
                    <p>
                      {item.tipo} • {item.data}
                    </p>
                  </div>

                  <div className="list-right">
                    <strong>
                      {item.tipo === "despesa" ? "- " : "+ "}R$ {item.valor.toFixed(2)}
                    </strong>
                    <button
                      className="danger-btn"
                      onClick={() => removerLancamento(item.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
